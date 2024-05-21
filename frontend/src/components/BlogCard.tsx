import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  imgUrl: string;
}

function calculateReadingTime(content: string): string {
  const wordsPerSecond = 3;
  const wordsCount = content.split(/\s+/).length;
  const readingTimeInSeconds = Math.ceil(wordsCount / wordsPerSecond);

  if (readingTimeInSeconds < 60) {
    return `${readingTimeInSeconds} seconds`;
  } else {
    const readingTimeInMinutes = Math.ceil(readingTimeInSeconds / 60);
    return `${readingTimeInMinutes} minute${
      readingTimeInMinutes > 1 ? "s" : ""
    }`;
  }
}

export const BlogCard: React.FC<BlogCardProps> = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
  imgUrl,
}) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
      whileDrag={{ scale: 1.2 }}
      dragElastic={0.1}
      dragSnapToOrigin={true}
      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl md:w-fit hover:bg-gray-100 p-5 "
    >
      <div className="flex gap-5">
        <div className="w-[18vh] h-[18vh] md:w-[20vh] md:h-[20vh]">
          <img
            className=" object-cover w-full h-full rounded-3xl"
            src={imgUrl}
            alt=""
          />
        </div>
        <div>
          <div className="flex gap-2">
            <div className="flex items-center">
              <Avatar name={authorName} />
            </div>
            <h1 className="flex items-center">{authorName.split(" ")[0]}</h1>
            <h1 className="text-xs font-normal text-zinc-800 flex items-center">
              {publishedDate}
            </h1>
          </div>
          <div className="flex flex-col">
            <Link to={`/blog/${id}`}>
            <div className="text-2xl font-semibold">
              {title.length > 15 ? title.slice(0, 15) + "..." : title}
            </div>
            <div className="text-sm text-zinc-800 tracking-tight w-[38vw] h-[85%]">
              {content.length > 40 ? content.slice(0, 40) + "..." : content}
            </div>
            </Link>
            <div className=" text-black w-full h-10 text-xs font-normal flex justify-between">
              {"Read time " + calculateReadingTime(content)}
              <div className="text-white text-2xl flex items-center justify-center">
                <button>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  if (!name || name.trim() === "") {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-900 rounded-full ${
          size === "small" ? "w-8 h-8" : "w-10 h-10"
        }`}
      >
        <span className="text-lg text-gray-600 dark:text-gray-300">A</span>{" "}
      </div>
    );
  }
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-900 rounded-full ${
        size === "small" ? "w-8 h-8" : "w-10 h-10"
      }`}
    >
      <span
        className={`${
          size === "small" ? "text-md" : "text-lg"
        } font-normal text-gray-900 dark:text-gray-300`}
      >
        {name[0]}
      </span>
    </div>
  );
}
