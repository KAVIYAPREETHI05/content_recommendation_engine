import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AISuggestions = () => {
  const { creatorId } = useParams();
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSuggestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/insights/suggestions/${creatorId}`);
      const data = await res.json();
      if (res.ok) {
        setSuggestions(data.suggestions);
      } else {
        throw new Error(data.message || "Error generating suggestions");
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Failed to load suggestions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [creatorId]);

  return (
    <div className="ai-suggestions" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ color: "#333", marginBottom: "1rem" }}>AI-Powered Blog Suggestions</h2>
      <button onClick={fetchSuggestions} disabled={loading} style={{
        marginBottom: "1rem",
        padding: "8px 16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: loading ? "not-allowed" : "pointer"
      }}>
        {loading ? "Generating..." : "Regenerate Suggestions"}
      </button>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "5px" }}>
          {suggestions}
        </pre>
      )}
    </div>
  );
};

export default AISuggestions;
