import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import CreatorDashboard from '../src/components/pages/creator/CreatorDashboard';
import ReaderDashboard from '../src/components/pages/reader/ReaderDashboard';
import CreatePost from './components/pages/creator/CreatePost';
import ManagePosts from './components/pages/creator/ManagePosts';
import EditPost from './components/pages/creator/EditPost';
import ViewPost from './components/pages/creator/ViewPost';
import EngagementAnalytics from './components/pages/creator/EngagementAnalytics';
import ExploreBlogs from './components/pages/reader/ExploreBlogs';
import ViewPosts from './components/pages/reader/ViewPosts';
import AISuggestions from './components/pages/creator/AISuggestions';
import ReaderAnalytics from './components/pages/reader/ReaderAnalytics';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(res => setMessage(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Router>
            

        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/creator/:creatorId/dashboard" element={<CreatorDashboard />} />
          
          <Route path="/creator/:creatorId/create-post" element={<CreatePost />} />
          <Route path="/creator/:creatorId/manage-posts" element={<ManagePosts />} />
          <Route path="/creator/:creatorId/edit-post/:postId" element={<EditPost />} />
          <Route path="/creator/:creatorId/view-post/:postId" element={<ViewPost />} />
          <Route path="/creator/:creatorId/analytics" element={<EngagementAnalytics />} />
          <Route path="/creator/:creatorId/suggestions" element={<AISuggestions />} />
          
          <Route path="/reader/:readerId/analytics" element={<ReaderAnalytics />} />
          <Route path="/reader/:readerID/dashboard" element={<ReaderDashboard />} />
          <Route path="/reader/:readerId/explore" element={<ExploreBlogs />} />
          <Route path="/reader/view-post/:id" element={<ViewPosts />} />    
        
        </Routes>
     
    </Router>
  );
}

export default App;
