import React from "react";
import { useForm } from "react-hook-form";
import API from "../api"; // 👈 axios instance

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("contact", data.contact);
      formData.append("email_id", data.email_id);
      formData.append("image", data.image[0]);

      await API.post("/schools", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ School added successfully");
      reset();
      document.querySelector("input[type='file']").value = "";
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Add School</h2>

        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Name"
          className="border p-2 w-full rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          {...register("address", { required: "Address is required" })}
          placeholder="Address"
          className="border p-2 w-full rounded"
        />
        {errors.address && <p className="text-red-500">{errors.address.message}</p>}

        <input
          {...register("city", { required: "City is required" })}
          placeholder="City"
          className="border p-2 w-full rounded"
        />
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}

        <input
          {...register("state", { required: "State is required" })}
          placeholder="State"
          className="border p-2 w-full rounded"
        />
        {errors.state && <p className="text-red-500">{errors.state.message}</p>}

        <input
          type="tel"
          {...register("contact", {
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10}$/, // 10 digits
              message: "Contact must be exactly 10 digits",
            },
          })}
          placeholder="Contact"
          className="border p-2 w-full rounded"
        />
        {errors.contact && <p className="text-red-500">{errors.contact.message}</p>}

        <input
          type="email"
          {...register("email_id", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
          className="border p-2 w-full rounded"
        />
        {errors.email_id && <p className="text-red-500">{errors.email_id.message}</p>}

        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Image is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add School
        </button>
      </form>
    </div>
  );
}
