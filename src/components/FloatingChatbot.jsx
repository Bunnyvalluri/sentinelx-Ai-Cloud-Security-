import { useState, useRef, useEffect, useCallback } from 'react';

// ============================================================
// RAG KNOWLEDGE BASE — Rich multi-domain corpus
// ============================================================
const KNOWLEDGE_BASE = [
  // Security
  { id: 1, topic: 'Zero-Day Exploits', category: 'Security', text: 'A zero-day exploit targets a software vulnerability that is unknown to the vendor, giving attackers a head start before a patch is released. Organizations defend against them using behavioral anomaly detection, sandboxing, and threat intelligence feeds that monitor dark-web exploit marketplaces.' },
  { id: 2, topic: 'SOC2 Compliance', category: 'Security', text: 'SOC2 (Service Organization Control 2) is an auditing standard developed by the AICPA. It evaluates controls relevant to security, availability, processing integrity, confidentiality, and privacy. A Type I report validates design at a point in time; Type II validates operating effectiveness over 6–12 months.' },
  { id: 3, topic: 'Zero-Trust Architecture', category: 'Security', text: 'Zero-Trust is a security model that operates on the principle of "never trust, always verify." Every access request is authenticated and authorized regardless of network location. It uses micro-segmentation, least-privilege access, continuous validation, and multi-factor authentication.' },
  { id: 4, topic: 'SIEM & Threat Detection', category: 'Security', text: 'Security Information and Event Management (SIEM) systems aggregate and analyze logs from across infrastructure to detect threats in real time. Modern SIEMs use machine learning for behavioral analytics, correlating millions of events per second to identify anomalies like lateral movement, data exfiltration, and privilege escalation.' },
  { id: 5, topic: 'Ransomware Defense', category: 'Security', text: 'Ransomware encrypts victim data and demands payment. Defense strategies include immutable backups with air-gapping, network segmentation to limit blast radius, EDR solutions for early detection, email filtering, and user training. The 3-2-1 backup rule (3 copies, 2 media types, 1 offsite) is essential.' },
  { id: 6, topic: 'DDoS Mitigation', category: 'Security', text: 'Distributed Denial of Service (DDoS) attacks flood services with traffic. Mitigation involves CDN-level scrubbing, rate limiting, BGP anycast routing, WAF rules, and traffic shape analysis. Cloud providers like AWS Shield and Cloudflare offer always-on DDoS protection at the network edge.' },
  { id: 7, topic: 'Penetration Testing', category: 'Security', text: 'Penetration testing (pen testing) simulates real-world cyberattacks to identify vulnerabilities before attackers. Phases include reconnaissance, scanning, exploitation, post-exploitation, and reporting. Types: black-box (no knowledge), white-box (full knowledge), gray-box (partial). Tools include Metasploit, Burp Suite, Nmap.' },
  { id: 8, topic: 'PKI & Cryptography', category: 'Security', text: 'Public Key Infrastructure (PKI) manages digital certificates and public-key encryption. TLS 1.3 uses forward secrecy ensuring session keys are not compromised even if the long-term key is. AES-256 is the standard for symmetric encryption; RSA-4096 and ECC p-384 for asymmetric. Quantum computing threatens RSA; post-quantum algorithms like CRYSTALS-Kyber are being standardized.' },
  { id: 9, topic: 'Cloud Security', category: 'Security', text: 'Cloud security follows the shared responsibility model: the provider secures infrastructure; customers secure their data, applications, and configurations. Best practices include IAM least-privilege, encryption at rest and in transit, security groups, VPC isolation, CloudTrail audit logging, and CSPM tools for continuous posture management.' },
  { id: 10, topic: 'Incident Response', category: 'Security', text: 'Incident Response (IR) follows the NIST framework: Preparation, Detection, Containment, Eradication, Recovery, and Post-Incident Analysis. A solid IR plan includes runbooks for common attack scenarios, 24/7 SOC coverage, pre-authorized containment actions, and tabletop exercises to test readiness.' },

  // AI & Machine Learning
  { id: 11, topic: 'RAG — Retrieval Augmented Generation', category: 'AI', text: 'RAG combines a retrieval system with a generative LLM. When a query arrives, relevant documents are fetched from a vector store using semantic similarity (cosine distance between embeddings), then injected into the LLM prompt as context. This grounds the model response in factual, up-to-date knowledge and reduces hallucination significantly.' },
  { id: 12, topic: 'Large Language Models', category: 'AI', text: 'LLMs like GPT-4, Claude, and Gemini are transformer-based models trained on billions of tokens. They excel at text generation, summarization, reasoning, code generation, and question answering. Fine-tuning adapts them to specific domains. Prompt engineering, chain-of-thought, and few-shot learning improve output quality.' },
  { id: 13, topic: 'Vector Databases', category: 'AI', text: 'Vector databases store and search high-dimensional embeddings. Unlike traditional SQL, they use Approximate Nearest Neighbor (ANN) algorithms like HNSW or IVF-PQ for sub-millisecond similarity search across millions of vectors. Popular options: Pinecone, Weaviate, Qdrant, Chroma, pgvector for PostgreSQL.' },
  { id: 14, topic: 'Transformer Architecture', category: 'AI', text: 'Transformers use self-attention mechanisms to model relationships between all tokens in a sequence regardless of distance. The attention formula is: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V. Multi-head attention lets the model attend to information from different representation subspaces simultaneously.' },
  { id: 15, topic: 'Neural Networks & Deep Learning', category: 'AI', text: 'Deep learning uses multi-layer neural networks to learn hierarchical representations. Convolutional Neural Networks (CNNs) excel at images; RNNs/LSTMs at sequences; Transformers at language. Training uses backpropagation and gradient descent variants (Adam, AdamW) to minimize loss functions.' },
  { id: 16, topic: 'Embeddings & Semantic Search', category: 'AI', text: 'Text embeddings map words or sentences to dense vectors in high-dimensional space where semantic similarity is captured by cosine similarity. Models like text-embedding-ada-002, E5-large, and BGE-M3 produce state-of-the-art embeddings. Sentence transformers use siamese networks fine-tuned on NLI and STS benchmarks.' },
  { id: 17, topic: 'Prompt Engineering', category: 'AI', text: 'Prompt engineering designs inputs to LLMs to elicit desired outputs. Techniques: few-shot examples, chain-of-thought reasoning, role assignment ("You are an expert..."), structured output via JSON schema, step-back prompting, and tree-of-thought for complex reasoning. System prompts set behavior; temperature and top-p control creativity.' },
  { id: 18, topic: 'AI Agents & Agentic Systems', category: 'AI', text: 'AI agents autonomously plan and execute multi-step tasks using tool-calling, memory, and reflection loops. Frameworks like LangChain, AutoGen, and CrewAI orchestrate agents. The ReAct pattern (Reasoning + Acting) alternates between generating thoughts and taking actions. Multi-agent systems have specialized subagents collaborating on complex goals.' },

  // Software Engineering
  { id: 19, topic: 'Microservices Architecture', category: 'Engineering', text: 'Microservices decompose applications into small, independently deployable services communicating via APIs. Benefits: independent scaling, technology heterogeneity, fault isolation. Challenges: distributed systems complexity, network latency, data consistency. Service mesh (Istio, Linkerd) handles service discovery, load balancing, and mTLS.' },
  { id: 20, topic: 'Kubernetes & Container Orchestration', category: 'Engineering', text: 'Kubernetes (K8s) manages containerized workloads across clusters. Key concepts: Pods, Deployments, Services, ConfigMaps, Secrets, Ingress, PersistentVolumes. Features: auto-scaling (HPA/VPA), rolling updates, self-healing, namespace isolation. Helm manages Kubernetes application packages.' },
  { id: 21, topic: 'CI/CD Pipelines', category: 'Engineering', text: 'Continuous Integration/Continuous Delivery automates build, test, and deployment. Tools: GitHub Actions, GitLab CI, Jenkins, CircleCI. Best practices: fast feedback loops, test parallelism, canary deployments, feature flags, automated rollback on failure metrics. DORA metrics (deployment frequency, lead time, MTTR, change failure rate) measure DevOps performance.' },
  { id: 22, topic: 'System Design', category: 'Engineering', text: 'System design involves scaling, reliability, and maintainability. Key patterns: load balancing (round-robin, consistent hashing), caching (Redis, Memcached), message queues (Kafka, RabbitMQ), database sharding/replication, CAP theorem (Consistency, Availability, Partition tolerance). Design for 99.99% uptime requires redundancy, circuit breakers, and graceful degradation.' },
  { id: 23, topic: 'API Design & REST', category: 'Engineering', text: 'RESTful APIs use HTTP verbs (GET, POST, PUT, DELETE, PATCH) on resource URLs. Best practices: versioning (/v1/), pagination (cursor-based for large sets), proper status codes, idempotent PUT/DELETE, rate limiting, OpenAPI/Swagger documentation. GraphQL offers flexible queries; gRPC excels at service-to-service with Protocol Buffers.' },
  { id: 24, topic: 'Database Design', category: 'Engineering', text: 'Relational databases (PostgreSQL, MySQL) ensure ACID guarantees. NoSQL options: MongoDB (documents), Cassandra (wide-column, AP-system), Redis (in-memory KV), Neo4j (graphs). Choose based on access patterns. Normalization reduces redundancy; denormalization improves read performance. Indexes (B-tree, LSM-tree) accelerate queries.' },

  // General Knowledge
  { id: 25, topic: 'Quantum Computing', category: 'Science', text: 'Quantum computers use qubits that exist in superposition (0 and 1 simultaneously) and entanglement to perform certain calculations exponentially faster. Shor\'s algorithm can break RSA encryption; Grover\'s algorithm speeds up search. Current quantum computers are NISQ (noisy intermediate-scale quantum) with limited qubit counts. IBM, Google, and IonQ lead development.' },
  { id: 26, topic: 'Climate & Sustainability', category: 'Science', text: 'Climate change is driven by greenhouse gas emissions (CO₂, CH₄, N₂O). The Paris Agreement targets limiting warming to 1.5°C above pre-industrial levels. Solutions: renewable energy (solar PV costs dropped 90% in a decade), carbon capture, green hydrogen, circular economy principles, and corporate ESG commitments.' },
  { id: 27, topic: 'Space Exploration', category: 'Science', text: 'Space exploration has entered a commercial era with SpaceX (Falcon 9, Starship), Blue Origin, and Rocket Lab. Key missions: Artemis program targeting lunar return, James Webb Space Telescope imaging distant galaxies, Mars Perseverance rover investigating habitability. Starlink\'s satellite internet provides global broadband coverage.' },
  { id: 28, topic: 'Blockchain & Web3', category: 'Technology', text: 'Blockchain is a distributed ledger with immutable, cryptographically linked blocks. Proof-of-Work (Bitcoin) consumes energy; Proof-of-Stake (Ethereum post-merge) is 99.9% more efficient. Smart contracts (Solidity on Ethereum) enable DeFi, NFTs, and DAOs. Layer-2 solutions (Optimism, Arbitrum) scale throughput while inheriting L1 security.' },
  { id: 29, topic: 'Economics & Finance', category: 'Finance', text: 'Modern Portfolio Theory (Markowitz) optimizes risk-return tradeoff through diversification. Key metrics: alpha (excess return), beta (market correlation), Sharpe ratio (risk-adjusted return). The Federal Reserve controls interest rates through open market operations. GDP growth, inflation (CPI), and unemployment form the macroeconomic policy triangle.' },
  { id: 30, topic: 'Psychology & Cognitive Science', category: 'Science', text: 'Cognitive biases systematically distort human judgment. Key biases: confirmation bias (seeking information that confirms beliefs), anchoring (over-relying on first information), availability heuristic (weighting recent/vivid events too heavily), Dunning-Kruger effect (low-competence individuals overestimate ability). Behavioral economics applies these insights to financial decision-making.' },
  { id: 31, topic: 'Programming Languages', category: 'Engineering', text: 'Programming paradigms include imperative, functional, object-oriented, and declarative approaches. Python dominates ML/AI with NumPy/PyTorch. Rust offers memory safety without garbage collection, ideal for systems programming. TypeScript adds static typing to JavaScript. Go excels at concurrent services. The language choice depends on performance requirements, team expertise, and ecosystem maturity.' },
  { id: 32, topic: 'Linux & Operating Systems', category: 'Engineering', text: 'Linux uses a monolithic kernel with loadable modules. Key subsystems: process scheduler (CFS), virtual memory manager, VFS (virtual filesystem), TCP/IP networking stack. systemd manages services and boot. Containers use Linux namespaces (pid, net, mnt, uts, ipc) and cgroups for isolation without hypervisor overhead.' },
  { id: 33, topic: 'Networking Fundamentals', category: 'Engineering', text: 'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. TCP provides reliable ordered delivery via handshaking and acknowledgments; UDP is connectionless for low-latency applications. BGP routes traffic between autonomous systems on the internet. DNS resolves hostnames to IPs; CDNs cache content at edge nodes globally.' },
  { id: 34, topic: 'Data Structures & Algorithms', category: 'Engineering', text: 'Fundamental data structures: arrays O(1) access, linked lists O(n) access O(1) insert, hash tables O(1) average operations, binary trees O(log n) operations when balanced, graphs for relationship modeling. Sorting: QuickSort O(n log n) average, MergeSort O(n log n) guaranteed. Dynamic programming solves overlapping subproblems with memoization.' },
  { id: 35, topic: 'Mathematics & Statistics', category: 'Science', text: 'Calculus and linear algebra underpin machine learning. Gradient descent minimizes loss by following the negative gradient. Matrix operations (multiplication, decomposition) power neural network computations. Statistics: Bayes theorem updates beliefs with evidence. Central Limit Theorem enables inference from samples. P-values, confidence intervals, and effect sizes quantify experimental results.' },
  { id: 36, topic: 'SentinelX Platform', category: 'Product', text: 'SentinelX is an AI-powered cloud security platform with CEREBRO AI at its core. Features include real-time threat monitoring, anomaly detection across 1.2B+ events/hour, automated incident response, SOC2 Type II compliance audit trails, user risk scoring with RBAC, seamless cloud integrations (AWS, GCP, Azure), and an intelligent alert queue with AI-powered prioritization.' },
];

// ============================================================
// SIMPLE TF-IDF BASED RETRIEVAL (client-side RAG)
// ============================================================
function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(w));
}

function tfidfScore(query, doc) {
  const qTokens = tokenize(query);
  const dTokens = tokenize(doc);
  const dText = dTokens.join(' ');
  let score = 0;
  for (const qt of qTokens) {
    const tf = dTokens.filter(t => t === qt || t.startsWith(qt.slice(0, 4))).length / Math.max(dTokens.length, 1);
    if (tf > 0) score += tf * (1 + Math.log(KNOWLEDGE_BASE.length));
  }
  // Boost for topic/category exact matches
  const topic = doc.split('.')[0].toLowerCase();
  const qLower = query.toLowerCase();
  if (qTokens.some(qt => topic.includes(qt))) score *= 2;
  return score;
}

function retrieveChunks(query, topK = 3) {
  const scored = KNOWLEDGE_BASE.map(doc => ({
    ...doc,
    score: tfidfScore(query, doc.topic + ' ' + doc.category + ' ' + doc.text)
  }));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(d => d.score > 0);
}

// ============================================================
// PIPELINE STEP COMPONENT
// ============================================================
function PipelineStep({ step, status, label }) {
  const colors = { done: '#22c55e', active: '#8b5cf6', waiting: '#52525b' };
  const c = colors[status] || colors.waiting;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: status === 'active' ? 'transparent' : c, border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: status === 'active' ? 'spin 1s linear infinite' : 'none', boxShadow: status !== 'waiting' ? `0 0 8px ${c}66` : 'none' }}>
        {status === 'done' && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
        {status === 'active' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />}
      </div>
      <span style={{ fontSize: 10.5, color: status === 'waiting' ? '#52525b' : status === 'active' ? '#a78bfa' : '#22c55e', fontWeight: status === 'active' ? 700 : 500 }}>{label}</span>
    </div>
  );
}

// ============================================================
// MARKDOWN RENDERER (basic)
// ============================================================
function MarkdownText({ content }) {
  const lines = content.split('\n');
  return (
    <div style={{ lineHeight: 1.65 }}>
      {lines.map((line, i) => {
        if (line.startsWith('### ')) return <div key={i} style={{ fontWeight: 700, fontSize: 13, color: '#a78bfa', marginTop: 10, marginBottom: 4 }}>{line.slice(4)}</div>;
        if (line.startsWith('## ')) return <div key={i} style={{ fontWeight: 700, fontSize: 14, color: '#c4b5fd', marginTop: 12, marginBottom: 4 }}>{line.slice(3)}</div>;
        if (line.startsWith('# ')) return <div key={i} style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginTop: 12, marginBottom: 6 }}>{line.slice(2)}</div>;
        if (line.startsWith('- ') || line.startsWith('* ')) return <div key={i} style={{ display: 'flex', gap: 8, marginTop: 3 }}><span style={{ color: '#8b5cf6', marginTop: 2 }}>•</span><span>{renderInline(line.slice(2))}</span></div>;
        if (/^\d+\. /.test(line)) { const n = line.match(/^(\d+)\. /)[1]; return <div key={i} style={{ display: 'flex', gap: 8, marginTop: 3 }}><span style={{ color: '#8b5cf6', minWidth: 16 }}>{n}.</span><span>{renderInline(line.replace(/^\d+\. /, ''))}</span></div>; }
        if (line.startsWith('```')) return <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 11.5, marginTop: 6, color: '#86efac', overflowX: 'auto' }}></div>;
        if (line.startsWith('> ')) return <div key={i} style={{ borderLeft: '3px solid #6366f1', paddingLeft: 10, marginTop: 4, color: '#a1a1aa', fontStyle: 'italic' }}>{line.slice(2)}</div>;
        if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
        return <div key={i} style={{ marginTop: 2 }}>{renderInline(line)}</div>;
      })}
    </div>
  );
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(139,92,246,0.12)', padding: '1px 5px', borderRadius: 4, fontSize: '0.9em', color: '#a78bfa' }}>{p.slice(1, -1)}</code>;
    if (p.startsWith('*') && p.endsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
    return p;
  });
}

// ============================================================
// SUGGESTED PROMPTS
// ============================================================
const SUGGESTED = [
  { icon: '🛡', label: 'Explain Zero-Trust', q: 'What is Zero-Trust architecture and how do I implement it?' },
  { icon: '🧠', label: 'How does RAG work?', q: 'Explain how Retrieval-Augmented Generation (RAG) works' },
  { icon: '☁️', label: 'Cloud Security', q: 'What are the best practices for cloud security and AWS IAM?' },
  { icon: '🤖', label: 'AI & LLMs', q: 'How do large language models work?' },
  { icon: '⚙️', label: 'System Design', q: 'How do I design a scalable microservices architecture?' },
  { icon: '📊', label: 'Explain ML', q: 'Explain neural networks and deep learning basics' },
];

// ============================================================
// MAIN CHATBOT COMPONENT
// ============================================================
export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `# 👋 Hey! I'm CEREBRO AI\n\nI'm powered by a **Real-Time RAG Pipeline** — I search a knowledge base of **${KNOWLEDGE_BASE.length} documents** across security, AI, engineering, science & more before answering.\n\nAsk me **anything** — I answer every kind of question!`,
      sources: [],
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pipeline, setPipeline] = useState(null); // { step: 'retrieve'|'augment'|'generate', chunks: [] }
  const [kbCount] = useState(KNOWLEDGE_BASE.length);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, pipeline]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = useCallback(async (userMsg) => {
    if (!userMsg.trim() || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    // ── STEP 1: RETRIEVE ──
    setPipeline({ step: 'retrieve', chunks: [], query: userMsg });
    await new Promise(r => setTimeout(r, 500));

    const chunks = retrieveChunks(userMsg, 3);
    setPipeline({ step: 'augment', chunks, query: userMsg });
    await new Promise(r => setTimeout(r, 400));

    // ── STEP 2: BUILD AUGMENTED PROMPT ──
    const ragContext = chunks.length > 0
      ? `RETRIEVED KNOWLEDGE BASE CONTEXT:\n${chunks.map((c, i) => `[${i + 1}] [${c.category}] ${c.topic}:\n${c.text}`).join('\n\n')}\n\n---\nUSE THE ABOVE CONTEXT TO GROUND YOUR ANSWER. Cite relevant sections when applicable.`
      : `No specific context found. Answer from general knowledge.`;

    setPipeline({ step: 'generate', chunks, query: userMsg });

    const systemPrompt = `You are CEREBRO AI — an intelligent assistant built into SentinelX, an enterprise security platform. You have access to a curated knowledge base and can answer any question across cybersecurity, AI/ML, software engineering, science, mathematics, finance, and general knowledge.

RULES:
- Answer clearly and thoroughly using markdown formatting (headers ##, bullet points -, bold **text**, code \`snippets\`)
- For technical topics, include practical examples and best practices
- Structure complex answers with clear sections
- If the RAG context is relevant, use it and reference it
- Be conversational but professional
- Always aim to be genuinely helpful

${ragContext}`;

    // ── STEP 3: GENERATE (streaming) ──
    setMessages(prev => [...prev, { role: 'assistant', content: '', sources: chunks, streaming: true }]);

    try {
      const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;
      const hasKey = apiKey && apiKey !== 'your_nvidia_api_key_here';

      if (!hasKey) {
        // ── MOCK STREAMING fallback ──
        const mockAnswers = {
          rag: `## Retrieval-Augmented Generation (RAG)\n\nRAG is a technique that enhances LLM responses by **retrieving relevant documents** before generating an answer.\n\n### How it works:\n1. **Query Encoding** — The user's question is converted to a vector embedding\n2. **Retrieval** — Semantically similar documents are fetched from a vector store\n3. **Augmentation** — Retrieved chunks are injected into the LLM prompt\n4. **Generation** — The LLM generates a grounded, factual response\n\n### Why RAG?\n- Reduces hallucinations by grounding responses in real data\n- Enables up-to-date knowledge without retraining\n- Provides citations and source transparency\n\nThis chatbot uses a **TF-IDF based retrieval** pipeline on ${kbCount} pre-loaded documents across multiple domains!`,
          default: `## Great question!\n\nBased on the retrieved context from my knowledge base, here's what I found:\n\n${chunks.length > 0 ? chunks.map(c => `### ${c.topic}\n${c.text}`).join('\n\n') : `I searched ${kbCount} documents but didn't find a highly specific match. Here\'s what I know:\n\nThis topic covers important concepts that span multiple domains. I'd recommend asking a more specific question or exploring related areas like AI, security, engineering, or science.`}\n\n---\n*Answer generated using CEREBRO AI RAG Pipeline | ${chunks.length} sources retrieved*`,
        };
        const qLower = userMsg.toLowerCase();
        const answer = qLower.includes('rag') || qLower.includes('retrieval') ? mockAnswers.rag : mockAnswers.default;

        let streamed = '';
        for (let i = 0; i < answer.length; i++) {
          await new Promise(r => setTimeout(r, 8 + Math.random() * 12));
          streamed += answer[i];
          setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], content: streamed }; return u; });
        }
      } else {
        // ── REAL NVIDIA STREAMING ──
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({
            model: 'meta/llama-3.3-70b-instruct',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.filter(m => !m.streaming).slice(-8).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMsg }
            ],
            temperature: 0.65,
            top_p: 0.95,
            max_tokens: 1024,
            stream: true,
          })
        });

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accum = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data:')) continue;
            const raw = line.replace('data:', '').trim();
            if (raw === '[DONE]') break;
            try {
              const parsed = JSON.parse(raw);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              accum += delta;
              setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], content: accum }; return u; });
            } catch (_) { }
          }
        }
      }

      // Mark done
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], streaming: false }; return u; });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], content: `⚠️ **Error:** ${err.message}\n\nPlease check your API key in the \`.env\` file.`, streaming: false }; return u; });
      }
    } finally {
      setIsLoading(false);
      setPipeline(null);
      abortRef.current = null;
    }
  }, [isLoading, messages, kbCount]);

  const stopGeneration = () => { abortRef.current?.abort(); setIsLoading(false); setPipeline(null); };

  const chatWidth = isExpanded ? 720 : 380;
  const chatHeight = isExpanded ? 'calc(100vh - 100px)' : 560;

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: '50%',
          background: isOpen ? 'rgba(30,20,50,0.95)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          border: isOpen ? '1px solid rgba(139,92,246,0.4)' : 'none',
          boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 24px rgba(139,92,246,0.50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: isOpen ? 'scale(0.92) rotate(90deg)' : 'scale(1)',
        }}
        aria-label="Toggle CEREBRO AI"
      >
        {isOpen
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        }
      </button>

      {/* Unread indicator */}
      {!isOpen && (
        <div style={{ position: 'fixed', bottom: 68, right: 22, background: '#22c55e', width: 10, height: 10, borderRadius: '50%', zIndex: 10000, boxShadow: '0 0 8px #22c55e', animation: 'liveRing 2s infinite' }} />
      )}

      {/* ── Chat Window ── */}
      <div style={{
        position: 'fixed', bottom: 96, right: 24,
        width: chatWidth, height: chatHeight,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 110px)',
        background: 'rgba(9,9,15,0.97)',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: 20,
        boxShadow: '0 24px 64px rgba(0,0,0,0.70), 0 0 0 1px rgba(255,255,255,0.04) inset',
        display: 'flex', flexDirection: 'column',
        zIndex: 9998,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        backdropFilter: 'blur(24px)',
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(139,92,246,0.05)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(139,92,246,0.5)', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M12 6v6l4 2" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>CEREBRO AI</div>
            <div style={{ fontSize: 10.5, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'liveRing 2s infinite' }} />
              RAG Pipeline · {kbCount} docs indexed
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setIsExpanded(e => !e)} title={isExpanded ? 'Collapse' : 'Expand'} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isExpanded
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6m0 0v6m0-6-7 7M9 21H3m0 0v-6m0 6 7-7" /></svg>
              }
            </button>
            <button onClick={() => { setMessages([{ role: 'assistant', content: `# 👋 Chat cleared!\n\nI'm ready for a new conversation. Ask me anything!`, sources: [] }]); }} title="Clear chat" style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" /></svg>
            </button>
          </div>
        </div>

        {/* ── RAG Pipeline Status ── */}
        {pipeline && (
          <div style={{ padding: '8px 18px', borderBottom: '1px solid rgba(139,92,246,0.15)', background: 'rgba(139,92,246,0.04)', display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1, color: '#6366f1', textTransform: 'uppercase' }}>RAG Pipeline</span>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <PipelineStep label="Retrieve" status={pipeline.step === 'retrieve' ? 'active' : 'done'} />
              <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <PipelineStep label="Augment" status={pipeline.step === 'retrieve' ? 'waiting' : pipeline.step === 'augment' ? 'active' : 'done'} />
              <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <PipelineStep label="Generate" status={pipeline.step === 'generate' ? 'active' : 'waiting'} />
            </div>
            {pipeline.chunks?.length > 0 && pipeline.step !== 'retrieve' && (
              <span style={{ marginLeft: 'auto', fontSize: 10, color: '#a78bfa', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 6, padding: '2px 7px' }}>
                {pipeline.chunks.length} sources
              </span>
            )}
          </div>
        )}

        {/* ── Messages ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Suggested prompts (only on first load) */}
          {messages.length === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
              {SUGGESTED.map(s => (
                <button key={s.q} onClick={() => sendMessage(s.q)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 11px', borderRadius: 10, background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', color: 'var(--text-secondary)', fontSize: 11.5, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.14)'; e.currentTarget.style.color = '#a78bfa'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.07)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <span style={{ fontSize: 13 }}>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 6 }}>

              {/* Role label */}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: msg.role === 'user' ? '#8b5cf6' : '#52525b', display: 'flex', alignItems: 'center', gap: 5 }}>
                {msg.role === 'user' ? (
                  <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> You</>
                ) : (
                  <><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'liveRing 2s infinite' }} /> CEREBRO AI</>
                )}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '90%',
                padding: '11px 15px',
                borderRadius: 14,
                borderBottomRightRadius: msg.role === 'user' ? 3 : 14,
                borderBottomLeftRadius: msg.role === 'assistant' ? 3 : 14,
                background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(99,102,241,0.14))' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
                color: msg.role === 'user' ? '#c4b5fd' : 'var(--text-secondary)',
                fontSize: 13.5, wordBreak: 'break-word',
              }}>
                {msg.role === 'user'
                  ? <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                  : <MarkdownText content={msg.content} />
                }
                {msg.streaming && (
                  <span style={{ display: 'inline-block', width: 3, height: 14, background: '#8b5cf6', marginLeft: 3, verticalAlign: 'middle', animation: 'blink 0.8s step-end infinite', borderRadius: 2 }} />
                )}
              </div>

              {/* Sources */}
              {msg.role === 'assistant' && msg.sources?.length > 0 && !msg.streaming && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, maxWidth: '90%' }}>
                  {msg.sources.map((src, si) => (
                    <div key={si} title={src.text.slice(0, 120) + '...'} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 6, padding: '3px 9px', fontSize: 10.5, color: '#818cf8', cursor: 'help' }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      [{si + 1}] {src.topic}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && !pipeline && messages[messages.length - 1]?.role === 'user' && (
            <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, borderBottomLeftRadius: 3, width: 'fit-content' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input area ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
          <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Ask anything — security, AI, coding, science…"
                value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                disabled={isLoading}
                style={{
                  width: '100%', boxSizing: 'border-box', resize: 'none', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 12, padding: '10px 14px',
                  color: 'var(--text-primary)', fontSize: 13.5,
                  fontFamily: 'Inter, sans-serif', outline: 'none',
                  transition: 'border-color 0.2s',
                  lineHeight: 1.5,
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
              />
            </div>

            {isLoading ? (
              <button type="button" onClick={stopGeneration} style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} style={{ width: 42, height: 42, borderRadius: 11, background: input.trim() ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : 'rgba(255,255,255,0.05)', border: 'none', color: input.trim() ? '#fff' : '#52525b', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', boxShadow: input.trim() ? '0 4px 16px rgba(139,92,246,0.35)' : 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            )}
          </form>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#3f3f46' }}>
            <span>Enter to send · Shift+Enter for newline</span>
            <span>Powered by NVIDIA + RAG</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
