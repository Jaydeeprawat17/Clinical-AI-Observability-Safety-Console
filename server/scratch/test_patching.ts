import http from 'http';

function makeRequest(path: string, method: string, payload: any): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          body: body
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("Starting backend upgrade verification tests...");
  try {
    // 1. Reset server state
    await makeRequest('/api/reset', 'POST', {});
    console.log("✅ State Reset successful.");

    const patientPayload = {
      patientName: "John Doe",
      diagnosis: "Severe Infection",
      allergies: ["Penicillin", "Sulfa"]
    };

    let savedIncidentData: any = null;

    for (let i = 1; i <= 5; i++) {
      console.log(`\nSending request #${i} to /api/generate-summary...`);
      const response = await makeRequest('/api/generate-summary', 'POST', patientPayload);
      
      console.log(`Status Code: ${response.statusCode}`);
      
      if (i === 5) {
        if (response.statusCode === 428) {
          const parsed = JSON.parse(response.body);
          console.log(`✅ Success: Request #5 returned HTTP 428 Precondition Required.`);
          console.log(`Status Payload: ${parsed.status}`);
          console.log(`RCA: ${parsed.agentAnalysis.rootCause}`);
          console.log(`Proposed Prompt: "${parsed.agentAnalysis.proposedPrompt}"`);
          
          savedIncidentData = parsed;
        } else {
          throw new Error(`❌ Failure: Request #5 should have returned 428 but returned ${response.statusCode}`);
        }
      } else {
        if (response.statusCode === 200) {
          console.log(`✅ Success: Request #${i} returned 200 (Normal).`);
        } else {
          throw new Error(`❌ Failure: Request #${i} should have succeeded but returned ${response.statusCode}`);
        }
      }
    }

    if (!savedIncidentData) {
      throw new Error("❌ Error: No incident data captured from request #5");
    }

    // 2. Trigger hot-patching using the SRE Agent's proposed prompt
    console.log(`\nSending patch request to /api/execute-patch...`);
    const patchPayload = {
      proposedPrompt: savedIncidentData.agentAnalysis.proposedPrompt,
      originalData: savedIncidentData.originalData
    };

    const patchResponse = await makeRequest('/api/execute-patch', 'POST', patchPayload);
    console.log(`Status Code: ${patchResponse.statusCode}`);
    
    if (patchResponse.statusCode === 200) {
      const parsedPatch = JSON.parse(patchResponse.body);
      console.log("✅ Success: Hot-patch API succeeded.");
      console.log(`Patched prompt state: "${parsedPatch.patchedPrompt}"`);
      
      const containsPenicillin = parsedPatch.summary.toLowerCase().includes('penicillin');
      console.log(`Re-run summary contains 'penicillin': ${containsPenicillin}`);
      
      if (containsPenicillin) {
        console.log("✅ Success: Final summary is SAFE and penicillin allergy is included!");
      } else {
        throw new Error("❌ Failure: Summary generated after patch still omitted penicillin.");
      }
    } else {
      throw new Error(`❌ Failure: Patch endpoint returned status ${patchResponse.statusCode}`);
    }

    // 3. Reset pipeline back to normal for future test runs
    await makeRequest('/api/reset', 'POST', {});
    console.log("\n✅ End-to-end flow validation completed successfully!");
    process.exit(0);

  } catch (error: any) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run test with a small delay to let ts-node-dev reload index.ts
setTimeout(runTests, 2500);
