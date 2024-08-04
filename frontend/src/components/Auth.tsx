import { Link, useNavigate } from "react-router-dom";
import LabelledInput from "./LabelledInput";
import { useState } from "react";
import { SignupInput } from "@ayush272002/medium-common-v3";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  function validateInputs() {
    if (
      type === "signup" &&
      (!postInputs.name || !postInputs.email || !postInputs.password)
    ) {
      toast.error("Please fill all the fields for signup.");
      return false;
    }
    if (type === "signin" && (!postInputs.email || !postInputs.password)) {
      toast.error("Please fill all the fields for signin.");
      return false;
    }
    return true;
  }

  async function sendRequest() {
    if (!validateInputs()) return;
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = res.data.jwt;
      localStorage.setItem("jwt", JSON.stringify(jwt));
      toast.success(`${type === "signup" ? "Signup" : "Signin"} successful!`);
      navigate("/blogs");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMsg = err.response.data.error || "An error occurred";
        toast.error(errorMsg);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">
              {type === "signin" ? "Sign In" : "Create an Account"}
            </div>
            <div className="text-slate-400">
              {type === "signin"
                ? "Don't have an Account?"
                : "Already have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>

          <div className="pt-4">
            {type === "signup" && (
              <LabelledInput
                label="Name"
                placeholder="Enter your name"
                onChange={(e) => {
                  setPostInputs((c) => ({ ...c, name: e.target.value }));
                }}
              />
            )}

            <LabelledInput
              label="Email"
              placeholder="Enter your email"
              onChange={(e) => {
                setPostInputs((c) => ({ ...c, email: e.target.value }));
              }}
            />

            <LabelledInput
              label="Password"
              placeholder="Enter your Password"
              type={"password"}
              onChange={(e) => {
                setPostInputs((c) => ({ ...c, password: e.target.value }));
              }}
            />

            <button
              onClick={sendRequest}
              type="button"
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type === "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
