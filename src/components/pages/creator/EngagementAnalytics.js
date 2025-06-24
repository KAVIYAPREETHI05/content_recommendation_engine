import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "../../../css/creator/engagementAnalytics.css";
import { useParams } from "react-router-dom";

const EngagementAnalytics = () => {
  const { creatorId } = useParams();
  const [engagementData, setEngagementData] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    topCategory: "N/A"
  });

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/engagement/${creatorId}`);
        const data = await res.json();
        setEngagementData(data);

        const totalPosts = data.length;
        const totalLikes = data.reduce((sum, post) => sum + (post.likes || 0), 0);
        const totalComments = data.reduce((sum, post) => sum + (post.comments || 0), 0);

        const categoryMap = {};
        data.forEach(post => {
          const category = post.category || "Uncategorized";
          const engagement = (post.likes || 0) + (post.comments || 0);
          categoryMap[category] = (categoryMap[category] || 0) + engagement;
        });

        const topCategory = Object.entries(categoryMap)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

        setStats({ totalPosts, totalLikes, totalComments, topCategory });
      } catch (err) {
        console.error("Failed to fetch engagement data:", err);
      }
    };

    if (creatorId) {
      fetchEngagement();
    }
  }, [creatorId]);

  return (
    <div className="engagement-analytics-container">
      <h2>Post Engagement Analytics</h2>

      <div className="engagement-summary">
        <div className="summary-card">
          <h3>Total Blogs</h3>
          <p>{stats.totalPosts}</p>
        </div>
        <div className="summary-card">
          <h3>Total Likes</h3>
          <p>{stats.totalLikes}</p>
        </div>
        <div className="summary-card">
          <h3>Total Comments</h3>
          <p>{stats.totalComments}</p>
        </div>
        <div className="summary-card">
          <h3>Top Category</h3>
          <p>{stats.topCategory}</p>
        </div>
      </div>

  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={engagementData}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="title" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="views" fill="#8884d8" name="Views" />
      <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
      <Bar dataKey="comments" fill="#ffc658" name="Comments" />
    </BarChart>
  </ResponsiveContainer>

    </div>
  );
};

export default EngagementAnalytics;
