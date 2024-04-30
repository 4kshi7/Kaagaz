import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [sortByLatest, setSortByLatest] = useState(true);

  const sortedBlogs = [...blogs]; // Create a copy of blogs array to avoid mutation
  if (sortByLatest) {
    sortedBlogs.reverse(); // Reverse the order to show latest posts on top
  }

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <Appbar />
      <div className="px-10 md:px-32 flex justify-center gap-5">
        <div className="sm:max-w-2xl ">
          {/* Button to toggle sorting order */}

          {sortedBlogs.map((blog) => (
            <div
              className=" my-9 hover:scale-[103%] duration-300 shadow-lg"
              key={blog.id}
            >
              <BlogCard
                id={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={formatDate(blog.publishedDate)}
              />
            </div>
          ))}
        </div>

        {/* <div className="px-10  w-full bg-red-50">
          <button
            className="mb-4 bg-gray-800 text-white px-4 py-2 rounded-md"
            onClick={() => setSortByLatest(!sortByLatest)}
          >
            {sortByLatest ? "Show Oldest First" : "Show Latest First"}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Blogs;
