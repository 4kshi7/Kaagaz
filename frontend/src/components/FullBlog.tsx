import { useState, useEffect } from "react";
import { useComments, CommentData, PostType } from "../hooks";
import { Appbar } from "./Appbar";
import { CommentCard } from "./CommentCard";
import { Avatar, calculateReadingTime } from "./BlogCard";
import { WriteComment } from "./WriteComment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "../quill.css";

export const FullBlog = ({ blog }: { blog: PostType }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const { isLoading, comments: fetchedComments } = useComments(blog.id);

  useEffect(() => {
    if (!isLoading) {
      setComments(fetchedComments);
    }
  }, [isLoading, fetchedComments]);

  return (
    <>
      <Appbar />
      <div className="flex flex-col justify-center items-center p-4 md:px-10">
        <div className="p-4  max-w-5xl">
          <div className="text-3xl font-semibold py-4 line-clamp-4">
            {blog?.title}
          </div>
          <div className="flex gap-2">
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
          <div className="w-full">
            <div className="text-xl font-bold ">Comments</div>
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

{
  /* Render comment cards */
}
{
  /* <div className="w-[85vw]">
<div className="mt-10 text-xl font-bold ">Comments</div>
<WriteComment postId={blog.id} />
{comments &&
  comments.map((comment) => (
    <div className="mb-5">
      <CommentCard
        key={comment.id}
        authorName={comment.user.email}
        content={comment.content}
        createdAt={formatCommentTime(
          comment.createdAt.toString()
        )}
      />
    </div>
  ))}
</div> */
}

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
