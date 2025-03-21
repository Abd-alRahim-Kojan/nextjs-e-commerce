"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, getTotalPrice } =
    useCart();
  const router = useRouter();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

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
              className="border border-gray-300 p-4 mb-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h2 className="font-bold">{item.name}</h2>
                <p>
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-blue-50 transition duration-200 ease-in-out"
                >
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-blue-50 transition duration-200 ease-in-out"
                >
                  +
                </button>
              </div>

              <p className="font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="w-full sm:w-auto bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-bold">
              Total: ${getTotalPrice().toFixed(2)}
            </h2>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => router.push("/checkout")}
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-full"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
