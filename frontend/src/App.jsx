import { useState } from "react";

function App() {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [generated, setGenerated] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    if (!url1 || !url2) {
      setError("Both URLs are required.");
      return;
    }

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url1, url2 }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data);
        return;
      }

      setGenerated(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate short code.");
    }
  };

  const handleAdmin = async () => {
    if (!adminPassword) {
      setError("Please enter admin password.");
      return;
    }

    try {
      const res = await fetch(`/admin/dashboard?password=${encodeURIComponent(adminPassword)}`);
      if (!res.ok) {
        const text = await res.text();
        setError(`Admin error: ${text}`);
        return;
      }

      const data = await res.json();
      setAdminData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admin dashboard.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>CutPoint URL Shortener</h1>

      <section style={{ marginBottom: "2rem", padding: "1rem", background: "#fff", borderRadius: 8 }}>
        <h2>Generate Shortened URL</h2>
        <input placeholder="URL 1" value={url1} onChange={e => setUrl1(e.target.value)} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input placeholder="URL 2" value={url2} onChange={e => setUrl2(e.target.value)} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <button onClick={handleGenerate} style={{ padding: 8, width: "100%", background: "#4CAF50", color: "#fff", border: "none" }}>Generate</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {generated && (
          <div style={{ marginTop: 12 }}>
            <p>Shortened URL: <a href={generated.shortenedUrl} target="_blank">{generated.shortenedUrl}</a> (Length: {generated.lengthOfNewUrl})</p>
            <ul>
              {generated.urls.urls.map(u => (
                <li key={u.id}>
                  {u.link} — Hits: {u.hits}, Percent decrease: {u.percentDecrease}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section style={{ padding: "1rem", background: "#fff", borderRadius: 8 }}>
        <h2>Admin Dashboard</h2>
        <input type="password" placeholder="Admin Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <button onClick={handleAdmin} style={{ padding: 8, width: "100%", background: "#f44336", color: "#fff", border: "none" }}>View Dashboard</button>
        {adminData && (
          <pre style={{ marginTop: 12, background: "#eee", padding: 12, borderRadius: 6, maxHeight: 400, overflowY: "auto" }}>
            {JSON.stringify(adminData, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}

export default App;
