import { useParams } from "react-router-dom";
import { PostType, useBlog } from "../hooks"
import { FullBlog } from "../components/FullBlog";
import { Loading } from "../components/Loading";


const Blog = () => {
  const { id } = useParams()
  const {loading,blog} = useBlog({
    id: id || "",
  });

  if(loading){
    return <div>
      <Loading/>
    </div>
  }
  return (
    <div>
      {blog && <FullBlog blog={blog as PostType} />}
    </div>
  )
}

export default Blog