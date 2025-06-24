import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "../../../css/reader/readerAnalytics.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ReaderAnalytics = () => {
  const { readerId } = useParams();

  const [analytics, setAnalytics] = useState({
    readCount: 0,
    likedCount: 0,
    commentedCount: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/readers/analytics/${readerId}`);
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching reader analytics:", error);
      }
    };

    if (readerId) fetchAnalytics();
  }, [readerId]);

  const pieData = [
    { name: "Read", value: analytics.readCount },
    { name: "Liked", value: analytics.likedCount },
    { name: "Commented", value: analytics.commentedCount },
  ];

  const barData = [
    {
      name: "Reader Stats",
      Read: analytics.readCount,
      Liked: analytics.likedCount,
      Commented: analytics.commentedCount,
    },
  ];

  return (
    <div className="reader-analytics-container">
      <h2>📊 Reader Analytics</h2>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Blogs Read</h3>
          <p>{analytics.readCount}</p>
        </div>
        <div className="summary-card">
          <h3>Liked Blogs</h3>
          <p>{analytics.likedCount}</p>
        </div>
        <div className="summary-card">
          <h3>Commented Blogs</h3>
          <p>{analytics.commentedCount}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h4>📈 Bar Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Read" fill="#0088FE" />
              <Bar dataKey="Liked" fill="#00C49F" />
              <Bar dataKey="Commented" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4>🧁 Pie Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReaderAnalytics;
