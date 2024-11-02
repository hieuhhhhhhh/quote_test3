"use client";
import { useState } from "react";
import fetchPreviews from "@/lib/front_end/post/fetch_previews";
import PostsBoard from "@/components/posts/posts_board";

export default function Search() {
  const [term, setTerm] = useState("");
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [idCount, setIdCount] = useState(-1);
  const [onShrink, setOnShrink] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setPreviews([]);
      setLoading(true); // Start loading

      const res = await fetch("/api/posts/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ term }),
      });

      const { ids } = await res.json();
      setIdCount(ids.length);

      if (!res.ok) {
        console.error("Error (search):", data.error);
        setLoading(false); // Stop loading
        return; // Exit
      }

      const previews = await fetchPreviews(ids);
      setPreviews(previews);
    } catch (err) {
      console.error("Error (search):", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <div className={onShrink ? "shrinkForDetails" : ""}>
        <form onSubmit={submit}>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search Posts"
            required
          />
          <button type="submit">Search</button>
        </form>
        <br />
        {loading && <p>Loading...</p>} {/* Loading status */}
        {idCount >= 0 && !loading && <h2>Found {idCount} posts</h2>}{" "}
      </div>
      <PostsBoard posts={previews} onShrink={setOnShrink} />
    </div>
  );
}