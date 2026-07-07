import { useEffect, useState } from "react";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../../api/supplierApi";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: ""
  });

  const loadSuppliers = async () => {
    const response = await getSuppliers();

    if (response.success) {
      setSuppliers(response.data);
    }
  };

  useEffect(() => {
    loadSuppliers();
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
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        response = await updateSupplier(editingId, form);
      } else {
        response = await createSupplier(form);
      }

      if (!response.success) {
        alert(response.message);
        return;
      }

      alert(editingId ? "Supplier updated." : "Supplier added.");

      resetForm();
      loadSuppliers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Supplier request failed.");
    }
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier.supplierId);

    setForm({
      companyName: supplier.companyName || "",
      contactPerson: supplier.contactPerson || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (supplierId) => {
    if (!confirm("Delete this supplier?")) return;

    await deleteSupplier(supplierId);
    alert("Supplier deleted.");
    loadSuppliers();
  };

  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = suppliers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={title}>Suppliers Management</h1>
        <p style={subtitle}>
          Manage supplier records, contact details, and business partners.
        </p>
      </div>

      <div style={formCard}>
        <h2 style={sectionTitle}>
          {editingId ? "Update Supplier" : "Add New Supplier"}
        </h2>

        <form onSubmit={handleSubmit} style={formGrid}>
          <input
            style={input}
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
          />

          <input
            style={input}
            name="contactPerson"
            placeholder="Contact Person"
            value={form.contactPerson}
            onChange={handleChange}
            required
          />

          <input
            style={input}
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            style={input}
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            style={input}
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <div style={buttonGroup}>
            <button type="submit" style={primaryBtn}>
              {editingId ? "Update Supplier" : "Add Supplier"}
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
        <div style={tableHeader}>
          <div>
            <h2 style={sectionTitle}>Supplier List</h2>
            <p style={smallText}>Total Suppliers: {suppliers.length}</p>
          </div>
        </div>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Company</th>
              <th style={th}>Contact Person</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Address</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSuppliers.length === 0 ? (
              <tr>
                <td colSpan="7" style={emptyCell}>
                  No suppliers found.
                </td>
              </tr>
            ) : (
              paginatedSuppliers.map((supplier) => (
                <tr key={supplier.supplierId}>
                  <td style={td}>
                    <strong>{supplier.companyName}</strong>
                  </td>
                  <td style={td}>{supplier.contactPerson}</td>
                  <td style={td}>{supplier.email}</td>
                  <td style={td}>{supplier.phone}</td>
                  <td style={td}>{supplier.address}</td>
                  <td style={td}>
                    <span style={statusBadge}>
                      {supplier.status || "Active"}
                    </span>
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => handleEdit(supplier)}
                      style={editBtn}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(supplier.supplierId)}
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

        {suppliers.length > itemsPerPage && (
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

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px",
  marginTop: "20px"
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
  padding: "14px 18px",
  background: "#9B1C1C",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer"
};

const cancelBtn = {
  padding: "14px 18px",
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

const tableHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "18px"
};

const smallText = {
  marginTop: "8px",
  color: "#666"
};

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

const th = {
  background: "#9B1C1C",
  color: "white",
  padding: "14px",
  textAlign: "left",
  fontSize: "14px"
};

const td = {
  padding: "14px",
  borderBottom: "1px solid #eee",
  color: "#333",
  fontSize: "14px"
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
  padding: "8px 13px",
  background: "#E7C56A",
  color: "#111",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
  marginRight: "8px"
};

const deleteBtn = {
  padding: "8px 13px",
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

export default Suppliers;