import { useEffect, useState } from "react";
import Appbar from "../components/Appbar";
import TextEditor from "../components/TextEditor";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("You need to be logged in to publish a blog.");
      navigate("/signup");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("You need to be logged in to publish a blog.");
      navigate("/signup");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content: description,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      if (!response) {
        toast.error("Failed to publish the blog.");
      } else {
        toast.success("Blog published successfully.");
        navigate(`/blog/${response.data.id}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Failed to publish the blog: ${
            error.response?.data?.message || error.message
          }`
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder="Title"
          />
          <TextEditor
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <button
            onClick={handleSubmit}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Publish;
