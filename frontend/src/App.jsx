import { useState } from "react";
import TreeNode from "./components/TreeNode";

const SAMPLE_INPUT = `A->B
A->C
B->D`;

function parseEntries(rawValue) {
  return rawValue
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ResultCard({ title, children }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function HierarchyCard({ item }) {
  if (item.has_cycle) {
    return (
      <article className="hierarchy-panel hierarchy-cycle-panel">
        <div className="hierarchy-topline">
          <span className="cycle-pill">Cycle detected</span>
        </div>
        <p className="muted-text">Nodes involved: {item.component_nodes.join(", ")}</p>
      </article>
    );
  }

  return (
    <article className="hierarchy-panel">
      <div className="hierarchy-stats">
        <span>Root: {item.root}</span>
        <span>Depth: {item.depth}</span>
        <span>Nodes: {item.node_count}</span>
      </div>
      <div className="tree-explorer">
        <ul className="tree-root">
          <TreeNode node={item.tree} />
        </ul>
      </div>
    </article>
  );
}

export default function App() {
  const [inputValue, setInputValue] = useState(SAMPLE_INPUT);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  async function handleSubmit(event) {
    event.preventDefault();

    const entries = parseEntries(inputValue);

    if (entries.length === 0) {
      setError("Please enter at least one edge in the format X->Y.");
      setResponse(null);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const apiResponse = await fetch(`${apiBaseUrl}/bfhl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: entries })
      });

      const payload = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(payload.message || "Failed to process data.");
      }

      setResponse(payload);
    } catch (submitError) {
      setError(submitError.message || "Unable to reach the backend service.");
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero card hero-card">
        <p className="eyebrow">SRM Full Stack Engineering Challenge</p>
        <h1>BFHL Hierarchy Analyzer</h1>
        <p className="hero-copy">
          Paste parent-child pairs, send them to the Express API, and inspect trees, cycles,
          duplicates, invalid entries, and the final summary in one place.
        </p>
      </section>

      <div className="layout">
        <section className="card form-card">
          <div className="card-header">
            <h2>Input</h2>
            <button type="button" className="ghost-button" onClick={() => setInputValue(SAMPLE_INPUT)}>
              Load sample
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="edges">
              Enter one relation per line or separated by commas
            </label>
            <textarea
              id="edges"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="A->B&#10;A->C&#10;B->D"
              rows={12}
            />

            <div className="actions">
              <button type="submit" className="primary-button" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Submit"}
              </button>
            </div>
          </form>

          {error && <p className="error-text">{error}</p>}
        </section>

        <section className="results-column">
          <ResultCard title="API Response">
            {response ? (
              <div className="identity-grid">
                <div className="glass-item">
                  <span className="meta-label">User ID</span>
                  <strong>{response.user_id}</strong>
                </div>
                <div className="glass-item">
                  <span className="meta-label">Email</span>
                  <strong>{response.email_id}</strong>
                </div>
                <div className="glass-item">
                  <span className="meta-label">Roll Number</span>
                  <strong>{response.college_roll_number}</strong>
                </div>
              </div>
            ) : (
              <p className="muted-text">Submit data to see the processed response.</p>
            )}
          </ResultCard>

          <ResultCard title="Hierarchies">
            {response?.hierarchies?.length ? (
              <div className="stack">
                {response.hierarchies.map((item, index) => (
                  <HierarchyCard item={item} key={`hierarchy-${index}`} />
                ))}
              </div>
            ) : (
              <p className="muted-text">No hierarchy output yet.</p>
            )}
          </ResultCard>

          <ResultCard title="Validation">
            {response ? (
              <div className="validation-grid">
                <div className="subcard">
                  <h3>Invalid Entries</h3>
                  <p>{response.invalid_entries.length ? response.invalid_entries.join(", ") : "None"}</p>
                </div>
                <div className="subcard">
                  <h3>Duplicate Edges</h3>
                  <p>{response.duplicate_edges.length ? response.duplicate_edges.join(", ") : "None"}</p>
                </div>
              </div>
            ) : (
              <p className="muted-text">Validation results will appear here.</p>
            )}
          </ResultCard>

          <ResultCard title="Summary">
            {response?.summary ? (
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-value">{response.summary.total_trees}</span>
                  <span className="summary-label">Total Trees</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value">{response.summary.total_cycles}</span>
                  <span className="summary-label">Total Cycles</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value">{response.summary.largest_tree_root || "-"}</span>
                  <span className="summary-label">Largest Tree Root</span>
                </div>
              </div>
            ) : (
              <p className="muted-text">Summary metrics will appear here.</p>
            )}
          </ResultCard>
        </section>
      </div>
    </main>
  );
}
