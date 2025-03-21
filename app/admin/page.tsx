"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageFile: null,
  });

  // Modal State
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("opacity-0 scale-95");

  // Success Message State
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: any) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.imageFile) {
      alert("Please upload an image.");
      return;
    }

    // Upload Image
    const imageFormData = new FormData();
    imageFormData.append("image", formData.imageFile);

    const imageRes = await fetch("/api/upload", {
      method: "POST",
      body: imageFormData,
    });

    if (!imageRes.ok) {
      alert("Image upload failed.");
      return;
    }

    const imageData = await imageRes.json();

    // Add Product with Uploaded Image
    const productRes = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: imageData.filename,
      }),
    });

    if (productRes.ok) {
      const newProduct = await productRes.json();
      setProducts([...products, newProduct]);
      setFormData({ name: "", description: "", price: "", imageFile: null });

      // Show success message
      setAddedMessage("Product added successfully!");

      // Remove message after 3 seconds
      setTimeout(() => {
        setAddedMessage("");
      }, 3000);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteProductId(id);
    setModalAnimation("opacity-0 scale-95");
    setModalVisible(true);

    setTimeout(() => {
      setModalAnimation("opacity-100 scale-100");
    }, 100);
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    const res = await fetch(`/api/products/${deleteProductId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProducts(products.filter((product) => product.id !== deleteProductId)); // Remove from UI
      closeModal();
    } else {
      alert("Failed to delete product.");
    }
  };

  const closeModal = () => {
    setModalAnimation("opacity-0 scale-95");
    setTimeout(() => {
      setModalVisible(false);
    }, 200);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Success Message */}
      {addedMessage && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
          {addedMessage}
        </div>
      )}

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="block w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="block w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="block w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Product
        </button>
      </form>

      {/* Product List */}
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="bg-gray-100 shadow-sm rounded-lg p-4"
          >
            <div className="relative">
              <img
                src={`/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
            </div>
            <div className="p-2 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="text-gray-700 font-bold mt-1">${product.price}</p>
              </div>
              <button
                onClick={() => confirmDelete(product.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 z-50">
          <div
            className={`bg-white p-6 rounded shadow-lg w-80 text-center transform transition-all duration-300 ${modalAnimation}`}
          >
            <h2 className="text-xl font-bold text-red-500 mb-4">
              Confirm Deletion
            </h2>
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded w-full mb-2 hover:bg-red-600 transition"
            >
              Yes, Delete
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
