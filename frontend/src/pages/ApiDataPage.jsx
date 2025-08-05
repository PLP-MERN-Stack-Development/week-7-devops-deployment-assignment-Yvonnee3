// src/pages/ApiDataPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const ApiDataPage = () => {
  const [posts, setPosts] = useState([]); // Stores all fetched posts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page for pagination
  const [hasMore, setHasMore] = useState(true); // Indicates if more data can be loaded
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredPosts, setFilteredPosts] = useState([]); // Posts filtered by search term

  // useCallback to memoize the fetch function and prevent unnecessary re-creations
  const fetchPosts = useCallback(async (pageNumber) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // JSONPlaceholder provides 100 posts, limit to 10 per page
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNumber}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setPosts((prevPosts) => {
          // Filter out duplicates if any (e.g., if a previous fetch partially succeeded)
          const newPosts = data.filter(
            (newItem) => !prevPosts.some((existingItem) => existingItem.id === newItem.id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // useEffect to trigger data fetching when page changes or on initial mount
  useEffect(() => {
    // Only fetch if there's potentially more data
    if (hasMore) {
      fetchPosts(page);
    }
  }, [page, hasMore, fetchPosts]);

  // useEffect to filter posts whenever search term or original posts change
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercasedFilter) ||
        post.body.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]); // Re-filter when search term or posts array changes

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to load next set of data
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">API Data from JSONPlaceholder</h1>

      <Card className="w-full max-w-2xl mb-8">
        <input
          type="text"
          placeholder="Search posts by title or body..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </Card>

      {/* Loading and Error States */}
      {loading && page === 1 && <p className="text-center text-lg text-blue-600 dark:text-blue-400">Loading initial data...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id} className="transform transition-transform hover:scale-105 duration-300">
              <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{post.body}</p>
            </Card>
          ))
        ) : (
          !loading && !error && (
            <p className="text-center col-span-full text-gray-500 dark:text-gray-400 py-8">
              {posts.length === 0 ? "No posts fetched yet." : "No matching posts found for your search."}
            </p>
          )
        )}
      </div>

      {/* Load More Button / Infinite Scrolling Indicator */}
      {loading && page > 1 && <p className="text-center text-lg mt-4 text-blue-600 dark:text-blue-400">Loading more...</p>}
      {!loading && hasMore && filteredPosts.length > 0 && (
        <div className="mt-8">
          <Button onClick={handleLoadMore} variant="primary">
            Load More Posts
          </Button>
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">All posts loaded.</p>
      )}
    </div>
  );
};

export default ApiDataPage;