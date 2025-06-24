import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../../css/creator/createPost.css";

const CreatePost = () => {
  const { creatorId } = useParams(); // ✅ Grab creatorId from URL
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedDate: "",
    category: "",
    tags: "",
    content: "",
    media: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media") {
      setFormData({ ...formData, media: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    for (const key in formData) {
      postData.append(key, formData[key]);
    }

    postData.append("creatorId", creatorId); // ✅ Add creatorId to FormData

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: postData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Post created successfully!");
        setFormData({
          title: "",
          author: "",
          publishedDate: "",
          category: "",
          tags: "",
          content: "",
          media: null,
        });
      } else {
        alert(data.message || "Failed to create post.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while creating post.");
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="publishedDate"
          value={formData.publishedDate}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Tech">Tech</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Travel">Travel</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
        />

        <textarea
          name="content"
          placeholder="Write your content here..."
          rows="7"
          value={formData.content}
          onChange={handleChange}
          required
        ></textarea>

        <input
          type="file"
          name="media"
          accept="image/*,video/*"
          onChange={handleChange}
        />

        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
