import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../css/creator/creatorDashboard.css";


const ReaderDashboard = () => {
  const { readerID } = useParams();  // ✅ param match
  const navigate = useNavigate();
  const [readerData, setReaderData] = useState(null);

  useEffect(() => {
    const fetchReader = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/readers/${readerID}`);
        const data = await res.json();
        console.log("Fetched reader data:", data);
        if (res.ok) {
          setReaderData(data);
        } else {
          alert(data.message || "Failed to fetch reader data");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Server error");
        navigate("/login");
      }
    };

    if (readerID) fetchReader();
  }, [readerID, navigate]);

  if (!readerData) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {readerData.email}</h2>
      <p>Reader ID: {readerID}</p>
      <div className="dashboard-actions">
        <button onClick={() => navigate(`/reader/${readerID}/explore`)}>
          Explore Blogs
        </button>
        <button onClick={() => navigate(`/reader/${readerID}/analytics`)}>
          Analytics
        </button>
      </div>
    </div>
  );
};

export default ReaderDashboard;
