import { PostType } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: { blog: PostType }) => {
  const intDateFormat = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-2 max-w-screen-2xl">
          <div className="col-span-8">
            <div className="text-5xl font-semibold">{blog.title}</div>
            <div className="text-slate-500 py-4">{`Posted on ${intDateFormat.format(new Date(blog.publishedDate))}`}</div>
            <div>{blog.content}</div>
          </div>
          <div className="col-span-4">
            <div className="flex flex-col px-10">
              <div className="font-bold text-xl">Author </div>
              <div className="flex item-center">
                <Avatar name={blog.author.name} />
                <div className="font-medium">
                  {blog.author.name || "Anonymous"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
