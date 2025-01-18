import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Spinner from './Spinner'; // Import the Spinner component

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchPostsData = async () => {
    try {
      const response = await fetch(`https://dummyapi.io/data/v1/post?limit=30`, {
        headers: {
          "app-id": "63cada995bc52b0fecc614e9",
        },
      });
      const data = await response.json();
      setPosts(data.data); // Assuming the response has a `data` key containing posts
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false); // Hide the spinner once data is fetched
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  if (loading) {
    return <Spinner />; // Display the spinner while loading
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Explore Social Media Posts
      </h1>

      {/* Error handling */}
      {error && (
        <div className="text-red-500 bg-red-100 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={post.image}
              alt={post.text}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {post.text || "No description available"}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                By: {post.owner.firstName} {post.owner.lastName}
              </p>
              <p className="text-sm text-gray-600 mt-2">Likes: {post.likes}</p>
              <Link
                href={{
                  pathname: "/post-analyzer",
                  query: { postId: post.id, likes: post.likes, content: post.text },
                }}
                className="mt-4 inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition duration-200"
              >
                Analyze Post
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;