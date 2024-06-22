import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { Loading } from "../components/Loading";
import { formatCommentTime } from "../components/FullBlog";
import Pagination from "../components/Pagination";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [sortByLatest, setSortByLatest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const sortedBlogs = [...blogs];
  if (sortByLatest) {
    sortedBlogs.reverse();
  }

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
      <div className="flex flex-col">
        <div className="mx-auto mt-5 mb-5">
          <button
            className="mb-4 bg-black text-white px-4 py-2 rounded-xl shadow-xl"
            onClick={() => setSortByLatest(!sortByLatest)}
          >
            {sortByLatest ? "Show Oldest First" : "Show Latest First"}
          </button>
        </div>
        <div className="flex h-fit flex-wrap justify-center items-center overflow-hidden  gap-5 md:gap-7 lg:gap-10 px-10">
          {sortedBlogs
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((blog) => (
              <div className="w-fit flex " key={blog.id}>
                <BlogCard
                  id={blog.id}
                  authorName={blog.author.name || "Anonymous"}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={formatCommentTime(blog.publishedDate)}
                  imgUrl={blog.imgUrl}
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
