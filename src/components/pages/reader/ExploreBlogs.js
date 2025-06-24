import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import '../../../css/reader/exploreBlogs.css';

const ExploreBlogs = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [userActions, setUserActions] = useState({ likedPosts: [], commentedPosts: [] });


  const userId = '123'; // Replace with actual userId from auth/session

useEffect(() => {
  const fetchPosts = async () => {
    const postsRes = await axios.get('http://localhost:5000/api/posts/explore');
    setPosts(postsRes.data);

    const actionsRes = await axios.get(`http://localhost:5000/api/posts/user-actions/loggedInUserId`);
    setUserActions(actionsRes.data); // contains likedPosts & commentedPosts
  };
  fetchPosts();
}, []);
const fetchUserActions = async () => {
  const res = await axios.get(`http://localhost:5000/api/posts/user-actions/${userId}`);
  setUserActions(res.data);
};



  const authors = [...new Set(posts.map(post => post.author))];
  const titles = [...new Set(posts.map(post => post.title))];
  const categories = [...new Set(posts.map(post => post.category))];

  const filtered = posts.filter(post => {
    const matchesKeyword =
      post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.author.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.category.toLowerCase().includes(searchKeyword.toLowerCase());

    const matchesAuthor = selectedAuthor ? post.author === selectedAuthor : true;
    const matchesTitle = selectedTitle ? post.title === selectedTitle : true;
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;

    return matchesKeyword && matchesAuthor && matchesTitle && matchesCategory;
  });

  const trending = [...filtered].sort((a, b) => b.views - a.views).slice(0, 5);
  const recommended = [...filtered].sort((a, b) => b.searchCount - a.searchCount).slice(0, 5);
  const other = filtered.filter(post => !trending.includes(post) && !recommended.includes(post));

  const toggleLike = async (postId) => {
    const alreadyLiked = likedPosts.includes(postId);

    if (alreadyLiked) {
      await axios.post(`/api/posts/unlike/${postId}`, { userId });
      setLikedPosts(prev => prev.filter(id => id !== postId));
    } else {
      await axios.post(`/api/posts/like/${postId}`, { userId });
      setLikedPosts(prev => [...prev, postId]);
    }
  };

  const renderPosts = (list) =>
    list.map((post) => (
      <div key={post._id} className="blog-card">
        <h3>{post.title}</h3>
        <p><strong>Author:</strong> {post.author}</p>
        <p><strong>Category:</strong> {post.category}</p>
         
    <div className="post-footer">
        <button
          className="view-btn"
          onClick={() => window.location.href = `/reader/view-post/${post._id}`}
        >
          Read More
        </button>
         <div className="post-icons">
      {userActions.likedPosts.includes(post._id) && <FaHeart color="red" title="You liked this post" />}
      {userActions.commentedPosts.includes(post._id) && <FaComment title="You commented on this post" />}
    </div>
        </div>

  
      </div>
    ));

  return (
    <div className="explore-container">
      <h2>Explore Blogs</h2>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search by keyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="search-input"
        />
        <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)} className="search-select">
          <option value="">All Authors</option>
          {authors.map((author, idx) => <option key={idx} value={author}>{author}</option>)}
        </select>
        <select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)} className="search-select">
          <option value="">All Titles</option>
          {titles.map((title, idx) => <option key={idx} value={title}>{title}</option>)}
        </select>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="search-select">
          <option value="">All Categories</option>
          {categories.map((category, idx) => <option key={idx} value={category}>{category}</option>)}
        </select>
      </div>

      <div className="section">
        <h3>Recommended for You</h3>
        <div className="blog-list">{renderPosts(recommended)}</div>
      </div>

      <div className="section">
        <h3>Trending Blogs</h3>
        <div className="blog-list">{renderPosts(trending)}</div>
      </div>

      <div className="section">
        <h3>Others</h3>
        <div className="blog-list">{renderPosts(other)}</div>
      </div>
    </div>
  );
};

export default ExploreBlogs;
