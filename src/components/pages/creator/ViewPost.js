import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../css/creator/viewPost.css";

const ViewPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="view-post-container">
      <h1>{post.title}</h1>
      <p><strong>Author:</strong> {post.author}</p>
      <p><strong>Category:</strong> {post.category}</p>
      <p><strong>Content:</strong></p>
      <div className="post-content">{post.content}</div>
    </div>
  );
};

export default ViewPost;
