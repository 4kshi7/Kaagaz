import React from "react";
import { FcNext, FcPrevious } from "react-icons/fc";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate,
}) => {
  return (
    <div className="flex justify-center items-center my-10">
      {/* Previous Button */}
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 px-3 py-1 border"
      >
        <div className="text-xl">
            <FcPrevious/>
        </div>
      </button>

      {/* Pagination Buttons */}
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const page = currentPage - 2 + i;
        return page > 0 && page <= totalPages ? (
          <button
            key={i}
            onClick={() => paginate(page)}
            className={`mx-1 px-3 py-1 border ${
              currentPage === page ? "bg-gray-300" : ""
            }`}
          >
            {page}
          </button>
        ) : null;
      })}

      {/* Next Button */}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 px-3 py-1 border"
      >
        <div className="text-xl">
          <FcNext />
        </div>
      </button>
    </div>
  );
};

export default Pagination;
