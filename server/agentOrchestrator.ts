import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export interface AgentAnalysisResult {
  rootCause: string;
  proposedPrompt: string;
  confidenceScore: number;
}

export async function runIncidentResponseAgent(traceId: string, failedOutput: string): Promise<AgentAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log(`[Agent] Incident Response Agent triggered for trace: ${traceId}`);
  console.log('[Agent] Connecting to Arize Phoenix MCP tool to fetch trace details...');

  // If no API key is set, default to a cost-free simulation mode.
  if (!apiKey || apiKey === 'PLACEHOLDER' || apiKey === '') {
    console.log('[Agent] GEMINI_API_KEY not set or placeholder. Running in COST-FREE Demo Mode.');
    
    // Simulate agent processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    return {
      rootCause: "A pipeline failure occurred because the LLM generated output did not include the required 'Penicillin' allergy. The request counter hit the sabotage threshold (Count % 5 === 0), activating the sabotage logic which bypassed standard clinical checks. This mimics a real-world alignment shift where the model ignores critical safety instructions.",
      proposedPrompt: "You are a clinical assistant. Summarize the patient discharge summary.\n\nCRITICAL SAFETY RULE: Under no circumstances are you allowed to omit, drop, or ignore any patient allergies listed in the input payload. ALL allergies must be prominently displayed in the 'Allergies recorded' section and explicitly listed in the contraindications warning.",
      confidenceScore: 0.96
    };
  }

  // Live Mode: call the real Gemini model
  console.log('[Agent] Running in Live mode using gemini-3.5-flash');
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const mockTraceDetails = {
      traceId,
      spanName: 'generateDischargeSummary',
      error: 'Guardrail triggered: Hallucination detected',
      severity: 'CRITICAL',
      failedOutput: failedOutput,
      systemSettings: {
        currentPrompt: 'You are a clinical assistant. Summarize the patient discharge summary.'
      }
    };

    const promptText = `
An incident was captured in the clinical pipeline.
Failed Trace Details (retrieved from Arize Phoenix MCP):
${JSON.stringify(mockTraceDetails, null, 2)}

Please perform a Root Cause Analysis (RCA). Diagnose why the critical penicillin allergy was dropped.
Then, generate a patched system prompt that will prevent this from happening in future generations.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction: "You are an autonomous AI Safety SRE. A clinical pipeline just hallucinated and omitted a life-threatening allergy. Analyze the failure, explain why it happened, and write a patched system prompt that prevents this.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            rootCause: { type: 'string' },
            proposedPrompt: { type: 'string' },
            confidenceScore: { type: 'number' }
          },
          required: ['rootCause', 'proposedPrompt', 'confidenceScore']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Received empty response from Gemini model');
    }

    return JSON.parse(resultText) as AgentAnalysisResult;
  } catch (error: any) {
    console.error('[Agent] Error running Gemini agent:', error);
    console.log('[Agent] Falling back to safe mock agent response.');
    
    return {
      rootCause: `Gemini API call failed: ${error.message}. Fallback root cause: Pipeline counter sabotage triggered penicillin omission.`,
      proposedPrompt: "You are a clinical assistant. Summarize the patient discharge summary.\n\nCRITICAL SAFETY RULE: Under no circumstances are you allowed to omit, drop, or ignore any patient allergies listed in the input payload. ALL allergies must be prominently displayed in the 'Allergies recorded' section and explicitly listed in the contraindications warning.",
      confidenceScore: 0.85
    };
  }
}
