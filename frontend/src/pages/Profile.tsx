import React from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { formatCommentTime } from "../components/FullBlog";
import { Loading } from "../components/Loading";
import { useCurrentUser } from "../hooks";

export const Profile: React.FC = () => {
  const { user, loading, error } = useCurrentUser();

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-600">
        Error fetching user details.
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Appbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {user && (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-8 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl  font-semibold text-gray-800">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                  <p className="text-gray-600 mt-1">
                    Blogs published :{" "}
                    <span className="font-bold">{user.posts.length}</span>
                  </p>
                </div>
                <div>
                  {user.isAdmin ? (
                    <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm font-medium">
                      Admin
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full text-sm font-medium">
                      User
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Blogs Published
              </h2>
              {user.posts && user.posts.length > 0 ? (
                <div className="space-y-10">
                  {user.posts.map((blog) => (
                    <div key={blog.id} className="my-5 ">
                      <BlogCard
                        id={blog.id}
                        authorName={user.name}
                        title={blog.title}
                        content={blog.content}
                        publishedDate={formatCommentTime(blog.publishedDate)}
                        imgUrl={blog.imgUrl}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No posts available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
