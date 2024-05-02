import { Link } from "react-router-dom";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
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

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="w-[80vw] p-5 border-slate-200 pb-4 cursor-pointer">
        <div className="flex items-center gap-1">
          <div className="flex justify-center flex-col">
            <Avatar name={authorName} />
          </div>
          <div className="font-normal">{authorName}</div>
          <div className="text-xs font-thin text-slate-500">
            {" "}
            • {publishedDate}
          </div>
        </div>
        <div className="flex font-bold">{title}</div>
        <div className="w-[65vw] md:w-[65vw]">
          {content.split(" ")[0].length > 25
            ? content.split(" ")[0].slice(0, 25) + "..."
            : content}
        </div>
        <div className="text-slate-400 text-xs">
          {"Read time "+calculateReadingTime(content) }
        </div>
      </div>
    </Link>
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
