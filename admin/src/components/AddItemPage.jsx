import React, { useRef, useState } from "react";
import { addItemPageStyles as styles } from "../assets/adminStyle";
import axios from "axios";
import { FiSave, FiX } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";

const initialFormState = {
  name: "",
  description: "",
  category: "",
  oldPrice: "",
  price: "",
  image: null,
  preview: "",
};
const categories = [
  "Fruits",
  "Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Pantry",
];

const AddItemPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((f) => ({
      ...f,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const removeImage = (e) => {
    setFormData((f) => ({ ...f, image: null, preview: "" }));
    fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();
      body.append("name", formData.name);
      body.append("description", formData.description);
      body.append("category", formData.category);
      body.append("oldPrice", formData.oldPrice);
      body.append("price", formData.price);
      if (formData.image) {
        body.append("image", formData.image);
      }

      const res = await axios.post("http://localhost:8080/api/items", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Created ", res.data);
      console.log("Image URL from backend:", res.data.imageUrl)
      alert("Product Added");
      // reset form
      setFormData(initialFormState);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      alert("Upload failled");
    }
  };

  const { name, category, price, description, oldPrice, preview } = formData;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <h1 className={styles.heading}>Add New Product</h1>

        {/* form to accept the product data and display on the main websit real time */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.gridContainer}>
            {/* this is for the name of the product */}
            <div>
              <label className={styles.label}>Product Name *</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            {/* this is for the to select the category from the given category */}
            <div>
              <label className={styles.label}>Category *</label>
              <select
                name="category"
                value={category}
                onChange={handleChange}
                required
                className={styles.input}
              >
                <option value=""> Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {" "}
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* description */}
          <div>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              rows="3"
              className={styles.textarea}
            />
          </div>

          {/* price */}
          <div className={styles.priceGrid}>
            {/* new price */}
            <div>
              <label className={styles.label}> Original Price(₹)*</label>
              <input
                type="number"
                name="oldPrice"
                value={oldPrice}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            {/* old price */}
            <div>
              <label className={styles.label}> Selling Price(₹)*</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          {/* image upload */}
          <div>
            <label className={styles.label}>Product Image</label>
            <div
              onClick={() => fileInputRef.current.click()}
              className={styles.imageUploadContainer}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="preview"
                    className={styles.previewImage}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className={styles.removeButton}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <FiUpload className={styles.uploadIcon} />
                  <p>Click here to upload image (max 5mb)</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className={styles.hiddenInput}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            <FiSave className="mr-2" />
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemPage;
