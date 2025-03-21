"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleCheckout = () => {
    setIsProcessing(true);
    setMessage("Processing payment...");

    // Simulate a fake payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setMessage("Payment Successful! Thank you for your purchase.");
      clearCart();

      // Redirect to homepage after checkout success
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }, 3000);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cart.length === 0 ? (
        <p>
          Your cart is empty.{" "}
          <Link href="/" className="text-blue-500">
            Go to shop
          </Link>
        </p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg"
            >
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <p className="font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          {/* Total Price */}
          <div className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-bold">
              Total: ${getTotalPrice().toFixed(2)}
            </h2>
          </div>

          {/* Payment Button */}
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className={`w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>

          {/* Payment Status Message */}
          {message && (
            <div className="w-full mt-4 px-4 py-3 mb-4 border border-gray-300 rounded-lg bg-green-50 text-green-700">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
