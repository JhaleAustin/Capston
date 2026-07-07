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
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (categoryId) => {
    if (!confirm("Delete this category?")) return;

    await deleteCategory(categoryId);
    alert("Category deleted.");
    loadCategories();
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedCategories = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={title}>Categories Management</h1>
        <p style={subtitle}>
          Manage product categories for Kyojiro Inshokuten.
        </p>
      </div>

      <div style={formCard}>
        <h2 style={sectionTitle}>
          {editingId ? "Update Category" : "Add New Category"}
        </h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={label}>Category Name</label>
            <input
              style={input}
              name="name"
              placeholder="Enter category name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={label}>Description</label>
            <input
              style={input}
              name="description"
              placeholder="Enter description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div style={buttonGroup}>
            <button type="submit" style={primaryBtn}>
              {editingId ? "Update Category" : "Add Category"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm} style={cancelBtn}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={tableCard}>
        <h2 style={sectionTitle}>Category List</h2>
        <p style={smallText}>
          Total Categories: <strong>{categories.length}</strong>
        </p>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Description</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan="4" style={emptyCell}>
                  No categories found.
                </td>
              </tr>
            ) : (
              paginatedCategories.map((category) => (
                <tr key={category.categoryId}>
                  <td style={td}>
                    <strong>{category.name}</strong>
                  </td>

                  <td style={td}>{category.description}</td>

                  <td style={td}>
                    <span style={statusBadge}>
                      {category.status || "Active"}
                    </span>
                  </td>

                  <td style={td}>
                    <button
                      onClick={() => handleEdit(category)}
                      style={editBtn}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {categories.length > itemsPerPage && (
          <div style={pagination}>
            <button
              style={pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <span style={pageText}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              style={pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const page = {
  padding: "30px"
};

const header = {
  background: "linear-gradient(135deg, #7A1313, #9B1C1C)",
  color: "white",
  padding: "30px",
  borderRadius: "22px",
  marginBottom: "25px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
};

const title = {
  margin: 0,
  fontSize: "32px"
};

const subtitle = {
  marginTop: "10px",
  color: "#F5F2ED"
};

const formCard = {
  background: "#FFFFFF",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const sectionTitle = {
  margin: 0,
  color: "#7A1313"
};

const formStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr auto",
  gap: "18px",
  alignItems: "end",
  marginTop: "20px"
};

const inputGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const label = {
  fontWeight: "700",
  color: "#333"
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "15px"
};

const buttonGroup = {
  display: "flex",
  gap: "10px"
};

const primaryBtn = {
  padding: "14px 20px",
  background: "#9B1C1C",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer"
};

const cancelBtn = {
  padding: "14px 20px",
  background: "#E7C56A",
  color: "#111",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer"
};

const tableCard = {
  background: "#FFFFFF",
  borderRadius: "20px",
  padding: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const smallText = {
  marginTop: "8px",
  marginBottom: "18px",
  color: "#666"
};

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

const th = {
  background: "#9B1C1C",
  color: "white",
  padding: "15px",
  textAlign: "left"
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #eee",
  color: "#333"
};

const emptyCell = {
  padding: "35px",
  textAlign: "center",
  color: "#777"
};

const statusBadge = {
  background: "#E8F7E8",
  color: "#0A7A28",
  padding: "7px 14px",
  borderRadius: "20px",
  fontWeight: "700",
  fontSize: "13px"
};

const editBtn = {
  padding: "9px 14px",
  background: "#E7C56A",
  color: "#111",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
  marginRight: "8px"
};

const deleteBtn = {
  padding: "9px 14px",
  background: "#9B1C1C",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer"
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginTop: "22px"
};

const pageBtn = {
  padding: "10px 18px",
  background: "#7A1313",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer"
};

const pageText = {
  color: "#333",
  fontWeight: "700"
};

export default Categories;