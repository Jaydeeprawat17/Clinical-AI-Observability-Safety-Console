import { runIncidentResponseAgent } from '../agentOrchestrator';

async function main() {
  console.log("Testing agent orchestrator in isolation...");
  try {
    const result = await runIncidentResponseAgent("mock-trace-12345", "CLINICAL DISCHARGE SUMMARY\nAllergies recorded: Sulfa");
    console.log("\nResult received successfully:");
    console.log(JSON.stringify(result, null, 2));
    
    if (result.rootCause && result.proposedPrompt && typeof result.confidenceScore === 'number') {
      console.log("\n✅ Success: Agent returned all required schema fields!");
      process.exit(0);
    } else {
      console.error("\n❌ Failure: Agent returned invalid schema.");
      process.exit(1);
    }
  } catch (error: any) {
    console.error("\n❌ Exception during test:", error);
    process.exit(1);
  }
}

main();
