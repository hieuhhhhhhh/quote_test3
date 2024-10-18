import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./post_modal.module.css";
import update_FontSize_Width from "@/lib/front_end/post/dynamic_fontsize_width";
import PreviewModal from "./preview_post_modal";

const AuthorModal = ({ closeModal, closeAuthorModal, content }) => {
  const [input, setInput] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [width, setWidth] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const username = useSelector((state) => state.myProfile.username);

  const textareaRef = useRef(null);

  const handleInput = (e) => {
    const value = e.target.value;
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    // Limit the height to 170px
    if (textarea.scrollHeight > 170) {
      return; // Don't update the input if it exceeds the limit
    }
    setInput(value);
  };

  useEffect(() => {
    // Call getFontSize when input changes
    update_FontSize_Width(input, setFontSize, setWidth);
  }, [input]); // Ensure effect runs when 'input' changes

  const openPreviewModal = () => {
    if (input.trim() === "") {
      setInput(username);
    }
    setIsModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {!isModalOpen ? (
        <div>
          <label>Author (Optional):</label>
          <div
            className={styles.textareaContainer}
            onClick={() => textareaRef.current.focus()}
          >
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              type="text"
              rows={1}
              placeholder="Write author's name here..."
              value={input}
              onChange={handleInput} // Use the handleInput function
              style={{ fontSize }} // Inline style for dynamic font size
            />
          </div>
          <button onClick={openPreviewModal}>Continue</button>
          <button onClick={closeAuthorModal}>Back</button>
        </div>
      ) : (
        <PreviewModal
          closeModal={closeModal}
          closeAuthorModal={closeAuthorModal}
          closePreviewModal={closePreviewModal}
          content={content}
          author={input}
        />
      )}
    </div>
  );
};

export default AuthorModal;
