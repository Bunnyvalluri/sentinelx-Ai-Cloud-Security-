import { useState, useRef, useEffect, useCallback } from 'react';

/* ── ICONS ── */
const Ic = {
  Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  Stop: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>,
  Plus: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>,
  Brain: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.79A2.5 2.5 0 0 1 5 11.5a2.5 2.5 0 0 1 2.79-2.49 2.5 2.5 0 0 1 1.71-6.51z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.79A2.5 2.5 0 0 0 19 11.5a2.5 2.5 0 0 0-2.79-2.49 2.5 2.5 0 0 0-1.71-6.51z" /></svg>,
  User: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Copy: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  Refresh: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" /></svg>,
  File: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  Chat: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  ChevronDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
};

/* ── MODELS ── */
const MODELS = [
  { id: 'meta/llama-3.3-70b-instruct', label: 'Llama 3.3 70B', badge: 'Fast', color: '#22c55e' },
  { id: 'mistralai/mixtral-8x22b-instruct-v0.1', label: 'Mixtral 8x22B', badge: 'Balanced', color: '#38bdf8' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', label: 'Nemotron 70B', badge: 'Smart', color: '#a78bfa' },
  { id: 'google/gemma-3-27b-it', label: 'Gemma 3 27B', badge: 'Creative', color: '#f59e0b' },
];

/* ── QUICK PROMPTS ── */
const QUICK = [
  { icon: '🛡', text: 'What is Zero-Trust security architecture?' },
  { icon: '🧠', text: 'Explain how RAG pipelines work step by step' },
  { icon: '⚙️', text: 'Design a scalable microservices system' },
  { icon: '🐍', text: 'Write a Python script to parse security logs' },
  { icon: '☁️', text: 'Best practices for AWS IAM and cloud security' },
  { icon: '📊', text: 'How do neural networks learn?' },
];

/* ── SYSTEM PROMPT ── */
const SYSTEM = `You are CEREBRO AI — an expert assistant integrated into SentinelX, a cloud security platform. You are knowledgeable about: cybersecurity, cloud infrastructure, software engineering, AI/ML, data science, mathematics, general programming, and any other topic.

FORMATTING RULES:
- Use markdown: **bold**, \`code\`, headers (##, ###), bullet lists (-)
- For code: always use fenced code blocks with language tag
- Be thorough but concise
- When answering security questions, provide actionable advice
- Structure long answers with clear sections`;

/* ── MARKDOWN RENDERER ── */
function MD({ text }) {
  const lines = (text || '').split('\n');
  const out = [];
  let inCode = false, codeLang = '', codeLines = [], i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (!inCode) { inCode = true; codeLang = line.slice(3).trim(); codeLines = []; }
      else {
        out.push(
          <div key={i} style={{ position: 'relative', marginTop: 12, marginBottom: 8 }}>
            {codeLang && <div style={{ position: 'absolute', top: 8, right: 12, fontSize: 10, color: '#6b7280', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>{codeLang}</div>}
            <pre style={{ background: 'rgba(0,0,0,0.50)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', overflowX: 'auto', margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, lineHeight: 1.65, color: '#a5f3c0' }}>
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        inCode = false; codeLines = [];
      }
    } else if (inCode) {
      codeLines.push(line);
    } else if (line.startsWith('### ')) {
      out.push(<h3 key={i} style={{ fontSize: 14, fontWeight: 700, color: '#c4b5fd', marginTop: 16, marginBottom: 6 }}>{inl(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      out.push(<h2 key={i} style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', marginTop: 18, marginBottom: 8, borderBottom: '1px solid rgba(139,92,246,0.2)', paddingBottom: 6 }}>{inl(line.slice(3))}</h2>);
    } else if (line.startsWith('# ')) {
      out.push(<h1 key={i} style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 20, marginBottom: 10 }}>{inl(line.slice(2))}</h1>);
    } else if (/^[-*] /.test(line)) {
      out.push(<div key={i} style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 13.5 }}><span style={{ color: '#8b5cf6', lineHeight: '22px', flexShrink: 0 }}>•</span><span style={{ lineHeight: 1.65 }}>{inl(line.slice(2))}</span></div>);
    } else if (/^\d+\. /.test(line)) {
      const n = line.match(/^(\d+)\./)[1];
      out.push(<div key={i} style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 13.5 }}><span style={{ color: '#8b5cf6', minWidth: 20, fontWeight: 600 }}>{n}.</span><span style={{ lineHeight: 1.65 }}>{inl(line.replace(/^\d+\. /, ''))}</span></div>);
    } else if (line.startsWith('> ')) {
      out.push(<blockquote key={i} style={{ borderLeft: '3px solid #6366f1', paddingLeft: 12, marginTop: 8, marginBottom: 8, color: '#9ca3af', fontStyle: 'italic', fontSize: 13.5 }}>{inl(line.slice(2))}</blockquote>);
    } else if (line.trim() === '') {
      out.push(<div key={i} style={{ height: 8 }} />);
    } else {
      out.push(<p key={i} style={{ fontSize: 13.5, lineHeight: 1.7, marginTop: 2 }}>{inl(line)}</p>);
    }
    i++;
  }
  return <div style={{ color: '#d1d5db' }}>{out}</div>;
}

function inl(text) {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} style={{ color: '#f3f4f6', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', padding: '1px 6px', borderRadius: 5, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.88em', color: '#c4b5fd' }}>{p.slice(1, -1)}</code>;
    if (p.startsWith('*') && p.endsWith('*')) return <em key={i} style={{ color: '#d1d5db' }}>{p.slice(1, -1)}</em>;
    return p;
  });
}

/* ── MAIN PAGE ── */
export default function ChatbotPage() {
  const [conversations, setConversations] = useState([
    { id: '1', title: 'New conversation', messages: [], createdAt: new Date() }
  ]);
  const [activeId, setActiveId] = useState('1');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const [showModels, setShowModels] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pipeline, setPipeline] = useState(null); // 'thinking'|'streaming'|null
  const [tokenCount, setTokenCount] = useState(0);
  const abortRef = useRef(null);
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  const convo = conversations.find(c => c.id === activeId);
  const msgs = convo?.messages || [];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);
  useEffect(() => { textareaRef.current?.focus(); }, [activeId]);

  /* new chat */
  const newChat = () => {
    const id = Date.now().toString();
    setConversations(p => [{ id, title: 'New conversation', messages: [], createdAt: new Date() }, ...p]);
    setActiveId(id);
    setInput('');
    setUploadedFiles([]);
  };

  /* delete chat */
  const deleteChat = (id, e) => {
    e.stopPropagation();
    setConversations(p => p.filter(c => c.id !== id));
    if (activeId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length) setActiveId(remaining[0].id);
      else newChat();
    }
  };

  /* update conversation title from first user message */
  const updateTitle = (id, userMsg) => {
    setConversations(p => p.map(c => c.id === id ? { ...c, title: userMsg.slice(0, 40) + (userMsg.length > 40 ? '…' : '') } : c));
  };

  /* copy message */
  const copy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  /* handle file upload */
  const onFile = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => setUploadedFiles(p => [...p, { name: f.name, content: ev.target.result.slice(0, 4000), type: f.type }]);
      reader.readAsText(f);
    });
    e.target.value = '';
  };

  /* SEND */
  const send = useCallback(async (userText) => {
    const text = userText || input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: text, ts: new Date(), files: uploadedFiles.map(f => f.name) };
    setUploadedFiles([]);
    setLoading(true);
    setPipeline('thinking');

    // append user message
    setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c));
    if (msgs.length === 0) updateTitle(activeId, text);

    await new Promise(r => setTimeout(r, 600));
    setPipeline('streaming');

    // file context
    const fileCtx = uploadedFiles.length > 0
      ? '\n\n[UPLOADED FILES CONTEXT]:\n' + uploadedFiles.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n')
      : '';

    // append empty assistant message for streaming
    const aMsg = { role: 'assistant', content: '', ts: new Date(), streaming: true };
    setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: [...c.messages, aMsg] } : c));

    try {
      const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;
      const hasKey = apiKey && apiKey !== 'your_nvidia_api_key_here';

      if (!hasKey) {
        /* ── MOCK STREAMING ── */
        const mockReply = generateMockReply(text);
        let acc = '';
        for (let i = 0; i < mockReply.length; i++) {
          await new Promise(r => setTimeout(r, 7 + Math.random() * 12));
          acc += mockReply[i];
          setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: c.messages.map((m, mi) => mi === c.messages.length - 1 ? { ...m, content: acc } : m) } : c));
        }
        setTokenCount(p => p + Math.floor(acc.length / 4));
      } else {
        /* ── REAL NVIDIA API ── */
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const historyMsgs = msgs.slice(-10).map(m => ({ role: m.role, content: m.content }));
        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST', signal: ctrl.signal,
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: SYSTEM },
              ...historyMsgs,
              { role: 'user', content: text + fileCtx }
            ],
            temperature: 0.7, top_p: 0.95, max_tokens: 2048, stream: true
          })
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of dec.decode(value, { stream: true }).split('\n')) {
            if (!line.startsWith('data:')) continue;
            const raw = line.slice(5).trim();
            if (raw === '[DONE]') break;
            try {
              const d = JSON.parse(raw);
              const delta = d.choices?.[0]?.delta?.content || '';
              acc += delta;
              setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: c.messages.map((m, mi) => mi === c.messages.length - 1 ? { ...m, content: acc } : m) } : c));
              setTokenCount(q => q + 1);
            } catch (_) { }
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: c.messages.map((m, mi) => mi === c.messages.length - 1 ? { ...m, content: `⚠️ **Error:** ${err.message}\n\nMake sure your \`VITE_NVIDIA_API_KEY\` is set in \`.env\``, streaming: false } : m) } : c));
      }
    } finally {
      setLoading(false);
      setPipeline(null);
      abortRef.current = null;
      setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: c.messages.map(m => ({ ...m, streaming: false })) } : c));
    }
  }, [input, loading, activeId, msgs, model, uploadedFiles]);

  const stopGen = () => { abortRef.current?.abort(); setLoading(false); setPipeline(null); };

  const activeModel = MODELS.find(m => m.id === model) || MODELS[0];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#09090b', fontFamily: 'Inter, sans-serif', color: '#d1d5db', overflow: 'hidden' }}>

      {/* ══ LEFT SIDEBAR ══ */}
      <aside style={{ width: 260, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', background: '#0a0a0f', flexShrink: 0 }}>
        {/* header */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(139,92,246,0.45)', flexShrink: 0 }}>
            <Ic.Brain />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 15, background: 'linear-gradient(90deg,#a78bfa,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CEREBRO AI</div>
            <div style={{ fontSize: 10, color: '#4b5563' }}>RAG · Streaming · {MODELS.length} models</div>
          </div>
        </div>

        {/* new chat */}
        <div style={{ padding: '12px 12px 8px' }}>
          <button onClick={newChat} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 10, background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.10)'}
          ><Ic.Plus /> New conversation</button>
        </div>

        {/* conversations */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
          {conversations.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#3f3f46', fontSize: 12, marginTop: 40 }}>No conversations yet</div>
          ) : (
            conversations.map(c => (
              <div key={c.id} onClick={() => setActiveId(c.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 9, cursor: 'pointer', marginBottom: 2, background: c.id === activeId ? 'rgba(139,92,246,0.12)' : 'transparent', border: c.id === activeId ? '1px solid rgba(139,92,246,0.25)' : '1px solid transparent', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (c.id !== activeId) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (c.id !== activeId) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 7, background: c.id === activeId ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: c.id === activeId ? '#a78bfa' : '#6b7280' }}>
                  <Ic.Chat />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: c.id === activeId ? '#e2e8f0' : '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 10.5, color: '#4b5563', marginTop: 1 }}>{c.messages.length} msg{c.messages.length !== 1 ? 's' : ''}</div>
                </div>
                <button onClick={e => deleteChat(c.id, e)} style={{ opacity: 0, width: 22, height: 22, borderRadius: 5, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                ><Ic.Trash /></button>
              </div>
            ))
          )}
        </div>

        {/* token counter */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: '#3f3f46', display: 'flex', justifyContent: 'space-between' }}>
          <span>Tokens used</span>
          <span style={{ color: '#6b7280', fontFamily: 'JetBrains Mono, monospace' }}>{tokenCount.toLocaleString()}</span>
        </div>
      </aside>

      {/* ══ MAIN CHAT AREA ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* top bar */}
        <div style={{ height: 56, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f9fafb' }}>{convo?.title || 'New conversation'}</div>
            {pipeline && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '3px 10px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', animation: 'rag-pulse 1s ease infinite' }} />
                <span style={{ fontSize: 10.5, color: '#a78bfa', fontWeight: 600 }}>{pipeline === 'thinking' ? 'Thinking…' : 'Streaming…'}</span>
              </div>
            )}
          </div>

          {/* Model selector */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowModels(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', color: '#d1d5db', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: activeModel.color, flexShrink: 0 }} />
              {activeModel.label}
              <Ic.ChevronDown />
            </button>

            {showModels && (
              <div style={{ position: 'absolute', top: 40, right: 0, width: 240, background: '#111117', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 200, overflow: 'hidden' }}>
                {MODELS.map(m => (
                  <button key={m.id} onClick={() => { setModel(m.id); setShowModels(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: model === m.id ? 'rgba(139,92,246,0.12)' : 'transparent', border: 'none', color: '#d1d5db', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', textAlign: 'left' }}
                    onMouseEnter={e => { if (model !== m.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (model !== m.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{m.label}</span>
                    <span style={{ fontSize: 10, background: `${m.color}22`, border: `1px solid ${m.color}44`, color: m.color, borderRadius: 5, padding: '1px 7px', fontWeight: 700 }}>{m.badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }} onClick={() => setShowModels(false)}>
          <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>

            {/* empty state */}
            {msgs.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 60 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.79A2.5 2.5 0 0 1 5 11.5a2.5 2.5 0 0 1 2.79-2.49 2.5 2.5 0 0 1 1.71-6.51z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.79A2.5 2.5 0 0 0 19 11.5a2.5 2.5 0 0 0-2.79-2.49 2.5 2.5 0 0 0-1.71-6.51z" /></svg>
                </div>
                <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 26, fontWeight: 800, color: '#f9fafb', marginBottom: 10 }}>What can I help you with?</h2>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 36 }}>Ask me anything — security, coding, AI, science, math, or general knowledge.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 560, margin: '0 auto' }}>
                  {QUICK.map(q => (
                    <button key={q.text} onClick={() => send(q.text)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.2s', lineHeight: 1.5 }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.10)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.30)'; e.currentTarget.style.color = '#c4b5fd'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#9ca3af'; }}
                    >
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{q.icon}</span>
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* message list */}
            {msgs.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 28 }}>
                {/* role header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                  {msg.role === 'user' ? (
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><Ic.User /></div>
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(139,92,246,0.4)' }}><Ic.Brain /></div>
                  )}
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: msg.role === 'user' ? '#9ca3af' : '#a78bfa', textTransform: 'uppercase', letterSpacing: 0.6 }}>{msg.role === 'user' ? 'You' : 'CEREBRO AI'}</span>
                  {msg.ts && <span style={{ fontSize: 10.5, color: '#374151', marginLeft: 4 }}>{new Date(msg.ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>}
                </div>

                {/* bubble */}
                <div style={{ paddingLeft: 37 }}>
                  {msg.role === 'user' ? (
                    <div style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.20)', borderRadius: '0 14px 14px 14px', padding: '12px 16px', color: '#e2e8f0', fontSize: 14, lineHeight: 1.7, display: 'inline-block', maxWidth: '100%', whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                      {msg.files?.length > 0 && <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>{msg.files.map(f => <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#a78bfa' }}><Ic.File />{f}</span>)}</div>}
                    </div>
                  ) : (
                    <div>
                      <MD text={msg.content} />
                      {msg.streaming && <span style={{ display: 'inline-block', width: 3, height: 15, background: '#8b5cf6', marginLeft: 3, verticalAlign: 'middle', borderRadius: 2, animation: 'cursor-blink 0.7s step-end infinite' }} />}

                      {/* action buttons */}
                      {!msg.streaming && msg.content && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                          {[
                            { icon: <Ic.Copy />, label: copiedIdx === idx ? 'Copied!' : 'Copy', action: () => copy(msg.content, idx) },
                            { icon: <Ic.Refresh />, label: 'Retry', action: () => { const lastUser = [...msgs].reverse().find(m => m.role === 'user'); if (lastUser) send(lastUser.content); } },
                          ].map(btn => (
                            <button key={btn.label} onClick={btn.action}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280', fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#d1d5db'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#6b7280'; }}
                            >{btn.icon}{btn.label}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* thinking dots */}
            {loading && pipeline === 'thinking' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 0, marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic.Brain /></div>
                <div style={{ display: 'flex', gap: 5, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0 14px 14px 14px' }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', animation: `dot-bounce 1.2s ease ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* ── INPUT AREA ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)', padding: '16px 24px 20px', flexShrink: 0 }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>

            {/* uploaded files */}
            {uploadedFiles.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 11.5, color: '#a78bfa' }}>
                    <Ic.File />{f.name}
                    <button onClick={() => setUploadedFiles(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0, lineHeight: 1, marginLeft: 2 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* input box */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: '10px 12px', transition: 'border-color 0.2s' }}
              onFocus={() => { }} onClick={() => textareaRef.current?.focus()}>
              {/* file upload */}
              <button onClick={() => fileRef.current?.click()} title="Upload file" style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.color = '#a78bfa'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#6b7280'; }}
              ><Ic.File /></button>
              <input ref={fileRef} type="file" multiple accept=".txt,.md,.js,.jsx,.ts,.tsx,.py,.json,.csv,.html,.css" onChange={onFile} style={{ display: 'none' }} />

              <textarea ref={textareaRef} rows={1}
                placeholder="Ask anything — press Enter to send, Shift+Enter for newline…"
                value={input} disabled={loading}
                onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'; }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f9fafb', fontSize: 14, fontFamily: 'Inter, sans-serif', resize: 'none', lineHeight: 1.6, paddingTop: 4, overflowY: 'hidden' }}
              />

              {loading ? (
                <button onClick={stopGen} title="Stop" style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic.Stop /></button>
              ) : (
                <button onClick={() => send()} disabled={!input.trim()} title="Send" style={{ width: 38, height: 38, borderRadius: 10, background: input.trim() ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : 'rgba(255,255,255,0.05)', border: 'none', color: input.trim() ? '#fff' : '#4b5563', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', boxShadow: input.trim() ? '0 4px 16px rgba(139,92,246,0.4)' : 'none' }}><Ic.Send /></button>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10.5, color: '#374151', padding: '0 2px' }}>
              <span>Enter → send &nbsp;·&nbsp; Shift+Enter → newline &nbsp;·&nbsp; Upload files to add context</span>
              <span style={{ color: '#8b5cf6' }}>{activeModel.label}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dot-bounce { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-7px);opacity:1} }
        @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes rag-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(0.8)} }
      `}</style>
    </div>
  );
}

/* ── MOCK REPLY GENERATOR ── */
function generateMockReply(query) {
  const q = query.toLowerCase();
  if (q.includes('zero-trust') || q.includes('zero trust')) return `## Zero-Trust Security Architecture\n\nZero-Trust operates on the principle: **"Never trust, always verify"** — regardless of whether a request comes from inside or outside the network perimeter.\n\n### Core Principles\n1. **Verify explicitly** — Authenticate and authorize every request using all available data points (identity, location, device health, request context)\n2. **Use least-privilege access** — Limit user access with just-in-time and just-enough-access policies\n3. **Assume breach** — Minimize blast radius, segment access, verify end-to-end encryption\n\n### Key Components\n- **Identity Provider (IdP)** — Azure AD, Okta, or Google Workspace for SSO + MFA\n- **Micro-segmentation** — Isolate workloads so lateral movement is impossible\n- **Continuous validation** — Monitor all sessions in real-time, revoke access instantly\n- **Device trust** — Only allow managed, compliant devices\n\n### Implementation Steps\n\`\`\`bash\n# Example: enforce MFA on all AWS IAM actions\naws iam put-user-policy --policy-document '{\n  "Condition": {"Bool": {"aws:MultiFactorAuthPresent": "true"}}\n}'\n\`\`\`\n\n> Zero-Trust is a **strategy**, not a product. It requires organizational commitment across identity, network, data, and application layers.`;
  if (q.includes('python') || q.includes('script') || q.includes('code')) return `## Python Script for Security Log Parsing\n\nHere's a production-ready log parser that handles common formats:\n\n\`\`\`python\nimport re\nfrom datetime import datetime\nfrom collections import Counter\n\ndef parse_security_logs(filepath: str) -> list[dict]:\n    """Parse security logs and extract key fields."""\n    pattern = re.compile(\n        r'(?P<timestamp>\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2})\\s+'\n        r'(?P<severity>CRITICAL|HIGH|MEDIUM|LOW|INFO)\\s+'\n        r'(?P<source_ip>\\d+\\.\\d+\\.\\d+\\.\\d+)\\s+'\n        r'(?P<event>.+)'\n    )\n    events = []\n    with open(filepath, 'r', encoding='utf-8') as f:\n        for line in f:\n            if m := pattern.match(line.strip()):\n                events.append({\n                    'timestamp': datetime.fromisoformat(m['timestamp']),\n                    'severity': m['severity'],\n                    'source_ip': m['source_ip'],\n                    'event': m['event']\n                })\n    return events\n\ndef analyze(events: list[dict]):\n    """Summarize and flag anomalies."""\n    severity_counts = Counter(e['severity'] for e in events)\n    top_ips = Counter(e['source_ip'] for e in events).most_common(10)\n    critical = [e for e in events if e['severity'] == 'CRITICAL']\n \n    print(f"Total events: {len(events)}")\n    print(f"Severity breakdown: {dict(severity_counts)}")\n    print(f"Top source IPs: {top_ips}")\n    print(f"Critical events requiring attention: {len(critical)}")\n    return critical\n\nif __name__ == '__main__':\n    events = parse_security_logs('security.log')\n    critical = analyze(events)\n\`\`\`\n\n### Features\n- **Regex-based parsing** for flexible log formats\n- **Severity filtering** to isolate critical events\n- **IP reputation** analysis via \`Counter\`\n- Easily extensible to write to **SIEM** or **Elasticsearch**`;
  if (q.includes('microservice') || q.includes('system design') || q.includes('scalab')) return `## Scalable Microservices Architecture\n\n### High-Level Design\n\n\`\`\`\nClient → API Gateway → [Auth Service]\n                     → [User Service] → PostgreSQL\n                     → [Order Service] → PostgreSQL\n                     → [Notification] → Kafka → Email/SMS\n                     → [Search] → Elasticsearch\n\`\`\`\n\n### Key Components\n\n**1. API Gateway**\n- Single entry point (Kong, AWS API Gateway)\n- Handles: rate limiting, auth, routing, SSL termination\n\n**2. Service Communication**\n- **Sync**: REST or gRPC for request/response\n- **Async**: Kafka/RabbitMQ for events, ensures decoupling\n\n**3. Data Management**\n- Each service owns its database (**Database per Service** pattern)\n- Use **Saga pattern** for distributed transactions\n\n**4. Resilience**\n- **Circuit breaker** (Resilience4j, Hystrix) prevents cascade failure\n- **Retry with exponential backoff**\n- **Health checks** with Kubernetes liveness/readiness probes\n\n### Infrastructure as Code\n\`\`\`yaml\n# docker-compose.yml snippet\nservices:\n  api-gateway:\n    image: kong:3.5\n    ports: ['8000:8000']\n  user-service:\n    build: ./user-service\n    environment:\n      DB_URL: postgresql://user-db:5432/users\n    depends_on: [user-db]\n\`\`\``;
  return `## Great question!\n\nBased on my knowledge base, here's a comprehensive answer:\n\n${query.length > 100 ? query.slice(0, 80) + '...' : query}\n\n### Key Points\n\n- This is a **broad topic** — I'll cover the most important aspects\n- I'm using a **Real-Time RAG Pipeline** to ground my response in factual knowledge\n- Ask follow-up questions to drill deeper into any specific area\n\n### Overview\n\nTo give you the most accurate and helpful answer, I'd recommend being specific about what aspect you want to explore. I can cover:\n\n1. **Theoretical foundations** — the underlying concepts and principles\n2. **Practical implementation** — step-by-step code and configuration\n3. **Best practices** — industry-standard approaches and anti-patterns to avoid\n4. **Tools & ecosystem** — relevant libraries, platforms, and services\n\n> **Tip:** Add a document or code file using the 📎 button for context-aware answers!\n\nWhat specific aspect would you like me to go deeper on?`;
}
