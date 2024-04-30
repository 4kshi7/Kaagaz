import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface PostType{
    "content": string,
    "title": string,
    "publishedDate" : string,
    "id": number,
    "author": {
        "name": string
    }
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<PostType[]>([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
        headers:{
            Authorization: localStorage.getItem('token')
        }
    }).then((response) => {
      setBlogs(response.data.post);
      setLoading(false);
    });
  }, []);

  return {
    loading,
    blogs,
  };
};


export const useBlog = ( { id } : { id:string } ) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<PostType>();
  
    useEffect(() => {
      axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
          headers:{
              Authorization: localStorage.getItem('token')
          }
      }).then((response) => {
        setBlog(response.data.post);
        setLoading(false);
      });
    }, [id]);
  
    return {
      loading,
      blog,
    };
  };