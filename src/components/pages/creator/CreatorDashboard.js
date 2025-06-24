// src/pages/CreatorDashboard.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../css/creator/creatorDashboard.css";

const CreatorDashboard = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [creatorData, setCreatorData] = useState(null);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/creators/${creatorId}`);
        const data = await res.json();
        console.log("Fetched data:", data);
        if (res.ok) {
          setCreatorData(data);
        } else {
          alert(data.message || "Failed to fetch creator data");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Server error");
        navigate("/login");
      }
    };

    if (creatorId) {
      fetchCreator();
    }
  }, [creatorId, navigate]);

  if (!creatorData) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {creatorData.email}</h2>
      <p>Creator ID: {creatorId}</p>
      <div className="dashboard-actions">
        <button onClick={() => navigate(`/creator/${creatorId}/create-post`)}>
          Create New Blog
        </button>
        <button onClick={() => navigate(`/creator/${creatorId}/manage-posts`)}>
          Manage My Blogs
        </button>
        <button onClick={() => navigate(`/creator/${creatorId}/analytics`)}>
          Blog Analytics
        </button>
        <button onClick={() => navigate(`/creator/${creatorId}/suggestions`)}>
        AI Blog Suggestions
        </button>

      </div>
    </div>
  );
};

export default CreatorDashboard;
