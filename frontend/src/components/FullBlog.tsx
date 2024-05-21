import { useState, useEffect } from "react";
import { useComments, CommentData, PostType } from "../hooks";
import { Appbar } from "./Appbar";
import { CommentCard } from "./CommentCard";
import { Avatar } from "./BlogCard";
import { WriteComment } from "./WriteComment";

export const FullBlog = ({ blog }: { blog: PostType }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const { isLoading, comments: fetchedComments } = useComments(blog.id);

  useEffect(() => {
    if (!isLoading) {
      setComments(fetchedComments);
    }
  }, [isLoading, fetchedComments]);

  console.log(blog.imgUrl)

  return (
    <div>
      <Appbar />
      <div className="flex  px-10 justify-center">
        <div className="flex w-full mt-5">
          <div className="">
            <div className="flex bg-red-300 items-center">
              <div className="font-bold text-xl"></div>
            </div>
            <div className="text-5xl font-semibold">{blog.title}</div>

            <div className="text-xl">{blog.content}</div>

            <div className="text-slate-500 py-4">
              <div className="flex item-center gap-2">
                <Avatar size="small" name={blog.author.name} />
                <div className="text-xl font-normal flex items-center">
                  {blog.author.name || "Anonymous"}
                </div>
              </div>
              {`Posted on ${formatCommentTime(blog.publishedDate.toString())}`}
            </div>
            <div className=" w-[50vw] h-[80vh]">
              <img
                src={blog.imgUrl}
                alt=""
                className=" object-cover w-full h-full rounded-3xl"
              />
            </div>

            {/* Render comment cards */}
            <div className="w-[85vw]">
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
            </div>
          </div>
        </div>
      </div>
    </div>
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
