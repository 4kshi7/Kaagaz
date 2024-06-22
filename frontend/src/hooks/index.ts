import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface PostType {
  content: string;
  title: string;
  publishedDate: string;
  id: number;
  imgUrl: string;
  author: {
    name: string;
  };
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: Date;
  user: {
    name: string;
  };
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
  user: {
    id: number;
    email: string;
  };
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  posts: PostType[];
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<PostType[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.post);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    blogs,
  };
};

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<PostType>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlog(response.data.post);
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    blog,
  };
};

export interface CommentData {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: string;
  user: {
    email: string;
    name: string;
  };
}

export const useComments = (postId: number) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(
          `https://medium.akshitgaur2003.workers.dev/api/v1/blog/${postId}/comments`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]); // Trigger fetchComments when postId changes

  return { comments, isLoading, isError };
};

export const useLikes = (postId: number) => {
  const [likes, setLikes] = useState<Like[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikes = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/${postId}/likes`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setLikes(response.data);
      } catch (error) {
        console.error("Error fetching likes:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, [postId]); // Trigger fetchLikes when postId changes

  return { likes, isLoading, isError };
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching current user details:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, loading, error };
};