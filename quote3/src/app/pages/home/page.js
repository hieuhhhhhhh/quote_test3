"use client";
import { useState, useEffect } from "react";
import fetchPreviews from "@/lib/front_end/post/fetch_previews";
import PostsBoard from "@/components/posts/posts_board";

// Fetch post IDs
const fetchIds = async () => {
  const response = await fetch("/api/posts/shuffled_latest_ids"); // Replace with your actual API endpoint
  const data = await response.json();

  if (!response.ok) {
    console.error(data.error || "Something went wrong");
  } else {
    return data.map((post) => post.id);
  }
};

const Home = () => {
  const [postIds, setPostIds] = useState([]); // Array of pure IDs
  const [previews, setPreviews] = useState([]);
  const [index, setIndex] = useState(0);
  const loadSize = 50;

  useEffect(() => {
    // Fetch new post IDs and reset index if index reaches the max
    const checkAndFetch = async () => {
      if (index >= postIds.length || postIds.length <= 0) {
        const res = await fetchIds();
        setPostIds(res);
        setIndex(0); // Reset index to 0
      }
    };
    checkAndFetch();
  }, [index, postIds.length]); // Re-run if `index` or `postIds.length` changes

  const onLoadMorePosts = async () => {
    if (index < postIds.length) {
      // Fetch the previews using postIds directly (since it's now pure IDs)
      const res = await fetchPreviews(postIds.slice(index, index + loadSize));

      setPreviews((prev) => [...prev, ...res]);
      setIndex(index + loadSize); // Increase index by loadSize
    }
  };

  return (
    <div>
      <PostsBoard posts={previews} onLoadMorePosts={onLoadMorePosts} />
    </div>
  );
};

export default Home;
