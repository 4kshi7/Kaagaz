interface CommentCardProps {
  id?: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export const CommentCard = ({
  // id,
  authorName,
  content,
  createdAt,
}: CommentCardProps) => {
  return (
    <div className="border-b w-full border-slate-200 pb-4">
      <div className="flex items-center gap-1">
        <div className="flex justify-center flex-col">
          <Avatar size="small"  name={authorName} />
        </div>
        <div className="font-semibold text-sm">{authorName}</div>
        <div className="text-xs font-normal text-slate-500"> • {createdAt}</div>
      </div>
      <div className="">{content}</div>
    </div>
  );
};

function Avatar({
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
          size === "small" ? "w-5 h-5" : "w-10 h-10"
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
