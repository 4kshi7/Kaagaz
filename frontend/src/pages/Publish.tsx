import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { v4 } from "uuid";
import { Loading } from "../components/Loading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    let imageUrl =
      "https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=";

    if (image) {
      const imageRef = ref(storage, `images/${v4()}`);
      try {
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content: description,
          imgUrl: imageUrl,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error posting blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateClick = async () => {
    if (!title) {
      console.log("Please enter a title");
      return;
    }
    setGenerating(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog/gen`,
        { title },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setDescription(response.data.article);
    } catch (error) {
      console.error("Error generating article:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8 p-5">
        <div className="max-w-screen-lg w-full">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Title"
          />

          <div className="flex justify-between mt-2"></div>

          <TextEditor
            onChange={setDescription}
            value={description} // Pass description value to TextEditor
          />

          <button
            onClick={handleClick}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            disabled={loading} // Disable button when loading
          >
            {loading ? "Publishing..." : "Publish post"}
          </button>

          <button
            onClick={handleGenerateClick}
            type="button"
            className="ml-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900 hover:bg-green-800"
            disabled={generating} // Disable button when generating
          >
            {generating ? "Generating..." : "Generate with AI"}
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

export function TextEditor({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "image", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];
  const module = {
    toolbar: toolbarOptions,
  };
  return (
    <div className="mt-2">
      <div className="w-full mb-4 ">
        <div className="flex items-center justify-between border">
          <div className="my-2 bg-white rounded-b-lg w-full">
            <label className="sr-only">Publish post</label>
            <ReactQuill
              modules={module}
              theme="snow"
              value={value}
              onChange={onChange}
              className="focus:outline-none block w-full px-0 text-lg text-gray-800 bg-white border-0 pl-2"
              placeholder="Write an article..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
