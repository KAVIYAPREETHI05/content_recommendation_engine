// src/pages/creator/ReaderPreferenceInsights.js
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import "../../../css/creator/readerPreferenceInsights.css";

const ReaderPreferenceInsights = ({ creatorId }) => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/insights/preferences/${creatorId}`);
        const data = await res.json();
        setInsights(data);
      } catch (err) {
        console.error("Failed to fetch insights:", err);
      }
    };
    fetchInsights();
  }, [creatorId]);

  if (!insights) return <p>Loading insights...</p>;

  const { searchCounts, engagementByCategory, recommendedCategories } = insights;

  return (
    <div className="insights-container">
      <h2>Reader Preference Insights</h2>

      <section className="chart-section">
        <h3>Most Searched Topics</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={searchCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-section">
        <h3>Engagement by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={engagementByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="engagement" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="recommendations-section">
        <h3>Recommended Categories</h3>
        <ul>
          {recommendedCategories.map((cat, idx) => (
            <li key={idx}>{cat}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ReaderPreferenceInsights;
