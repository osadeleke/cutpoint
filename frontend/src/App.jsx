import { useState, useEffect, useRef } from "react";

const API_BASE = "";

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
`;

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080a0f;
    --bg2: #0d1018;
    --bg3: #13161f;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.15);
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --gold-dim: rgba(201,168,76,0.15);
    --text: #e8e4dc;
    --text-muted: rgba(232,228,220,0.45);
    --text-dim: rgba(232,228,220,0.25);
    --red: #e05c5c;
    --green: #5ce0a0;
    --radius: 2px;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--gold-dim); color: var(--gold-light); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .glow-orb {
    position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
    filter: blur(100px); opacity: 0.12;
  }
  .glow-orb-1 { width: 600px; height: 600px; background: var(--gold); top: -200px; right: -100px; }
  .glow-orb-2 { width: 400px; height: 400px; background: #4c6ec9; bottom: -100px; left: -100px; }

  .app {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column;
    max-width: 860px; margin: 0 auto;
    padding: 0 24px;
  }

  /* HEADER */
  .header {
    padding: 48px 0 64px;
    display: flex; flex-direction: column; gap: 8px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 64px;
    position: relative;
  }
  .header::after {
    content: ''; position: absolute; bottom: -1px; left: 0;
    width: 80px; height: 1px; background: var(--gold);
  }
  .header-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.2em;
    color: var(--gold); text-transform: uppercase;
  }
  .header-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(42px, 6vw, 68px);
    font-weight: 300; line-height: 1.0;
    letter-spacing: -0.02em;
    color: var(--text);
  }
  .header-title em { font-style: italic; color: var(--gold-light); }
  .header-desc {
    margin-top: 8px;
    font-size: 13px; color: var(--text-muted); letter-spacing: 0.02em;
    font-weight: 400; max-width: 420px; line-height: 1.6;
  }

  /* NAV TABS */
  .nav-tabs {
    display: flex; gap: 0; margin-bottom: 48px;
    border-bottom: 1px solid var(--border);
  }
  .nav-tab {
    background: none; border: none; cursor: pointer;
    padding: 12px 24px; font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-muted); position: relative;
    transition: color 0.2s;
  }
  .nav-tab:hover { color: var(--text); }
  .nav-tab.active { color: var(--gold); }
  .nav-tab.active::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
    height: 1px; background: var(--gold);
  }

  /* FORM */
  .form-section { margin-bottom: 48px; }
  .form-label {
    display: block; font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--text-dim); margin-bottom: 10px;
  }
  .url-inputs { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
  .input-wrap { position: relative; }
  .input-number {
    position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: var(--gold); letter-spacing: 0.1em;
  }
  .url-input {
    width: 100%; background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 18px 18px 48px;
    font-family: 'DM Mono', monospace; font-size: 13px;
    color: var(--text); letter-spacing: 0.02em;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  .url-input::placeholder { color: var(--text-dim); }
  .url-input:focus {
    border-color: var(--gold-dim);
    background: var(--bg2);
    box-shadow: 0 0 0 3px var(--gold-dim);
  }

  .btn-generate {
    background: var(--gold); color: #080a0f;
    border: none; border-radius: var(--radius);
    padding: 18px 40px; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 12px;
    font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    transition: background 0.2s, transform 0.15s;
    position: relative; overflow: hidden;
  }
  .btn-generate:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-generate:active { transform: translateY(0); }
  .btn-generate:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-generate .loading-dots { display: inline-flex; gap: 3px; }
  .btn-generate .loading-dots span {
    width: 4px; height: 4px; background: currentColor; border-radius: 50%;
    animation: dot-bounce 0.8s ease-in-out infinite;
  }
  .btn-generate .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
  .btn-generate .loading-dots span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-4px); }
  }

  .error-msg {
    margin-top: 16px; padding: 14px 18px;
    background: rgba(224,92,92,0.08); border: 1px solid rgba(224,92,92,0.2);
    border-radius: var(--radius);
    font-family: 'DM Mono', monospace; font-size: 12px;
    color: var(--red); letter-spacing: 0.02em;
  }

  /* RESULT CARD */
  .result-card {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    animation: fade-up 0.4s ease forwards;
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .result-header {
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
    background: rgba(201,168,76,0.04);
  }
  .result-header-left { display: flex; flex-direction: column; gap: 4px; }
  .result-label {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold);
  }
  .result-url {
    font-family: 'DM Mono', monospace; font-size: 15px;
    color: var(--text); letter-spacing: 0.03em;
  }
  .btn-copy {
    background: none; border: 1px solid var(--border);
    border-radius: var(--radius); padding: 8px 16px; cursor: pointer;
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-muted); transition: all 0.2s; white-space: nowrap;
  }
  .btn-copy:hover { border-color: var(--gold); color: var(--gold); }
  .btn-copy.copied { border-color: var(--green); color: var(--green); }

  .result-meta {
    padding: 16px 24px;
    display: flex; gap: 24px; flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
  }
  .meta-stat { display: flex; flex-direction: column; gap: 3px; }
  .meta-stat-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim);
  }
  .meta-stat-value {
    font-family: 'DM Mono', monospace; font-size: 13px; color: var(--text-muted);
  }

  .url-rows { padding: 8px 0; }
  .url-row {
    padding: 16px 24px; display: flex; align-items: flex-start;
    gap: 16px; border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .url-row:last-child { border-bottom: none; }
  .url-row:hover { background: rgba(255,255,255,0.02); }
  .url-row-index {
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: var(--gold); min-width: 20px; padding-top: 2px; letter-spacing: 0.05em;
  }
  .url-row-info { flex: 1; min-width: 0; }
  .url-row-link {
    font-family: 'DM Mono', monospace; font-size: 12px;
    color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    display: block; margin-bottom: 6px;
  }
  .url-row-stats { display: flex; gap: 16px; flex-wrap: wrap; }
  .url-stat-pill {
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: var(--text-dim); letter-spacing: 0.05em;
  }
  .url-stat-pill strong { color: var(--text-muted); font-weight: 500; }

  /* ADMIN */
  .admin-form {
    display: flex; gap: 12px; align-items: flex-end; margin-bottom: 40px; flex-wrap: wrap;
  }
  .admin-input-wrap { flex: 1; min-width: 200px; }
  .pass-input {
    width: 100%; background: var(--bg3);
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 16px 18px; font-family: 'DM Mono', monospace; font-size: 13px;
    color: var(--text); outline: none; transition: border-color 0.2s;
  }
  .pass-input:focus { border-color: var(--gold-dim); box-shadow: 0 0 0 3px var(--gold-dim); }

  .btn-outline {
    background: none; border: 1px solid var(--gold);
    border-radius: var(--radius); padding: 16px 28px; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 11px;
    font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--gold); transition: all 0.2s; white-space: nowrap;
  }
  .btn-outline:hover { background: var(--gold-dim); }
  .btn-outline:disabled { opacity: 0.4; cursor: not-allowed; }

  .dashboard-grid { display: flex; flex-direction: column; gap: 12px; }
  .dashboard-item {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    animation: fade-up 0.3s ease forwards;
  }
  .dash-header {
    padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
    background: rgba(201,168,76,0.03);
  }
  .dash-code {
    font-family: 'DM Mono', monospace; font-size: 14px;
    color: var(--gold); letter-spacing: 0.1em;
  }
  .dash-hits {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: var(--text-dim); letter-spacing: 0.1em;
  }
  .dash-hits strong { color: var(--green); }
  .dash-urls { padding: 8px 0; }
  .dash-url-row {
    padding: 10px 20px; display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid var(--border);
  }
  .dash-url-row:last-child { border-bottom: none; }
  .dash-url-idx {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: var(--gold); min-width: 16px; opacity: 0.7;
  }
  .dash-url-link {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: var(--text-muted); flex: 1; min-width: 0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .dash-url-hits {
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: var(--text-dim); white-space: nowrap;
  }
  .dash-url-hits strong { color: var(--text-muted); }

  .empty-state {
    padding: 64px 0; text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; font-style: italic;
    color: var(--text-dim);
  }

  /* DIVIDER */
  .section-divider {
    display: flex; align-items: center; gap: 16px;
    margin: 48px 0; opacity: 0.3;
  }
  .section-divider::before, .section-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .section-divider span {
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: var(--text-dim); letter-spacing: 0.2em;
  }

  /* FOOTER */
  .footer {
    margin-top: auto; padding: 40px 0;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .footer-text {
    font-family: 'DM Mono', monospace; font-size: 10px;
    color: var(--text-dim); letter-spacing: 0.1em;
  }

  @media (max-width: 600px) {
    .admin-form { flex-direction: column; }
    .result-meta { gap: 16px; }
    .header { padding: 32px 0 48px; }
  }
`;

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`btn-copy ${copied ? "copied" : ""}`} onClick={copy}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function ShortenTab() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setError("");
    if (!url1 || !url2) return setError("Please provide both URLs to continue.");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url1, url2 }),
      });
      const text = await res.text();
      if (!res.ok) return setError(text);
      const data = JSON.parse(text);
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-section">
        <span className="form-label">Destination URLs</span>
        <div className="url-inputs">
          <div className="input-wrap">
            <span className="input-number">01</span>
            <input
              className="url-input"
              type="url"
              placeholder="https://your-first-long-url.com/path/to/page"
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="input-wrap">
            <span className="input-number">02</span>
            <input
              className="url-input"
              type="url"
              placeholder="https://your-second-long-url.com/another/path"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <button className="btn-generate" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <span className="loading-dots">
              <span /><span /><span />
            </span>
          ) : (
            "Generate Short Link"
          )}
        </button>

        {error && <div className="error-msg">⚠ {error}</div>}
      </div>

      {result && (
        <>
          <div className="section-divider"><span>result</span></div>
          <div className="result-card">
            <div className="result-header">
              <div className="result-header-left">
                <span className="result-label">Shortened URL</span>
                <span className="result-url">{result.shortenedUrl}</span>
              </div>
              <CopyButton text={result.shortenedUrl} />
            </div>

            <div className="result-meta">
              <div className="meta-stat">
                <span className="meta-stat-label">Short Length</span>
                <span className="meta-stat-value">{result.lengthOfNewUrl} chars</span>
              </div>
              <div className="meta-stat">
                <span className="meta-stat-label">Created</span>
                <span className="meta-stat-value">
                  {new Date(result.urls.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            <div className="url-rows">
              {result.urls.urls?.map((u, i) => (
                <div className="url-row" key={u.id}>
                  <span className="url-row-index">0{i + 1}</span>
                  <div className="url-row-info">
                    <span className="url-row-link" title={u.link}>{u.link}</span>
                    <div className="url-row-stats">
                      <span className="url-stat-pill">
                        Original: <strong>{u.originalLength} chars</strong>
                      </span>
                      <span className="url-stat-pill">
                        Compression: <strong>{u.percentDecrease}</strong>
                      </span>
                      <span className="url-stat-pill">
                        Hits: <strong>{u.hits}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminTab() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    setError("");
    if (!password) return setError("Password required.");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard?password=${encodeURIComponent(password)}`);
      const text = await res.text();
      if (!res.ok) return setError(text);
      setData(JSON.parse(text));
    } catch {
      setError("Failed to fetch dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const entries = data ? Object.entries(data) : [];

  return (
    <div>
      <div className="admin-form">
        <div className="admin-input-wrap">
          <span className="form-label">Admin Password</span>
          <input
            className="pass-input"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchDashboard()}
          />
        </div>
        <button className="btn-outline" onClick={fetchDashboard} disabled={loading}>
          {loading ? "Loading..." : "Access Dashboard"}
        </button>
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      {data && (
        <>
          <div className="section-divider"><span>{entries.length} link{entries.length !== 1 ? "s" : ""} tracked</span></div>
          {entries.length === 0 ? (
            <div className="empty-state">No links have been generated yet.</div>
          ) : (
            <div className="dashboard-grid">
              {entries.map(([code, info]) => (
                <div className="dashboard-item" key={code}>
                  <div className="dash-header">
                    <span className="dash-code">/{code}</span>
                    <span className="dash-hits">Total hits: <strong>{info.totalHits}</strong></span>
                  </div>
                  <div className="dash-urls">
                    {info.urls?.map((u, i) => (
                      <div className="dash-url-row" key={u.id}>
                        <span className="dash-url-idx">0{i + 1}</span>
                        <span className="dash-url-link" title={u.link}>{u.link}</span>
                        <span className="dash-url-hits"><strong>{u.hits}</strong> hits</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("shorten");

  return (
    <>
      <style>{fonts}{styles}</style>
      <div className="noise" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="app">
        <header className="header">
          <span className="header-eyebrow">URL Shortener — v1.0</span>
          <h1 className="header-title">
            Two links,<br /><em>one address.</em>
          </h1>
          <p className="header-desc">
            Compress two destination URLs into a single short link. Each visit randomly routes to one of your targets.
          </p>
        </header>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${tab === "shorten" ? "active" : ""}`}
            onClick={() => setTab("shorten")}
          >Shorten</button>
          <button
            className={`nav-tab ${tab === "admin" ? "active" : ""}`}
            onClick={() => setTab("admin")}
          >Dashboard</button>
        </nav>

        <main>
          {tab === "shorten" ? <ShortenTab /> : <AdminTab />}
        </main>

        <footer className="footer">
          <span className="footer-text">© {new Date().getFullYear()} URL Shortener</span>
          <span className="footer-text">Dual-destination routing</span>
        </footer>
      </div>
    </>
  );
}
