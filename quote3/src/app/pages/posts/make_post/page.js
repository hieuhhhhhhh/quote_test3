"use client";
import React, { useState } from "react";
import PostModal from "./comps/post_modal"; // Import the PostModal component

export default function MakePost() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Render the PostModal component if the modal is open and the make posts button only appears if no the modal is closed */}
      {isModalOpen ? (
        <PostModal closeModal={closeModal} />
      ) : (
        <button onClick={openModal}>Make a new post</button>
      )}
    </div>
  );
}
