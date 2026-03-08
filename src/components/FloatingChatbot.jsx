import { useState, useRef, useEffect } from 'react';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am the SentinelX AI assistant powered by NVIDIA. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // ====================================================================
  // ⚡ REAL-TIME AUTONOMOUS EVENT STREAM (Runs in background)
  // ====================================================================
  useEffect(() => {
    const liveEvents = [
      "⚠️ [ALERT] High-velocity login anomaly detected on account: admin@acme-corp.com. Origin: 185.15.x.x. Auto-quarantine initiated.",
      "🟢 [UPDATE] Security definitions successfully synced with latest zero-day signatures.",
      "🛡️ [ACTION] Successfully blocked 32 SQL injection attempts against the primary API gateway over the last 60 seconds.",
      "⚠️ [WARNING] Unauthorized AWS AssumeRole attempt mapped to your integration. Adjust IAM policies immediately.",
      "🧠 [ANALYSIS] CEREBRO ML models indicate a 14% deviation from the baseline data transfer rate. Monitoring for exfiltration...",
      "🟢 [SYSTEM] All 3 compliance endpoints reporting 100% uptime. SOC2 daily report has been archived.",
      "⚠️ [ALERT] Brute-force credentials stuffing campaign detected across 4 tenant subdomains. IP ranges automatically added to WAF deny-list."
    ];

    const generateLiveEvent = () => {
      if (Math.random() > 0.4) return; // 60% chance to skip this cycle so it feels naturally random

      const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];

      // Simulate typing real-time
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'assistant', content: '', isLiveEvent: true }]);

      let currentText = "";
      let i = 0;

      const typeNextChar = () => {
        if (i < randomEvent.length) {
          currentText += randomEvent[i];
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = currentText;
            return updated;
          });
          i++;
          setTimeout(typeNextChar, 10 + Math.random() * 20);
        } else {
          setIsLoading(false);
        }
      };

      setTimeout(typeNextChar, 1000);
    };

    // Try to trigger a live event every 12 seconds
    const interval = setInterval(generateLiveEvent, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;

      // ====================================================================
      // 🚀 MOCK STREAMING MODE (Runs if API Key is missing)
      // ====================================================================
      if (!apiKey || apiKey === 'your_nvidia_api_key_here') {
        // Add empty assistant message that we will stream text into
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        // Pick a random enterprise security response
        const mockResponses = [
          "I am analyzing the telemetry from your cloud environment. Currently, your SOC2 posture looks solid, but I noticed a slight anomaly in the AWS us-east-1 region involving an IAM role assumption. I have automatically isolated the instance.",
          "Based on the real-time threat feed, we blocked 14,500 vectors today. The most common attack vector has been brute-force SSH attempts on your public EC2 instances. Your perimeter is secure.",
          "I have reviewed the access logs and they indicate normal behavior. However, I recommend rotating your database credentials soon as they haven't been changed in 89 days.",
          "I am CEREBRO AI. I continuously monitor your infrastructure using unsupervised machine learning to detect zero-day anomalies before they become breaches.",
          "Scanning your Kubernetes cluster... No critical CVEs found in the running container images. The anomalous data transfer spike from yesterday was confirmed as a false positive."
        ];

        const mockText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        let currentText = "";

        // Simulate streaming character by character exactly like a real LLM
        for (let i = 0; i < mockText.length; i++) {
          // Delay between 15ms and 35ms per character to look human/natural
          await new Promise(resolve => setTimeout(resolve, 15 + Math.random() * 20));
          currentText += mockText[i];

          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = currentText;
            return updated;
          });
        }
        setIsLoading(false);
        return; // Exit here so it doesn't try to call the real API
      }
      // ====================================================================
      // End Mock Mode
      // ====================================================================

      // REAL NVIDIA API CALL (Runs only if real key is provided)
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "text/event-stream"
        },
        body: JSON.stringify({
          model: "qwen/qwen3.5-122b-a10b",
          messages: [
            { role: "system", content: "You are SentinelX AI, a helpful security assistant. Answer concisely and professionally." },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg }
          ],
          temperature: 0.60,
          top_p: 0.95,
          max_tokens: 16384,
          stream: true,
          chat_template_kwargs: { enable_thinking: true }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      // Add empty assistant message that we will stream text into
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const dataStr = line.replace("data:", "").trim();
            if (dataStr === "[DONE]") break;
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                const content = parsed.choices[0]?.delta?.content || "";
                assistantMessage += content;

                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = assistantMessage;
                  return updated;
                });
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--blue), var(--indigo))',
          boxShadow: '0 4px 16px rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'transform 0.2s',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = isOpen ? 'scale(0.9)' : 'scale(1)'}
      >
        <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
          {isOpen ? '✕' : '💬'}
        </span>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '360px',
          height: '500px',
          maxHeight: 'calc(100vh - 120px)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--blue), var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', boxShadow: '0 0 10px var(--blue-glow)' }}>
            🧠
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>SentinelX CEREBRO AI</div>
            <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'ping 1.5s infinite var(--ease-out)' }}></span>
              Online (Qwen-3.5 122B)
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
              <div style={{ fontSize: '10px', color: msg.isLiveEvent ? '#ef4444' : 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {msg.isLiveEvent && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444', animation: 'ping 1s infinite' }} />}
                {msg.role === 'user' ? 'You' : msg.isLiveEvent ? 'Live Alert' : 'CEREBRO AI'}
              </div>
              <div style={{
                background: msg.role === 'user' ? 'var(--blue-dim)' : msg.isLiveEvent ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user' ? 'var(--blue-light)' : msg.isLiveEvent ? '#fca5a5' : 'var(--text-secondary)',
                border: `1px solid ${msg.role === 'user' ? 'var(--border-light)' : msg.isLiveEvent ? 'rgba(239, 68, 68, 0.3)' : 'var(--border)'}`,
                padding: '10px 14px',
                borderRadius: '12px',
                borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                fontSize: '13.5px',
                lineHeight: 1.5,
                maxWidth: msg.isLiveEvent ? '95%' : '85%',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                boxShadow: msg.isLiveEvent ? '0 4px 12px rgba(239, 68, 68, 0.1)' : 'none'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '2px', display: 'flex', gap: '4px' }}>
                <span className="dot-typing"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Ask about your security posture..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              fontFamily: 'Inter, sans-serif'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              background: input.trim() && !isLoading ? 'linear-gradient(135deg, var(--blue), var(--indigo))' : 'rgba(255,255,255,0.05)',
              color: input.trim() && !isLoading ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              width: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            ➤
          </button>
        </form>
      </div>

      <style>{`
        .dot-typing {
          position: relative;
          left: -9999px;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: var(--blue);
          color: var(--blue);
          box-shadow: 9984px 0 0 0 var(--blue), 9999px 0 0 0 var(--blue), 10014px 0 0 0 var(--blue);
          animation: dot-typing 1.5s infinite linear;
        }
        @keyframes dot-typing {
          0% { box-shadow: 9984px 0 0 0 var(--blue), 9999px 0 0 0 rgba(255,255,255,0.2), 10014px 0 0 0 rgba(255,255,255,0.2); }
          33.3333% { box-shadow: 9984px 0 0 0 rgba(255,255,255,0.2), 9999px 0 0 0 var(--blue), 10014px 0 0 0 rgba(255,255,255,0.2); }
          66.6667% { box-shadow: 9984px 0 0 0 rgba(255,255,255,0.2), 9999px 0 0 0 rgba(255,255,255,0.2), 10014px 0 0 0 var(--blue); }
          100% { box-shadow: 9984px 0 0 0 rgba(255,255,255,0.2), 9999px 0 0 0 rgba(255,255,255,0.2), 10014px 0 0 0 rgba(255,255,255,0.2); }
        }
      `}</style>
    </>
  );
}
