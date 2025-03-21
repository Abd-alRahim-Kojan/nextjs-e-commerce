"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const { cart, addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [addedMessage, setAddedMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("opacity-0 scale-95");

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      // If user is not logged in, show login modal
      setModalAnimation("opacity-0 scale-95");
      setShowModal(true);
      setTimeout(() => {
        setModalAnimation("opacity-100 scale-100");
      }, 100);
      return;
    }

    if (!cart.some((item) => item.id === product.id)) {
      addToCart(product);
      setAddedMessage(`${product.name} has been added to your cart.`);
      setTimeout(() => setAddedMessage(""), 2000); // Hide message after 2 seconds
    }
  };

  const closeModal = () => {
    setModalAnimation("opacity-0 scale-95");
    setTimeout(() => {
      setShowModal(false);
    }, 200);
  };

  return (
    <div className="container mx-auto p-8">
      {/* success message */}
      {addedMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 translate-y-16 z-50">
          <div className="mb-4 p-3 bg-green-200 text-green-800 rounded shadow-lg animate-fade-in-down">
            {addedMessage}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Available Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((product) => {
            const inCart = cart.some((item) => item.id === product.id);

            return (
              <div
                key={product.id}
                className="bg-gray-100 shadow-sm rounded-lg p-4"
              >
                <div className="relative">
                  <img
                    src={`/uploads/${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                    width={400}
                    height={160}
                  />
                </div>
                <div className="p-2 block lg:flex gap-2 justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {product.description}
                    </p>
                    <p className="text-gray-700 font-bold mt-1">
                      ${product.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={inCart}
                    className={`px-4 py-2 mt-3 w-full lg:w-24 lg:m-0 rounded-md transition ${
                      inCart
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {inCart ? "In Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Login Required Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 z-50">
          <div
            className={`bg-white p-6 rounded shadow-lg w-80 text-center transform transition-all duration-300 ${modalAnimation}`}
          >
            <h2 className="text-xl font-bold text-red-500 mb-4">
              Login Required
            </h2>
            <p className="mb-4">
              You need to log in to add products to the cart.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2 hover:bg-blue-600 transition"
            >
              Go to Login
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
