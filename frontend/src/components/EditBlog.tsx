import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { v4 } from "uuid";
import { Loading } from "../components/Loading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../quill.css";
import { z } from "zod";
import { toast } from "react-toastify";
import { useBlog, useCurrentUser } from "../hooks/index";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];

const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE, "File size must be less than 2MB"),
  type: z.string().refine(
    (type) => {
      const extension = type.split("/").pop();
      return (
        typeof extension === "string" && ALLOWED_EXTENSIONS.includes(extension)
      );
    },
    {
      message: "File type must be one of jpg, jpeg, or png",
    }
  ),
});

export const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const { blog, loading: blogLoading } = useBlog({ id: id || "" });
  const { user, loading: userLoading } = useCurrentUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
    }
  }, [blog]);

  useEffect(() => {
    if (!blogLoading && !userLoading && blog && user) {
      if (user.name !== blog.author.name) {
        toast.error("You are not authorized to edit this post");
        navigate(`/blog/${id}`);
      }
    }
  }, [blog, user, blogLoading, userLoading, id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    if (!blog) return;

    setLoading(true);
    let imageUrl = blog.imgUrl;

    if (image) {
      const validationResult = fileSchema.safeParse(image);
      if (!validationResult.success) {
        if (validationResult.error.errors.length > 1) {
          toast.error(validationResult.error.errors[0].message);
          toast.error(validationResult.error.errors[1].message);
        } else {
          toast.error(validationResult.error.errors[0].message);
        }
        setLoading(false);
        return;
      }

      const imageRef = ref(storage, `images/${v4()}`);
      try {
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/blog`,
        {
          id: Number(id),
          title,
          content,
          imgUrl: imageUrl,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      navigate(`/blog/${id}`);
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (blogLoading || userLoading) {
    return <Loading />;
  }

  if (!blog || !user || user.name !== blog.author.name) {
    return null; // Or you could render an "Unauthorized" message
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8 p-5">
        <div className="max-w-screen-lg w-full">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Title"
          />

          <ReactQuill
            className="custom-quill"
            onChange={setContent}
            value={content}
          />

          <button
            onClick={handleUpdate}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update post"}
          </button>

          <input className="ml-4" type="file" onChange={handleImageChange} />

          {loading && (
            <div className="mt-4 flex justify-center">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// TextEditor component remains the same as in your original code
