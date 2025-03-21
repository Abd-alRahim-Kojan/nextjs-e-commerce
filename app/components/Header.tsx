"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false); // Close menu on logout
    router.push("/login");
  };

  return (
    <div className="container mx-auto relative">
      {/* Navbar */}
      <nav className="p-4 flex justify-between items-center bg-white">
        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center">
            <img src="/globe.svg" alt="logo" className="h-8 w-8 mr-2" />
            <h2 className="text-gray-600 font-bold">E-commerce</h2>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-6">
          <Link className="text-gray-600 hover:text-gray-800" href="/">
            Home
          </Link>
          <Link className="text-gray-600 hover:text-gray-800" href="/cart">
            Cart
          </Link>
          <Link className="text-gray-600 hover:text-gray-800" href="/checkout">
            Checkout
          </Link>
        </div>

        {/* Desktop Login/Logout */}
        <div className="hidden sm:block">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-gray-600 text-2xl focus:outline-none"
        >
          {menuOpen ? <FiX /> : <FiMenu />}{" "}
          {/* Toggle between open/close icon */}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-10 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } sm:hidden`}
        onClick={() => setMenuOpen(false)} // Clicking outside closes the menu
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          menuOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
        } sm:hidden z-50 p-6`}
      >
        {/* Menu Links */}
        <Link
          className="block text-gray-600 hover:text-gray-800 py-3"
          href="/"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          className="block text-gray-600 hover:text-gray-800 py-3"
          href="/cart"
          onClick={() => setMenuOpen(false)}
        >
          Cart
        </Link>
        <Link
          className="block text-gray-600 hover:text-gray-800 py-3"
          href="/checkout"
          onClick={() => setMenuOpen(false)}
        >
          Checkout
        </Link>

        {/* Mobile Login/Logout */}
        <div className="border-t mt-4 pt-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
