import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./post_modal.module.css";
import update_FontSize_Width from "@/lib/front_end/post/dynamic_fontsize_width";
import addPost from "../helpers/submit_post";

const PreviewModal = ({
  closeModal,
  closeAuthorModal,
  closePreviewModal,
  content,
  author,
}) => {
  //const [input, setInput] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [width, setWidth] = useState("");
  const PREVIEW = content + "\n" + "- " + author;

  useEffect(() => {
    // Call getFontSize when input changes
    update_FontSize_Width(PREVIEW, setFontSize, setWidth);
  }, [PREVIEW]);

  const handlePost = async () => {
    try {
      const res = await addPost(content.trim(), author.trim()); // Await the addPost function
      if (res) {
        // Close all modals
        closePreviewModal();
        closeAuthorModal();
        closeModal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.resultContainer} style={{ width, fontSize }}>
        "{content.trim()}"
        <br />- {author.trim()}
      </div>
      <button onClick={handlePost}>Post</button>
      <button onClick={closePreviewModal}>Back</button>
    </div>
  );
};

export default PreviewModal;
