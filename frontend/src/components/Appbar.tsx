import { Link, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { IoIosLogOut } from "react-icons/io";
import {toast} from "react-toastify";

const Appbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/signin");
  }

  return (
    <div className="border-b flex justify-between px-10 py-4">
      <Link
        to={"/blogs"}
        className="flex items-center cursor-pointer"
      >
        Medium
      </Link>
      <div className="flex items-center">
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5"
          >
            New
          </button>
        </Link>
        <Avatar name={"Ayush"} size="big" />
        <div className="ml-4 cursor-pointer flex items-center" onClick={handleLogout}>
          <IoIosLogOut size={24} />
        </div>
      </div>
    </div>
  );
};

export default Appbar;
