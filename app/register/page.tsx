"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("opacity-0 scale-95");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setErrorMessage("All fields are required.");
      showModal();
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      router.push("/login");
    } catch (error) {
      setErrorMessage("Registration failed. Email may already be in use.");
      showModal();
    }
  };

  const showModal = () => {
    setModalAnimation("opacity-0 scale-95");
    setModalIsOpen(true);

    setTimeout(() => {
      setModalAnimation("opacity-100 scale-100");
    }, 100);
  };

  const closeModal = () => {
    setModalAnimation("opacity-0 scale-95");
    setTimeout(() => {
      setModalIsOpen(false);
    }, 200);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="block p-2 border border-gray-300 rounded-lg mb-2 w-full"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="block p-2 border border-gray-300 rounded-lg mb-2 w-full"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="block p-2 border border-gray-300 rounded-lg mb-2 w-full"
        />
        <button type="submit" className="bg-green-500 text-white rounded-lg p-2 w-full">
          Sign Up
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">
          Login here
        </a>
      </p>

      {/* Errors Modal */}
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 z-50">
          <div
            className={`bg-white p-6 rounded shadow-lg w-80 text-center transform transition-all duration-300 ${modalAnimation}`}
          >
            <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
            <p className="mb-4">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
