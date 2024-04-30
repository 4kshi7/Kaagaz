import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/blog/:id" element={<Blog/>} />
          <Route path="/blogs" element={<Blogs/>} />
          <Route path="/publish" element={<Publish/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
