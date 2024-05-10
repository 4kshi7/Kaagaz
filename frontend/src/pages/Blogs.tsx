import { useRef, useState } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { Loading } from "../components/Loading";
import { formatCommentTime } from "../components/FullBlog";
import Pagination from "../components/Pagination";

export const Blogs = () => {
  const ref = useRef(null);
  const { loading, blogs } = useBlogs();
  const [sortByLatest, setSortByLatest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Change this number to adjust items per page

  const sortedBlogs = [...blogs]; // Create a copy of blogs array to avoid mutation
  if (sortByLatest) {
    sortedBlogs.reverse(); // Reverse the order to show latest posts on top
  }

  // Calculate indexes for pagination
  const totalPages = Math.ceil(sortedBlogs.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="overflow-y-hidden">
      <Appbar />
      {/* Button to toggle sorting order */}
      <div className="flex flex-col">
        {/* <div className="mx-auto mt-10">
          <button
            className="mb-4 bg-black text-white px-4 py-2 rounded-xl shadow-xl"
            onClick={() => setSortByLatest(!sortByLatest)}
          >
            {sortByLatest ? "Show Oldest First" : "Show Latest First"}
          </button>
        </div> */}
        <div className="flex h-fit flex-wrap sm:gap-10  md:gap-10 lg:gap-16  justify-center items-center overflow-hidden">
          {sortedBlogs
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((blog) => (
              <div className="my-6 w-fit flex " key={blog.id}>
                <BlogCard
                  id={blog.id}
                  authorName={blog.author.name || "Anonymous"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={formatCommentTime(blog.publishedDate)}
                  reference={ref}
                />
              </div>
            ))}
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default Blogs;
