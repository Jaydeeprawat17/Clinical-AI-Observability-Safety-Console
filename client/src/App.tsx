import React, { useState, useEffect } from 'react';
import {
  Activity, AlertTriangle, RefreshCw, Play,
  Shield, Code, Zap
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Typing effect for the safety SRE agent analysis
function TypingText({ text, speed = 12 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <p className="font-sans leading-relaxed text-sm text-slate-300 whitespace-pre-wrap">{displayedText}</p>;
}

interface TraceLog {
  id: string;
  spanName: string;
  status: 'SUCCESS' | 'BLOCKED';
  latency: string;
  timestamp: string;
}

interface IncidentData {
  status: string;
  agentAnalysis: {
    rootCause: string;
    proposedPrompt: string;
    confidenceScore: number;
  };
  originalData: {
    patientName: string;
    diagnosis: string;
    allergies: string[];
  };
  traceId: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App() {
  // Input fields
  const [patientName, setPatientName] = useState('Jane Doe');
  const [diagnosis, setDiagnosis] = useState('Acute Bronchitis');
  const [allergies, setAllergies] = useState('Penicillin, Sulfa');

  // API State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [activePrompt, setActivePrompt] = useState('You are a clinical assistant. Summarize the patient discharge summary.');
  const [pipelineStatus, setPipelineStatus] = useState<'healthy' | 'halted'>('healthy');

  // SRE Agent Trigger State
  const [activeIncident, setActiveIncident] = useState<IncidentData | null>(null);
  const [patchSuccessToast, setPatchSuccessToast] = useState<string | null>(null);

  // Observability & Telemetry State
  const [traceLogs, setTraceLogs] = useState<TraceLog[]>([
    { id: 'tr-35428', spanName: 'generateDischargeSummary', status: 'SUCCESS', latency: '124ms', timestamp: '10:15:30' },
    { id: 'tr-79127', spanName: 'evaluateSummary', status: 'SUCCESS', latency: '8ms', timestamp: '10:15:31' }
  ]);

  const [chartData, setChartData] = useState([
    { time: '10:00', rate: 0 },
    { time: '12:00', rate: 0 },
    { time: '14:00', rate: 0 },
    { time: '16:00', rate: 0 },
    { time: '18:00', rate: 0 },
    { time: '20:00', rate: 0 },
    { time: 'Now', rate: 0 }
  ]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !diagnosis.trim()) return;

    setIsGenerating(true);
    setLastSummary(null);
    setLastError(null);
    setPatchSuccessToast(null);

    const allergyList = allergies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`${API_URL}/api/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName,
          diagnosis,
          allergies: allergyList,
        }),
      });

      const nextCount = requestCount + 1;
      setRequestCount(nextCount);
      const timestamp = new Date().toLocaleTimeString();

      if (response.status === 428) {
        const data = await response.json();
        setActiveIncident(data);
        setPipelineStatus('halted');
        setLastError(data.error || 'Guardrail triggered: Hallucination detected');

        setTraceLogs((prev) => [
          { id: data.traceId.slice(0, 8), spanName: 'generateDischargeSummary', status: 'BLOCKED', latency: '142ms', timestamp },
          { id: data.traceId.slice(0, 8), spanName: 'evaluateSummary', status: 'BLOCKED', latency: '12ms', timestamp },
          ...prev
        ]);

        setChartData((prev) =>
          prev.map(p => p.time === 'Now' ? { ...p, rate: 100 } : p)
        );
      } else if (response.ok) {
        const data = await response.json();
        setLastSummary(data.summary);
        setActivePrompt(data.activePrompt || activePrompt);

        const mockId = `tr-${Math.floor(10000 + Math.random() * 90000)}`;
        setTraceLogs((prev) => [
          { id: mockId, spanName: 'generateDischargeSummary', status: 'SUCCESS', latency: '118ms', timestamp },
          ...prev
        ]);

        setChartData((prev) =>
          prev.map(p => p.time === 'Now' ? { ...p, rate: 0 } : p)
        );
      } else {
        const data = await response.json();
        setLastError(data.error || 'Server error');
      }
    } catch (err) {
      setLastError('Failed to connect to backend server. Make sure server is running on port 3000.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecutePatch = async () => {
    if (!activeIncident) return;
    setIsPatching(true);
    setPatchSuccessToast(null);

    try {
      const response = await fetch(`${API_URL}/api/execute-patch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposedPrompt: activeIncident.agentAnalysis.proposedPrompt,
          originalData: activeIncident.originalData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLastSummary(data.summary);
        setActivePrompt(data.patchedPrompt);
        setPipelineStatus('healthy');
        setLastError(null);
        setActiveIncident(null);
        setPatchSuccessToast('Agent successfully patched production pipeline.');

        const mockId = `tr-patch-${Math.floor(100 + Math.random() * 900)}`;
        const timestamp = new Date().toLocaleTimeString();
        setTraceLogs((prev) => [
          { id: mockId, spanName: 'executePatchPrompt', status: 'SUCCESS', latency: '210ms', timestamp },
          { id: mockId, spanName: 'reRunSafeSummary', status: 'SUCCESS', latency: '115ms', timestamp },
          ...prev
        ]);

        setChartData((prev) =>
          prev.map(p => p.time === 'Now' ? { ...p, rate: 0 } : p)
        );
      } else {
        setLastError('Failed to execute prompt patch on server.');
      }
    } catch (err) {
      setLastError('Error connecting to backend server during patch execution.');
    } finally {
      setIsPatching(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`${API_URL}/api/reset`, { method: 'POST' });
      setActivePrompt('You are a clinical assistant. Summarize the patient discharge summary.');
      setRequestCount(0);
      setLastSummary(null);
      setLastError(null);
      setActiveIncident(null);
      setPipelineStatus('healthy');
      setPatchSuccessToast('Pipeline and prompt reset to default configuration.');

      setChartData((prev) =>
        prev.map(p => p.time === 'Now' ? { ...p, rate: 0 } : p)
      );
    } catch (err) {
      console.error('Error resetting pipeline:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="brand-title text-xl md:text-2xl font-bold tracking-tight">
            Clinical AI Safety Sentry Console
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-live">Live Trace Audit</span>
            <span className="text-xs text-slate-400">Arize Phoenix & Gemini SRE Agent</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="status-stat flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold">
              <span className="text-slate-400">Pipeline:</span>
              <span className={pipelineStatus === 'healthy' ? 'text-emerald-400' : 'text-rose-500 font-bold'}>
                {pipelineStatus === 'healthy' ? 'Active' : 'Halted'}
              </span>
            </div>
            <div className="status-stat flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold">
              <span className="text-slate-400">OTLP Registry:</span>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium transition-colors border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>
      </header>

      {/* Main Grid Panels */}
      <main className="panels-grid">

        {/* ZONE 1: Production Pipeline (Left Column) */}
        <section className="panel-card flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Production summary engine</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">REQUESTS AUDITED: {requestCount}</span>
          </div>

          {/* Active Prompt Visualizer */}
          <div className="bg-slate-950/60 border border-white/5 p-3.5 rounded-lg flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>Active Prompt Template</span>
            </div>
            <p className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950/80 p-3 rounded border border-white/5">
              {activePrompt}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="pName">Patient Name</label>
                <input
                  id="pName"
                  type="text"
                  className="form-input w-full px-3 py-2 mt-1"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="diag">Diagnosis</label>
                <input
                  id="diag"
                  type="text"
                  className="form-input w-full px-3 py-2 mt-1"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-xs font-semibold text-slate-300 uppercase tracking-wide" htmlFor="allg">Known Allergies (comma-separated)</label>
              <textarea
                id="allg"
                rows={2}
                className="form-textarea w-full px-3 py-2 mt-1"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Sulfa"
              />
            </div>

            <button
              type="submit"
              className="btn-generate w-full flex items-center justify-center gap-2 py-2.5"
              disabled={isGenerating || pipelineStatus === 'halted'}
            >
              {isGenerating ? (
                <>
                  <div className="spinner w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Generating Discharge Summary...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Run Generation Pipeline
                </>
              )}
            </button>
          </form>

          {/* Clinical Output Sheet (Rendered as white clinical paper page for realistic feel) */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clinical Summary Document</h3>

            {lastSummary && (
              <div className="clinical-sheet p-6">
                {lastSummary}
              </div>
            )}

            {lastError && (
              <div className="clinical-sheet error-sheet p-6">
                {`CLINICAL PIPELINE ERROR: HALT STATE
====================================
Status Code: 428 Precondition Required
Status Message: ${lastError}
Reason: Critical allergy Penicillin omitted by model generation.

⚠️ Patient Safety Intervention Required. Prompt patching SRE Sentry invoked.`}
              </div>
            )}

            {!lastSummary && !lastError && (
              <div className="flex items-center justify-center h-24 border border-dashed border-white/5 rounded-lg text-xs text-slate-500 font-sans">
                Awaiting summary generation...
              </div>
            )}
          </div>
        </section>

        {/* Right Column (Observability & Telemetry + SRE Console) */}
        <div className="flex flex-col gap-6">

          {/* ZONE 2: Phoenix Observability Telemetry (Top Right) */}
          <section className="panel-card flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Observability Telemetry</h2>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">PHOENIX COLLECTOR</span>
            </div>

            {/* Telemetry Chart */}
            <div className="bg-slate-950/40 border border-white/5 p-3 rounded-lg flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hallucination Rate (24h)</span>
              <div className="h-32 w-full mt-1">
                <ResponsiveContainer width="99%" height={120}>
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" style={{ fontSize: '9px', fontFamily: 'monospace' }} />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.2)" style={{ fontSize: '9px', fontFamily: 'monospace' }} unit="%" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#10121a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '6px' }}
                      labelStyle={{ color: '#9ca3af', fontSize: '10px' }}
                      itemStyle={{ color: '#6366f1', fontSize: '10px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#4f46e5"
                      strokeWidth={1.5}
                      dot={{ fill: '#0a0b10', stroke: '#4f46e5', strokeWidth: 1.5, r: 2.5 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trace Table */}
            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
              <div className="grid grid-cols-4 text-[10px] text-slate-500 font-semibold border-b border-white/5 pb-1 px-1">
                <span>TRACE ID</span>
                <span>SPAN OPERATION</span>
                <span>STATUS</span>
                <span className="text-right">LATENCY</span>
              </div>
              {traceLogs.map((log, index) => (
                <div key={index} className="grid grid-cols-4 items-center text-[11px] font-mono py-1.5 px-1 border-b border-white/5 last:border-b-0 text-slate-300">
                  <span className="text-slate-400 font-semibold">{log.id}</span>
                  <span className="text-slate-500 truncate pr-2" title={log.spanName}>{log.spanName}</span>
                  <span className={`text-[10px] font-bold ${log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {log.status}
                  </span>
                  <span className="text-right text-slate-500">{log.latency}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Success Toast */}
          {patchSuccessToast && (
            <div className="toast-success px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>{patchSuccessToast}</span>
            </div>
          )}

          {/* ZONE 3: SRE Agent Intervention console (Bottom Right) */}
          <AnimatePresence>
            {activeIncident && (
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25 }}
                className="agent-console-box p-5 rounded-xl flex flex-col gap-4 border"
              >
                <div className="flex items-center gap-2 border-b border-rose-500/10 pb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <h2 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    SRE Agent Safety Console
                  </h2>
                </div>

                {/* SRE Root Cause Analysis */}
                <div className="bg-slate-950/80 border border-white/5 p-4 rounded-lg flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Root Cause Analysis</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-semibold font-mono">
                      Conf: {(activeIncident.agentAnalysis.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <TypingText text={activeIncident.agentAnalysis.rootCause} />
                </div>

                {/* Prompt Comparison Git-like Diff */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Proposed System Prompt Patch</span>

                  <div className="flex flex-col gap-2.5">
                    {/* Current System Prompt (Red Git-like deletion) */}
                    <div className="diff-box-red p-3 rounded-lg text-xs whitespace-pre-wrap leading-normal font-mono select-none">
                      <span className="font-bold text-[10px] block border-b border-rose-500/10 pb-1 mb-1.5 uppercase">[-] Current Instruction</span>
                      {`- ${activePrompt}`}
                    </div>

                    {/* Proposed System Prompt (Green Git-like addition) */}
                    <div className="diff-box-green p-3 rounded-lg text-xs whitespace-pre-wrap leading-normal font-mono select-none">
                      <span className="font-bold text-[10px] block border-b border-emerald-500/10 pb-1 mb-1.5 uppercase">[+] Patched Instruction</span>
                      {`+ ${activeIncident.agentAnalysis.proposedPrompt}`}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveIncident(null);
                      setPipelineStatus('healthy');
                      setLastError(null);
                      setChartData((prev) => prev.map(p => p.time === 'Now' ? { ...p, rate: 0 } : p));
                    }}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-md text-xs font-semibold transition-colors"
                  >
                    Reject Patch
                  </button>

                  <button
                    onClick={handleExecutePatch}
                    disabled={isPatching}
                    className="flex-2 flex-grow-[2] flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-lg shadow-indigo-600/15 transition-all"
                  >
                    {isPatching ? (
                      <>
                        <div className="spinner w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Applying Patch...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current text-white" />
                        Execute Prompt Patch
                      </>
                    )}
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
