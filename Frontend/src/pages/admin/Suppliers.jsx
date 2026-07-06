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
  };

  const handleDelete = async (supplierId) => {
    if (!confirm("Delete this supplier?")) return;

    await deleteSupplier(supplierId);
    alert("Supplier deleted.");
    loadSuppliers();
  };

  return (
    <div>
      <h1>Suppliers Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        <input
          name="contactPerson"
          placeholder="Contact Person"
          value={form.contactPerson}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Supplier" : "Add Supplier"}
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
            <th>Company</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan="7">No suppliers found.</td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <tr key={supplier.supplierId}>
                <td>{supplier.companyName}</td>
                <td>{supplier.contactPerson}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.address}</td>
                <td>{supplier.status}</td>
                <td>
                  <button onClick={() => handleEdit(supplier)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(supplier.supplierId)}>
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

export default Suppliers;