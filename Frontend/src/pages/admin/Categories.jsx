import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../api/categoryApi";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const loadCategories = async () => {
    const response = await getCategories();

    if (response.success) {
      setCategories(response.data);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateCategory(editingId, form);
      alert("Category updated.");
    } else {
      await createCategory(form);
      alert("Category added.");
    }

    resetForm();
    loadCategories();
  };

  const handleEdit = (category) => {
    setEditingId(category.categoryId);

    setForm({
      name: category.name || "",
      description: category.description || ""
    });
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Delete this category?")) return;

    await deleteCategory(categoryId);
    alert("Category deleted.");
    loadCategories();
  };

  return (
    <div>
      <h1>Categories Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Category Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Category" : "Add Category"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4">No categories found.</td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.status}</td>
                <td>
                  <button onClick={() => handleEdit(category)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(category.categoryId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;