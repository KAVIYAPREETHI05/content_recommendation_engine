import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import "../../../css/creator/managePosts.css";

const ManagePosts = () => {
  const { creatorId } = useParams();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/creator/${creatorId}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [creatorId]);
  const handleView = (postId) => {
  navigate(`/creator/${creatorId}/view-post/${postId}`);
};

  const handleEdit = (postId) => {
  navigate(`/creator/${creatorId}/edit-post/${postId}`);
};

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted successfully.");
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-posts-container">
      <h2>Your Posts</h2>
      <input
        type="text"
        placeholder="Search by title, author, or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="posts-list">
        {filteredPosts.map((post) => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p><strong>Author:</strong> {post.author}</p>
            <p><strong>Category:</strong> {post.category}</p>
            <div className="post-actions">
              <button className="view-btn" onClick={() => handleView(post._id)}>View</button>
              <button className="edit-btn" onClick={() => handleEdit(post._id)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePosts;
