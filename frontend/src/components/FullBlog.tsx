import { useState, useEffect } from "react";
import { useComments, CommentData, PostType } from "../hooks";
import { Appbar } from "./Appbar";
import { CommentCard } from "./CommentCard";
import { Avatar, calculateReadingTime } from "./BlogCard";
import { WriteComment } from "./WriteComment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "../quill.css";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const FullBlog = ({ blog }: { blog: PostType }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentData[]>([]);
  const { isLoading, comments: fetchedComments } = useComments(blog.id);

  useEffect(() => {
    if (!isLoading) {
      setComments(fetchedComments);
    }
  }, [isLoading, fetchedComments]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/v1/blog/${blog.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status !== 200) {
        console.log(response.data);
        return;
      }

      toast.success("Blog post deleted successfully");
      navigate("/blogs");
      setLoading(false);
    } catch (error) {
      toast.error("Not authorized to delete blog post");
      setLoading(false);
    }
  };

  return (
    <>
      <Appbar />
      <div className="flex flex-col justify-center items-center p-4 md:px-10">
        <div className="max-w-[680px] md:max-w-4xl">
          <div className="text-xl md:text-4xl  font-semibold p-4 flex items-center justify-between">
            {blog?.title}{" "}
            <button onClick={handleDelete}>
              {loading ? (
                <Spinner />
              ) : (
                <MdDelete className="h-6 w-6 text-red-600" />
              )}
            </button>
          </div>
          <div className="flex gap-2 p-4">
            <Avatar name={blog.author.name} />
            <h1>{blog.author.name || "Anonymous"}</h1>
            <h1>{formatCommentTime(blog.publishedDate)}</h1>
            <h1 className="font-light">{`${calculateReadingTime(
              blog.content
            )} read`}</h1>
          </div>
          <div className="md:h-[50vh] w-full flex justify-center my-4">
            <img
              src={blog.imgUrl}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <div className="">
            <ReactQuill
              value={blog.content}
              readOnly={true}
              theme={"bubble"}
              className="custom-quill"
            />
          </div>
          <div className="w-full px-4">
            <div className="text-xl font-semibold">Comments</div>
            <WriteComment postId={blog.id} />
            {comments &&
              comments.map((comment) => (
                <div className="mb-5">
                  <CommentCard
                    key={comment.id}
                    authorName={comment.user.name}
                    content={comment.content}
                    createdAt={formatCommentTime(comment.createdAt.toString())}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export function formatCommentTime(timestamp: string): string {
  const commentDate = new Date(timestamp);
  const now = new Date();

  const diffInMs = now.getTime() - commentDate.getTime();
  const diffInMinutes = diffInMs / (1000 * 60);
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutesAgo = Math.floor(diffInMinutes);
    return minutesAgo === 1
      ? `${minutesAgo} minute ago`
      : `${minutesAgo} minutes ago`;
  } else if (diffInHours < 24) {
    const hoursAgo = Math.floor(diffInHours);
    return hoursAgo === 1 ? `${hoursAgo} hour ago` : `${hoursAgo} hours ago`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return commentDate.toLocaleDateString("en-US", options);
  }
}

export function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="w-6 h-6 animate-spin mx-auto"
      viewBox="0 0 16 16"
    >
      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
      <path
        fillRule="evenodd"
        d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
      />
    </svg>
  );
}
