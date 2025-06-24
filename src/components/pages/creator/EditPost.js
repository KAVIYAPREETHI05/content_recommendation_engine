import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../css/creator/editPost.css";

const EditPost = () => {
  const { creatorId, postId } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    title: "",
    author: "",
    category: "",
    content: ""
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${postId}`);
        setPostData({
          title: res.data.title,
          author: res.data.author,
          category: res.data.category,
          content: res.data.content || "",
        });
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}`, postData);
      navigate(`/creator/${creatorId}/manage-posts`);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      <form onSubmit={handleUpdate} className="edit-post-form">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={postData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Author:
          <input
            type="text"
            name="author"
            value={postData.author}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category:
          <input
            type="text"
            name="category"
            value={postData.category}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Content:
          <textarea
            name="content"
            rows="6"
            value={postData.content}
            onChange={handleChange}
          ></textarea>
        </label>

        <button type="submit" className="update-btn">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
