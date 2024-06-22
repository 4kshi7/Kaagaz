import { Link, useNavigate } from "react-router-dom";
import { HiOutlinePencilSquare } from "react-icons/hi2";
// import { Avatar } from "./BlogCard";
import { useState } from "react";

export const Appbar = () => {
  const [session, setSession] = useState(
    localStorage.getItem("token") !== null
  );
  const navigate = useNavigate();

  function signoutHandler() {
    localStorage.removeItem("token");
    setSession(false);
    navigate("/signin");
  }

  return (
    <div className="border-b flex justify-between items-center px-10 py-4">
      <button
        onClick={() => (session ? navigate("/blogs") : navigate("/signup"))}
      >
        <div className="cursor-pointer text-xl hover:scale-[110%] duration-100">
          Kaagaz✏️
        </div>
      </button>
      <div className="flex justify-center items-center gap-3">
        {session ? (
          <>
            <button
              type="button"
              onClick={signoutHandler}
              className="py-2 px-3 flex items-center gap-2 text-slate-600 hover:text-black hover:scale-[110%] duration-100"
            >
              Logout
            </button>
            <div>
              <Link to={`/publish`}>
                <button
                  type="button"
                  className="py-2 px-3 flex items-center gap-2 text-slate-600 hover:text-black hover:scale-[110%] duration-100"
                >
                  <div className="text-xl">
                    <HiOutlinePencilSquare />
                  </div>
                  Write
                </button>
              </Link>
            </div>
          </>
        ) : (
          <Link to={"/signin"}>
            <button
              type="button"
              className="py-2 px-3 flex items-center gap-2 text-slate-700 hover:text-black"
            >
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
