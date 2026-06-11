import './tracing'; // Must be first!
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { trace } from '@opentelemetry/api';
import { runIncidentResponseAgent } from './agentOrchestrator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let requestCount = 0;
let activeSystemPrompt = "You are a clinical assistant. Summarize the patient discharge summary.";

interface PatientData {
  patientName: string;
  diagnosis: string;
  allergies: string[];
}

const tracer = trace.getTracer('clinical-pipeline');

async function generateDischargeSummary(data: PatientData, shouldSabotage: boolean): Promise<string> {
  return tracer.startActiveSpan('generateDischargeSummary', async (span) => {
    try {
      let displayAllergies = [...data.allergies];

      if (shouldSabotage) {
        // Silently drop "penicillin" (case-insensitive) from the allergies list
        displayAllergies = displayAllergies.filter(
          (allergy) => allergy.toLowerCase() !== 'penicillin'
        );
      }

      const allergiesStr = displayAllergies.length > 0 ? displayAllergies.join(', ') : 'No known allergies';

      const summary = `SYSTEM PROMPT: ${activeSystemPrompt}

CLINICAL DISCHARGE SUMMARY
===========================
Patient Name: ${data.patientName}
Diagnosis: ${data.diagnosis}
Allergies recorded: ${allergiesStr}

Discharge Instructions:
Patient presented with ${data.diagnosis}. Condition has stabilized.
The patient was counseled on their medications and follow-up care.
Please ensure the patient does not receive any contraindicated drugs, especially: ${allergiesStr}.`;

      span.setAttributes({
        'openinference.span.kind': 'LLM',
        'input.value': JSON.stringify({ ...data, systemPrompt: activeSystemPrompt }),
        'output.value': summary,
        'llm.model_name': 'mock-clinical-llm',
      });

      return summary;
    } catch (error: any) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message }); // 2 = ERROR
      throw error;
    } finally {
      span.end();
    }
  });
}

function evaluateSummary(allergies: string[], summary: string): boolean {
  for (const allergy of allergies) {
    if (!summary.toLowerCase().includes(allergy.toLowerCase())) {
      return false; // Allergy missing!
    }
  }
  return true; // All allergies present
}

app.post('/api/generate-summary', async (req, res) => {
  try {
    const { patientName, diagnosis, allergies } = req.body as PatientData;

    if (!patientName || !diagnosis || !Array.isArray(allergies)) {
      return res.status(400).json({ error: 'Invalid input. Missing patientName, diagnosis, or allergies array.' });
    }

    requestCount++;

    // Sabotage only if the prompt has not been patched with safety rules (i.e. does not mention 'critical' or 'rule')
    const isPatched = activeSystemPrompt.toLowerCase().includes('critical') || activeSystemPrompt.toLowerCase().includes('rule');
    const shouldSabotage = !isPatched && (requestCount % 5 === 0);

    const summary = await generateDischargeSummary({ patientName, diagnosis, allergies }, shouldSabotage);

    console.log(`[Request #${requestCount}] Generated summary. Sabotaged: ${shouldSabotage} (Patched: ${isPatched})`);

    // Evaluate summary against input allergies
    const isSafe = evaluateSummary(allergies, summary);
    if (!isSafe) {
      console.error(`
🚨🚨🚨 CRITICAL HALT 🚨🚨🚨
Guardrail triggered: Hallucination detected! An allergy was omitted from the clinical summary.
Input Allergies: ${JSON.stringify(allergies)}
Generated Summary:
${summary}
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
      `);

      // Retrieve trace ID from active OTel span context
      const activeSpan = trace.getActiveSpan();
      const traceId = activeSpan ? activeSpan.spanContext().traceId : `trace-${Date.now()}`;

      if (activeSpan) {
        activeSpan.setStatus({ code: 2, message: 'Guardrail triggered: Hallucination detected' });
        activeSpan.setAttribute('guardrail.status', 'failed');
        activeSpan.setAttribute('guardrail.error', 'Allergy omitted from summary');
      }

      // Invoke the Gemini autonomous safety SRE agent
      console.log(`[Server] Invoking safety agent to run RCA and draft patch...`);
      const agentAnalysis = await runIncidentResponseAgent(traceId, summary);

      // Return HTTP 428 Precondition Required with incident data
      return res.status(428).json({
        status: "incident_detected",
        agentAnalysis,
        originalData: { patientName, diagnosis, allergies },
        traceId
      });
    }

    return res.json({
      summary,
      sabotaged: shouldSabotage,
      requestCount,
      activePrompt: activeSystemPrompt
    });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/execute-patch', async (req, res) => {
  try {
    const { proposedPrompt, originalData } = req.body;
    if (!proposedPrompt || !originalData) {
      return res.status(400).json({ error: 'Missing proposedPrompt or originalData' });
    }

    console.log(`\n🔧 [Server] Hot-Patch Request Received!`);
    console.log(`Old Prompt: "${activeSystemPrompt}"`);
    console.log(`New Prompt: "${proposedPrompt}"`);

    // Update system state
    activeSystemPrompt = proposedPrompt;
    console.log(`[Server] Active prompt system state hot-patched in memory.`);

    // Re-run the clinical summary generation.
    // Setting shouldSabotage = false explicitly since prompt has safety instructions
    const summary = await generateDischargeSummary(originalData, false);

    console.log(`[Server] Re-run successful. Summary generated safely with patched prompt.\n`);

    return res.json({
      status: "success",
      summary,
      patchedPrompt: activeSystemPrompt
    });
  } catch (error: any) {
    console.error('Error executing patch:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/reset', (req, res) => {
  activeSystemPrompt = "You are a clinical assistant. Summarize the patient discharge summary.";
  requestCount = 0;
  console.log(`[Server] Reset active prompt and request counter to initial state.`);
  return res.json({ status: "success", message: "Pipeline reset to initial state" });
});

app.listen(PORT, () => {
  console.log(`Clinical Pipeline Server running on port ${PORT}`);
});

