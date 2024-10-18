import styles from "./post_board.module.css";

function PostPreviews({ posts, onClickPost }) {
  return (
    <div>
      {posts.map((each, index) => (
        <div
          key={index} // Ensure unique keys
          onClick={() => {
            onClickPost(each.id);
          }} // Handle click event
          className={styles.postItem}
        >
          "{each.content}"
          <p></p>
        </div>
      ))}
    </div>
  );
}
export default PostPreviews;
