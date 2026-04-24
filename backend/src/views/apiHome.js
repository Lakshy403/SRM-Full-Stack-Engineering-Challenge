function renderApiHome() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BFHL API</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4ede5;
        --panel: rgba(255, 250, 245, 0.88);
        --stroke: rgba(93, 62, 36, 0.12);
        --text: #2d2118;
        --muted: #745f4b;
        --accent: #d96f3d;
        --accent-dark: #a74d26;
        --code-bg: #fff7ef;
        --shadow: 0 18px 40px rgba(94, 65, 41, 0.12);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Segoe UI", Arial, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(239, 194, 112, 0.45), transparent 28%),
          radial-gradient(circle at bottom right, rgba(217, 111, 61, 0.2), transparent 24%),
          linear-gradient(135deg, #f7f0e8 0%, #efdfd0 100%);
      }

      .shell {
        width: min(960px, calc(100% - 32px));
        margin: 0 auto;
        padding: 40px 0 56px;
      }

      .hero,
      .panel {
        background: var(--panel);
        border: 1px solid var(--stroke);
        border-radius: 28px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(10px);
      }

      .hero {
        padding: 30px;
        margin-bottom: 22px;
      }

      .eyebrow {
        margin: 0 0 8px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--accent-dark);
        font-size: 12px;
        font-weight: 700;
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(32px, 4vw, 52px);
        line-height: 1;
      }

      p {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 18px;
      }

      .panel {
        padding: 22px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(217, 111, 61, 0.12);
        color: var(--accent-dark);
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 12px;
      }

      code,
      pre {
        font-family: Consolas, "Courier New", monospace;
      }

      .inline-code {
        display: inline-block;
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 14px;
        background: var(--code-bg);
        color: var(--accent-dark);
        font-weight: 700;
        word-break: break-word;
      }

      pre {
        margin: 14px 0 0;
        padding: 16px;
        overflow-x: auto;
        border-radius: 18px;
        background: var(--code-bg);
        color: var(--text);
        font-size: 14px;
        line-height: 1.55;
        border: 1px solid rgba(93, 62, 36, 0.08);
      }

      ul {
        margin: 12px 0 0;
        padding-left: 18px;
        color: var(--muted);
      }

      li + li {
        margin-top: 8px;
      }

      @media (max-width: 640px) {
        .hero,
        .panel {
          border-radius: 22px;
          padding: 18px;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">SRM Full Stack Engineering Challenge</p>
        <h1>BFHL API</h1>
        <p>
          This backend processes parent-child node relationships and returns hierarchy insights,
          validation errors, duplicate tracking, cycle detection, and summary metadata.
        </p>
        <div class="inline-code">POST /bfhl</div>
      </section>

      <section class="grid">
        <article class="panel">
          <div class="pill">Available Routes</div>
          <ul>
            <li><strong>GET /</strong> - API overview page</li>
            <li><strong>GET /health</strong> - service health check</li>
            <li><strong>POST /bfhl</strong> - process hierarchy data</li>
          </ul>
        </article>

        <article class="panel">
          <div class="pill">Request Format</div>
          <p>Send JSON with a <code>data</code> array of edges in the format <code>X-&gt;Y</code>.</p>
          <pre>{
  "data": ["A-&gt;B", "A-&gt;C", "B-&gt;D"]
}</pre>
        </article>

        <article class="panel">
          <div class="pill">Response Highlights</div>
          <ul>
            <li>Identity fields: <code>user_id</code>, <code>email_id</code>, <code>college_roll_number</code></li>
            <li>Hierarchies with tree depth, node count, and cycle handling</li>
            <li><code>invalid_entries</code>, <code>duplicate_edges</code>, and <code>summary</code></li>
          </ul>
        </article>

        <article class="panel">
          <div class="pill">Usage Note</div>
          <p>
            Open the frontend deployment for the interactive UI, or test this API directly with
            Postman, Hoppscotch, or any HTTP client using <code>Content-Type: application/json</code>.
          </p>
        </article>
      </section>
    </main>
  </body>
</html>`;
}

module.exports = { renderApiHome };
