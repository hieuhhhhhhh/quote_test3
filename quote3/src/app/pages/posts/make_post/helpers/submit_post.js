async function addPost(content, author) {
  try {
    const res = await fetch("/api/posts/new_post", {
      method: "Post",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ content, author }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const msg = await res.text();
    console.log("Post added successfully:", msg);
    return true;

    //
  } catch (e) {
    console.error("Error(submit_post.js): ", e);
    return false;
  }
}

export default addPost;
