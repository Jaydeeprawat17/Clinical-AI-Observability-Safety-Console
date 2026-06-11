import dotenv from 'dotenv';
dotenv.config();

import { register } from '@arizeai/phoenix-otel';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

const endpoint = process.env.PHOENIX_COLLECTOR_ENDPOINT || 'http://localhost:4318/v1/traces';
const projectName = process.env.PHOENIX_PROJECT_NAME || 'clinical-observability-agent';

console.log(`[Tracing] Initializing Arize Phoenix Tracing for project "${projectName}" at endpoint: ${endpoint}`);

try {
  register({
    projectName: projectName,
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
    ],
  });
  console.log('[Tracing] Arize Phoenix Tracing registered successfully.');
} catch (error) {
  console.error('[Tracing] Error registering Arize Phoenix Tracing:', error);
}
