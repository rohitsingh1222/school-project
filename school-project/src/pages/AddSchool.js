import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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

      // ✅ Use relative API path for Vercel deployment
      await axios.post("/api/schools", formData);

      alert("School added successfully");
      reset();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Add School</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Name"
        />
        {errors.name && <div style={{ color: "red" }}>{errors.name.message}</div>}

        <input
          {...register("address", { required: "Address is required" })}
          placeholder="Address"
        />
        {errors.address && <div style={{ color: "red" }}>{errors.address.message}</div>}

        <input
          {...register("city", { required: "City is required" })}
          placeholder="City"
        />
        {errors.city && <div style={{ color: "red" }}>{errors.city.message}</div>}

        <input
          {...register("state", { required: "State is required" })}
          placeholder="State"
        />
        {errors.state && <div style={{ color: "red" }}>{errors.state.message}</div>}

        <input
          type="tel"
          {...register("contact", {
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10,15}$/,
              message: "Contact must be 10–15 digits only",
            },
          })}
          placeholder="Contact"
        />
        {errors.contact && <div style={{ color: "red" }}>{errors.contact.message}</div>}

        <input
          type="email"
          {...register("email_id", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|in)$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
        />
        {errors.email_id && <div style={{ color: "red" }}>{errors.email_id.message}</div>}

        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Image is required" })}
        />
        {errors.image && <div style={{ color: "red" }}>{errors.image.message}</div>}

        <button type="submit">Add School</button>
      </form>
    </div>
  );
}
