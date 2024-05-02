import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { Loading } from "../components/Loading";
import { formatCommentTime } from "../components/FullBlog";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [sortByLatest, setSortByLatest] = useState(true);

  const sortedBlogs = [...blogs]; // Create a copy of blogs array to avoid mutation
  if (sortByLatest) {
    sortedBlogs.reverse(); // Reverse the order to show latest posts on top
  }

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="px-10 md:px-32 flex justify-center gap-5">
        <div className="sm:max-w-2xl flex flex-col  ">
          {/* Button to toggle sorting order */}
          <div className="mx-auto mt-10">
            <button
              className="mb-4 bg-black text-white px-4 py-2 rounded-xl shadow-xl"
              onClick={() => setSortByLatest(!sortByLatest)}
            >
              {sortByLatest ? "Show Oldest First" : "Show Latest First"}
            </button>
          </div>

          {sortedBlogs.map((blog) => (
            <div
              className=" my-6 hover:scale-[103%] duration-300 shadow-lg"
              key={blog.id}
            >
              <BlogCard
                id={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={formatCommentTime(blog.publishedDate)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
