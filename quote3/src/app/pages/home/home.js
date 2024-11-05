"use client";
import { useState, useEffect } from "react";
import fetchPreviews from "@/lib/front_end/post/fetch_previews";
import PostsBoard from "@/components/posts/posts_board";
import { useSelector } from "react-redux";
import CreatePost from "./comps/create_post/parent";

const Home = () => {
  const [postIds, setPostIds] = useState([]); // Array of pure IDs
  const [previews, setPreviews] = useState([]);
  const [index, setIndex] = useState(0);
  const loadSize = 50;

  const isCreatingPost = useSelector(
    (state) => state.userActions.isCreatingPost
  );

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
      {isCreatingPost && <CreatePost></CreatePost>}
      <PostsBoard posts={previews} onLoadMorePosts={onLoadMorePosts} />
    </div>
  );
};

export default Home;

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