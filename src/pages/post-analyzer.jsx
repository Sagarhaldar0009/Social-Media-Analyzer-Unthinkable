import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '../components/Spinner'; // Import Spinner component
import Link from 'next/link'; // Import Link for navigation
import Image from 'next/image'; // Import Image component from Next.js

const PostAnalyzer = () => {
  const [postData, setPostData] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  const router = useRouter();
  const { postId, likes, content } = router.query;

  const fetchAllPosts = async () => {
    try {
      const response = await fetch(`https://dummyapi.io/data/v1/post?limit=30`, {
        headers: {
          "app-id": "63cada995bc52b0fecc614e9",
        },
      });
      const data = await response.json();
      setAllPosts(data.data);
    } catch (err) {
      setError("Failed to fetch posts for analysis");
    } finally {
      setLoading(false); 
    }
  };

  const analyzePost = () => {
    if (!likes || !allPosts) return;
    // Compare like count of the current post with others
    const higherLikedPosts = allPosts.filter(post => post.likes > likes);
    setAnalysisResult({
      totalPosts: allPosts.length,
      postsWithHigherLikes: higherLikedPosts.length,
      postLikeCount: likes,
    });
  };

  useEffect(() => {
    if (postId && content) {
      setPostData({
        id: postId,
        text: content,
        likeCount: likes,
      });
    }
    fetchAllPosts();
  }, [postId, likes, content]);

  useEffect(() => {
    if (postData) {
      analyzePost();
    }
  }, [postData, allPosts]);

  if (loading) {
    return <Spinner />; 
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Post Analysis</h1>

        {/* Error Handling */}
        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Post Details */}
        {postData && (
          <div className="mb-6 text-center">
            <Image
              src={postData.image} 
              alt={postData.text}
              width={500}  
              height={300} 
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{postData.text}</h2>
            <p className="text-sm text-gray-500">Post ID: {postData.id}</p>
            <p className="text-sm text-gray-600 mt-2">Likes: {postData.likeCount}</p>
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Result:</h3>
            <p>Total Posts Analyzed: {analysisResult.totalPosts}</p>
            <p>Posts with Higher Likes: {analysisResult.postsWithHigherLikes}</p>
            <p>Your Post Likes: {analysisResult.postLikeCount}</p>
          </div>
        )}

        {/* Button to Navigate to HomePage */}
        <div className="mt-6 text-center">
          <Link href="/" className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition duration-200">
              Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostAnalyzer;