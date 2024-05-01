import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const WriteComment = ({ postId }: { postId: number }) => {
  const [commentContent, setCommentContent] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog/${postId}/comments`,
        { content: commentContent },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        // Comment submitted successfully
        console.log("Comment submitted successfully!");
        // Clear the comment input field after submission
        setCommentContent("");
        // Reload the page
        window.location.reload();
      } else {
        console.error("Failed to submit comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentContent(event.target.value);
  };

  return (
    <form className="max-w-2xl bg-white rounded-lg border p-2 mb-10" onSubmit={handleSubmit}>
      <div className="px-3 mb-2 mt-2">
        <textarea
          placeholder="Comment"
          className="w-full bg-gray-100 rounded border border-gray-400 leading-normal resize-none h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
          value={commentContent}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="flex justify-end px-4">
        <input
          type="submit"
          className="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500 cursor-pointer"
          value="Comment"
        />
      </div>
    </form>
  );
};
