"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("opacity-0 scale-95");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and Password are required.");
      showModal();
      return;
    }

    try {
      await login(email, password);
      router.push("/");
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
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
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="block p-2 border border-gray-300 rounded-lg mb-2 w-full"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block p-2 border border-gray-300 rounded-lg mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 w-full">
          Login
        </button>
      </form>

      <p className="mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-green-500">
          Sign up here
        </a>
      </p>

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
