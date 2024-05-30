import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  imgUrl: string;
}

export function calculateReadingTime(content: string): string {
  const wordsPerSecond = 3;
  const wordsCount = content.split(/\s+/).length;
  const readingTimeInSeconds = Math.ceil(wordsCount / wordsPerSecond);

  if (readingTimeInSeconds < 60) {
    return `${readingTimeInSeconds} sec`;
  } else {
    const readingTimeInMinutes = Math.ceil(readingTimeInSeconds / 60);
    return `${readingTimeInMinutes} min${
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
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let titleSliceLength = 20;
  let contentSliceLength = 40;

  if (screenSize >= 641 && screenSize <= 1024) {
    titleSliceLength = 40;
    contentSliceLength = 75;
  } else if (screenSize > 1024) {
    titleSliceLength = 45;
    contentSliceLength = 170;
  }
  const quillContent = getPlainTextFromHTML(content).split(" ").slice(0, 20).join(" ") + "...";

  return (
    <div className="flex flex-col items-center bg-white  rounded-lg shadow hover:bg-gray-100 w-full ">
      <div className=" flex gap-2 justify-between ">
        <div className=" flex flex-col justify-between">
          <div className="flex gap-2">
            <div className="flex items-center">
              <Avatar name={authorName} />
            </div>
            <h1 className="flex items-center">{authorName.split(" ")[0]}</h1>
            <h1 className="text-xs font-normal text-zinc-800 flex items-center">
              {publishedDate}
            </h1>
          </div>
          <div className="flex flex-col justify-between h-full w-[60vw] lg:w-[40vw]">
            <Link to={`/blog/${id}`}>
              <div className="text-lg md:text-2xl font-semibold">
                {title.length > titleSliceLength
                  ? title.slice(0, titleSliceLength) + "..."
                  : title}
              </div>
              <div className="text-sm text-zinc-800 tracking-tight w-[38vw] h-[85%]">
                {quillContent.split(" ")[0].length > 25
                  ? quillContent.split(" ")[0].slice(0, 10) + "..."
                  : quillContent.slice(0, contentSliceLength)}
              </div>
            </Link>
            <div className="text-black w-full text-xs font-normal flex justify-between">
              {calculateReadingTime(content)+" read"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <img
            className="w-[18vw] h-[18vw] lg:w-[9vw] lg:h-[9vw] md:w-[10vw] md:h-[10vw] object-cover rounded-xl"
            src={imgUrl}
            alt=""
          />
        </div>
      </div>
    </div>
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
          size === "small" ? "w-6 h-6" : "w-10 h-10"
        }`}
      >
        <span className="text-lg text-gray-600 dark:text-gray-300">A</span>{" "}
      </div>
    );
  }
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-900 rounded-full ${
        size === "small" ? "w-6 h-6" : "w-10 h-10"
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

export const getPlainTextFromHTML = (html: string): string => {
  return html.replace(
    /<(\w+)\s*[^>]*>|<\/(\w+)\s*>|<(\w+)\s*\/>/gi,
    function (match, p1, p2) {
      if (p2 === p1 && p2 !== "br") {
        return match.startsWith("</") ? " " : "";
      } else {
        return match.startsWith("</") ? " " : p1 === "br" ? "" : "";
      }
    }
  );
}