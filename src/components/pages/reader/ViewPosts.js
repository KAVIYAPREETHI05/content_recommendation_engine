import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../css/reader/viewPost.css';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';


const ViewPosts = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(res.data);
      setComments(res.data.comments || []);
    };
    fetchPost();
  }, [id]);

 const handleLike = async () => {
  setLiked(!liked);
  try {
    await axios.post('http://localhost:5000/api/posts/like', {
      userId: 'loggedInUserId', // replace with actual user ID
      postId: id,
    });
  } catch (err) {
    console.error("Error liking post", err);
  }
};


const handleComment = async () => {
  if (!comment.trim()) return;
  const newComment = {
    text: comment,
    date: new Date().toISOString(),
  };

  try {
    await axios.post('http://localhost:5000/api/posts/comment', {
      userId: 'loggedInUserId',
      postId: id,
      text: comment,
    });

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setComment('');
  } catch (err) {
    console.error("Error commenting", err);
  }
};


  if (!post) return <p>Loading...</p>;

  return (
    <div className="view-post-container">
      <h2>{post.title}</h2>
      <p><strong>Author:</strong> {post.author}</p>
      <p><strong>Category:</strong> {post.category}</p>
      <div className="post-content">{post.content}</div>

      <div className="interactions">
        <button className="like-btn" onClick={handleLike}>
          {liked ? <FaHeart color="red" /> : <FaRegHeart />} Like
        </button>

        <div className="comment-section">
          <textarea
            rows="3"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleComment}><FaComment /> Comment</button>
        </div>

        <div className="comments-list">
          <h4>Comments</h4>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="comment-item">
                <p>{c.text}</p>
                <small>{new Date(c.date).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPosts;
