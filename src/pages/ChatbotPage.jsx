import { useState, useRef, useEffect, useCallback } from 'react';

/* ── Claude-Like Clean Icons ── */
const Ic = {
  Send: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>,
  Stop: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>,
  Attachment: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>,
  Menu: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  Sparkle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Copy: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  Refresh: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" /></svg>,
  File: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  Chat: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  ChevronDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" /></svg>,
};

/* ── MODELS ── */
const MODELS = [
  { id: 'meta/llama-3.3-70b-instruct', label: 'Claude 3.5 Sonnet', badge: 'Fastest' },
  { id: 'mistralai/mixtral-8x22b-instruct-v0.1', label: 'Claude 3 Opus', badge: 'Smart' },
];

/* ── QUICK PROMPTS ── */
const QUICK = [
  { icon: '📝', text: 'Help me write an email' },
  { icon: '💻', text: 'Review this code' },
  { icon: '🔍', text: 'Explain a complex topic' },
  { icon: '📊', text: 'Analyze this data' },
];

/* ── SYSTEM PROMPT ── */
const SYSTEM = `You are an AI assistant designed to be helpful, harmless, and honest. You use markdown for formatting. You respond intelligently and clearly.`;

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
          <div key={i} style={{ marginTop: 16, marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            {codeLang && <div style={{ background: '#27272a', padding: '6px 16px', fontSize: 11, color: '#a1a1aa', fontFamily: 'monospace', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}><span>{codeLang}</span></div>}
            <pre style={{ background: '#18181b', padding: '16px', overflowX: 'auto', margin: 0, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6, color: '#e4e4e7' }}>
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        inCode = false; codeLines = [];
      }
    } else if (inCode) {
      codeLines.push(line);
    } else if (line.startsWith('### ')) {
      out.push(<h3 key={i} style={{ fontSize: 16, fontWeight: 600, color: '#f4f4f5', marginTop: 24, marginBottom: 10 }}>{inl(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      out.push(<h2 key={i} style={{ fontSize: 20, fontWeight: 600, color: '#f4f4f5', marginTop: 28, marginBottom: 12 }}>{inl(line.slice(3))}</h2>);
    } else if (line.startsWith('# ')) {
      out.push(<h1 key={i} style={{ fontSize: 24, fontWeight: 600, color: '#f4f4f5', marginTop: 32, marginBottom: 16 }}>{inl(line.slice(2))}</h1>);
    } else if (/^[-*] /.test(line)) {
      out.push(<div key={i} style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 15 }}><span style={{ color: '#a1a1aa', lineHeight: '24px' }}>•</span><span style={{ lineHeight: 1.6 }}>{inl(line.slice(2))}</span></div>);
    } else if (/^\d+\. /.test(line)) {
      const n = line.match(/^(\d+)\./)[1];
      out.push(<div key={i} style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 15 }}><span style={{ color: '#a1a1aa', minWidth: 20 }}>{n}.</span><span style={{ lineHeight: 1.6 }}>{inl(line.replace(/^\d+\. /, ''))}</span></div>);
    } else if (line.startsWith('> ')) {
      out.push(<blockquote key={i} style={{ borderLeft: '3px solid #52525b', paddingLeft: 16, margin: '16px 0', color: '#a1a1aa', fontSize: 15 }}>{inl(line.slice(2))}</blockquote>);
    } else if (line.trim() === '') {
      out.push(<div key={i} style={{ height: 16 }} />);
    } else {
      out.push(<p key={i} style={{ fontSize: 15, lineHeight: 1.6, marginTop: 0, marginBottom: 0 }}>{inl(line)}</p>);
    }
    i++;
  }
  return <div style={{ color: '#d4d4d8' }}>{out}</div>;
}

function inl(text) {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} style={{ color: '#f4f4f5', fontWeight: 600 }}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.85em', color: '#e4e4e7' }}>{p.slice(1, -1)}</code>;
    if (p.startsWith('*') && p.endsWith('*')) return <em key={i} style={{ color: '#a1a1aa' }}>{p.slice(1, -1)}</em>;
    return p;
  });
}

/* ── MAIN PAGE ── */
export default function ChatbotPage() {
  const [conversations, setConversations] = useState([
    { id: '1', title: 'New chat', messages: [], createdAt: new Date() }
  ]);
  const [activeId, setActiveId] = useState('1');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const [showModels, setShowModels] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const abortRef = useRef(null);
  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  const convo = conversations.find(c => c.id === activeId);
  const msgs = convo?.messages || [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  useEffect(() => {
    if (!loading) textareaRef.current?.focus();
  }, [activeId, loading]);

  /* new chat */
  const newChat = () => {
    const id = Date.now().toString();
    setConversations(p => [{ id, title: 'New chat', messages: [], createdAt: new Date() }, ...p]);
    setActiveId(id);
    setInput('');
    setUploadedFiles([]);
    if (window.innerWidth < 768) setSidebarOpen(false);
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

    // append user message
    setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: [...c.messages, userMsg] } : c));
    if (msgs.length === 0) {
      setConversations(p => p.map(c => c.id === activeId ? { ...c, title: text.slice(0, 30) + (text.length > 30 ? '…' : '') } : c));
    }

    const fileCtx = uploadedFiles.length > 0
      ? '\n\n[UPLOADED FILES CONTEXT]:\n' + uploadedFiles.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n')
      : '';

    // fake network delay
    await new Promise(r => setTimeout(r, 400));

    // append empty assistant message for streaming
    const aMsg = { role: 'assistant', content: '', ts: new Date(), streaming: true };
    setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: [...c.messages, aMsg] } : c));

    try {
      const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;
      const hasKey = apiKey && apiKey !== 'your_nvidia_api_key_here';

      if (!hasKey) {
        /* MOCK STREAMING */
        const mockReply = `Here is a thoughtful response to your request:\n\n${text.length > 50 ? text.slice(0, 50) + '...' : text}\n\n### Key points to consider\n- **Precision:** Focus on exact details.\n- **Clarity:** Keep explanations straightforward.\n- **Depth:** Analyze root causes rather than symptoms.\n\nLet me know if you need any adjustments or further elaboration on specific parts!`;
        let acc = '';
        for (let i = 0; i < mockReply.length; i++) {
          await new Promise(r => setTimeout(r, 6 + Math.random() * 10)); // very fast stream like Claude
          acc += mockReply[i];
          setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: c.messages.map((m, mi) => mi === c.messages.length - 1 ? { ...m, content: acc } : m) } : c));
        }
      } else {
        /* REAL NVIDIA API */
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const historyMsgs = msgs.slice(-10).map(m => ({ role: m.role, content: m.content }));
        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST', signal: ctrl.signal,
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
          body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: SYSTEM }, ...historyMsgs, { role: 'user', content: text + fileCtx }],
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
            } catch (_) { }
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: c.messages.map((m, mi) => mi === c.messages.length - 1 ? { ...m, content: `⚠️ **Error:** ${err.message}`, streaming: false } : m) } : c));
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
      setConversations(p => p.map(c => c.id === activeId ? { ...c, messages: c.messages.map(m => ({ ...m, streaming: false })) } : c));
    }
  }, [input, loading, activeId, msgs, model, uploadedFiles]);

  const stopGen = () => { abortRef.current?.abort(); setLoading(false); };

  const activeModel = MODELS.find(m => m.id === model) || MODELS[0];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#e4e4e7', color: '#27272a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"', overflow: 'hidden' }}>

      {/* CLAUDE DARK MODE OVERRIDE */}
      <style>{`
        body { background: #18181b !important; color: #d4d4d8 !important; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #52525b; }
      `}</style>

      {/* ══ LEFT SIDEBAR ══ */}
      <div style={{ width: sidebarOpen ? 260 : 0, transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)', borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.08)' : 'none', background: '#18181b', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f4f4f5' }}>
            <div style={{ background: '#f4f4f5', color: '#18181b', width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic.Sparkle /></div>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Claude</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Ic.Menu /></button>
        </div>

        <div style={{ padding: '8px 12px', width: 260 }}>
          <button onClick={newChat} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'transparent', border: 'none', color: '#f4f4f5', fontSize: 13, cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Ic.Edit /> New chat
          </button>
        </div>

        <div style={{ padding: '12px 20px 8px', fontSize: 11, color: '#a1a1aa', fontWeight: 600, letterSpacing: 0.5, width: 260 }}>Recent</div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px', width: 260 }}>
          {conversations.map(c => (
            <div key={c.id} onClick={() => setActiveId(c.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: c.id === activeId ? 'rgba(255,255,255,0.08)' : 'transparent', color: c.id === activeId ? '#f4f4f5' : '#a1a1aa', transition: 'all 0.1s' }}
              onMouseEnter={e => { if (c.id !== activeId) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (c.id !== activeId) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{c.title}</div>
              {c.id === activeId && (
                <button onClick={e => deleteChat(c.id, e)} style={{ color: '#71717a', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}><Ic.Trash /></button>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10, width: 260, color: '#d4d4d8', fontSize: 13 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>V</div>
          <span>Valluri Rahul</span>
        </div>
      </div>

      {/* ══ MAIN CHAT AREA ══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#18181b', position: 'relative' }}>

        {/* top header */}
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'linear-gradient(180deg, #18181b 60%, transparent)' }}>
          <div>
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} style={{ color: '#a1a1aa', background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', gap: 8, borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Ic.Menu />
              </button>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowModels(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'transparent', border: 'none', color: '#a1a1aa', fontSize: 14, cursor: 'pointer', transition: 'color 0.1s' }} onMouseEnter={e => e.currentTarget.style.color = '#f4f4f5'} onMouseLeave={e => e.currentTarget.style.color = '#a1a1aa'}>
              {activeModel.label}
              <Ic.ChevronDown />
            </button>
            {showModels && (
              <div style={{ position: 'absolute', top: 40, right: '50%', transform: 'translateX(50%)', width: 220, background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 200, padding: 6 }}>
                {MODELS.map(m => (
                  <button key={m.id} onClick={() => { setModel(m.id); setShowModels(false); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', background: model === m.id ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', borderRadius: 6, color: '#f4f4f5', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => { if (model !== m.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (model !== m.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span>{m.label}</span>
                    {model === m.id && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: 40 }} /> {/* spacer */}
        </div>

        {/* Scrollable messages area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 80, paddingBottom: 160 }} onClick={() => setShowModels(false)}>
          <div style={{ maxWidth: 768, margin: '0 auto', padding: '0 20px' }}>

            {/* Empty state greeting */}
            {msgs.length === 0 && (
              <div style={{ marginTop: '10vh', marginBottom: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
                  <div style={{ width: 48, height: 48, background: '#f4f4f5', color: '#18181b', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ic.Sparkle />
                  </div>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 500, color: '#f4f4f5', textAlign: 'center', marginBottom: 32, fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                  Good morning, Rahul
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 600, margin: '0 auto' }}>
                  {QUICK.map(q => (
                    <button key={q.text} onClick={() => send(q.text)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, background: '#27272a', border: '1px solid rgba(255,255,255,0.05)', color: '#d4d4d8', fontSize: 14, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#3f3f46'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#27272a'; }}
                    >
                      <span style={{ fontSize: 16 }}>{q.icon}</span>
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {msgs.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 32, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>

                {msg.role === 'user' ? (
                  /* User Bubble */
                  <div style={{ maxWidth: '85%', background: '#27272a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '12px 18px', color: '#f4f4f5', fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                    {msg.files?.length > 0 && <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>{msg.files.map(f => <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#3f3f46', borderRadius: 6, padding: '4px 8px', fontSize: 12, color: '#d4d4d8' }}><Ic.File />{f}</span>)}</div>}
                  </div>
                ) : (
                  /* Claude Response */
                  <div style={{ width: '100%', display: 'flex', gap: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f4f4f5', color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                      <Ic.Sparkle />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, color: '#f4f4f5' }}>
                      <MD text={msg.content} />
                      {msg.streaming && <span style={{ display: 'inline-block', width: 4, height: 16, background: '#a1a1aa', verticalAlign: 'middle', borderRadius: 2, animation: 'cursor-blink 0.8s step-end infinite', marginLeft: 4 }} />}

                      {!msg.streaming && msg.content && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 12, color: '#71717a' }}>
                          <button onClick={() => copy(msg.content, idx)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 6, borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'none'} title="Copy"><Ic.Copy /></button>
                          <button onClick={() => { const lastUser = [...msgs].reverse().find(m => m.role === 'user'); if (lastUser) send(lastUser.content); }} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 6, borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'none'} title="Retry"><Ic.Refresh /></button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>

        {/* ── FLOATING INPUT BAR ── */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(0deg, #18181b 80%, transparent)', padding: '0 20px 32px' }}>
          <div style={{ maxWidth: 768, margin: '0 auto', width: '100%' }}>

            {/* Uploaded Files preview */}
            {uploadedFiles.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, padding: '0 12px' }}>
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#d4d4d8' }}>
                    <Ic.File /> {f.name}
                    <button onClick={() => setUploadedFiles(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0, marginLeft: 4 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-end', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>

              {/* Attachment Button */}
              <button onClick={() => fileRef.current?.click()} style={{ width: 32, height: 32, borderRadius: 10, background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', marginBottom: 2 }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#f4f4f5'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; }}>
                <Ic.Attachment />
              </button>
              <input ref={fileRef} type="file" multiple accept=".txt,.md,.js,.jsx,.ts,.tsx,.py,.json,.csv,.html,.css" onChange={onFile} style={{ display: 'none' }} />

              <textarea ref={textareaRef} rows={1}
                placeholder="Message Claude..."
                value={input} disabled={loading}
                onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'; }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f4f4f5', fontSize: 15, fontFamily: 'inherit', resize: 'none', lineHeight: 1.5, paddingTop: 6, paddingBottom: 6, overflowY: 'hidden' }}
              />

              {/* Submit Button */}
              {loading ? (
                <button onClick={stopGen} style={{ width: 34, height: 34, borderRadius: '50%', background: '#3f3f46', border: 'none', color: '#f4f4f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 1 }}>
                  <Ic.Stop />
                </button>
              ) : (
                <button onClick={() => send()} disabled={!input.trim()} style={{ width: 34, height: 34, borderRadius: '50%', background: input.trim() ? '#f4f4f5' : '#3f3f46', border: 'none', color: input.trim() ? '#18181b' : '#71717a', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', marginBottom: 1 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                </button>
              )}
            </div>

            <div style={{ textAlign: 'center', color: '#71717a', fontSize: 11, marginTop: 10 }}>
              Claude can make mistakes. Please verify important information.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
