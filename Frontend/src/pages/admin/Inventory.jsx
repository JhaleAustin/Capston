import { useEffect, useState } from "react";

import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
} from "../../api/inventoryApi";

import { getCategories } from "../../api/categoryApi";
import { getSuppliers } from "../../api/supplierApi";

function Inventory() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [form, setForm] = useState({
    itemName: "",
    categoryId: "",
    supplierId: "",
    barcode: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    minimumStock: "",
    unit: "pcs",
    expirationDate: "",
    imageUrl: ""
  });

  const loadData = async () => {
    const inventoryResponse = await getInventory();
    const categoryResponse = await getCategories();
    const supplierResponse = await getSuppliers();

    if (inventoryResponse.success) setItems(inventoryResponse.data);
    if (categoryResponse.success) setCategories(categoryResponse.data);
    if (supplierResponse.success) setSuppliers(supplierResponse.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      itemName: "",
      categoryId: "",
      supplierId: "",
      barcode: "",
      description: "",
      costPrice: "",
      sellingPrice: "",
      quantity: "",
      minimumStock: "",
      unit: "pcs",
      expirationDate: "",
      imageUrl: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      quantity: Number(form.quantity),
      minimumStock: Number(form.minimumStock)
    };

    if (editingId) {
      await updateInventory(editingId, payload);
      alert("Item updated.");
    } else {
      await createInventory(payload);
      alert("Item added.");
    }

    resetForm();
    loadData();
  };

  const handleEdit = (item) => {
    setEditingId(item.itemId);

    setForm({
      itemName: item.itemName || "",
      categoryId: item.categoryId || "",
      supplierId: item.supplierId || "",
      barcode: item.barcode || "",
      description: item.description || "",
      costPrice: item.costPrice || "",
      sellingPrice: item.sellingPrice || "",
      quantity: item.quantity || "",
      minimumStock: item.minimumStock || "",
      unit: item.unit || "pcs",
      expirationDate: item.expirationDate || "",
      imageUrl: item.imageUrl || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    await deleteInventory(itemId);
    alert("Item deleted.");
    loadData();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.name : categoryId;
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((sup) => sup.supplierId === supplierId);
    return supplier ? supplier.companyName : supplierId;
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={title}>Inventory Management</h1>
        <p style={subtitle}>
          Manage stock items, categories, suppliers, pricing, and availability.
        </p>
      </div>

      <div style={formCard}>
        <h2 style={sectionTitle}>
          {editingId ? "Update Inventory Item" : "Add Inventory Item"}
        </h2>

        <form onSubmit={handleSubmit} style={formGrid}>
          <input style={input} name="itemName" placeholder="Item Name" value={form.itemName} onChange={handleChange} required />

          <select style={input} name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>

          <select style={input} name="supplierId" value={form.supplierId} onChange={handleChange} required>
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplierId} value={supplier.supplierId}>
                {supplier.companyName}
              </option>
            ))}
          </select>

          <input style={input} name="barcode" placeholder="Barcode" value={form.barcode} onChange={handleChange} />
          <input style={input} name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input style={input} name="costPrice" type="number" placeholder="Cost Price" value={form.costPrice} onChange={handleChange} required />
          <input style={input} name="sellingPrice" type="number" placeholder="Selling Price" value={form.sellingPrice} onChange={handleChange} required />
          <input style={input} name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
          <input style={input} name="minimumStock" type="number" placeholder="Minimum Stock" value={form.minimumStock} onChange={handleChange} required />
          <input style={input} name="unit" placeholder="Unit" value={form.unit} onChange={handleChange} />
          <input style={input} name="expirationDate" type="date" value={form.expirationDate} onChange={handleChange} />
          <input style={input} name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />

          <div style={buttonGroup}>
            <button type="submit" style={primaryBtn}>
              {editingId ? "Update Item" : "Add Item"}
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
            <h2 style={sectionTitle}>Inventory List</h2>
            <p style={smallText}>Total Items: {items.length}</p>
          </div>
        </div>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Item</th>
              <th style={th}>Category</th>
              <th style={th}>Supplier</th>
              <th style={th}>Quantity</th>
              <th style={th}>Min Stock</th>
              <th style={th}>Price</th>
              <th style={th}>Expiration</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="9" style={emptyCell}>No inventory found.</td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.itemId}>
                  <td style={td}><strong>{item.itemName}</strong></td>
                  <td style={td}>{getCategoryName(item.categoryId)}</td>
                  <td style={td}>{getSupplierName(item.supplierId)}</td>
                  <td style={td}>{item.quantity} {item.unit}</td>
                  <td style={td}>{item.minimumStock}</td>
                  <td style={td}>₱{item.sellingPrice}</td>
                  <td style={td}>{item.expirationDate || "N/A"}</td>
                  <td style={td}>
                    <span
                      style={{
                        ...statusBadge,
                        background:
                          Number(item.quantity) <= Number(item.minimumStock)
                            ? "#FFF0D6"
                            : "#E8F7E8",
                        color:
                          Number(item.quantity) <= Number(item.minimumStock)
                            ? "#9B1C1C"
                            : "#0A7A28"
                      }}
                    >
                      {Number(item.quantity) <= Number(item.minimumStock)
                        ? "Low Stock"
                        : item.status || "Available"}
                    </span>
                  </td>
                  <td style={td}>
                    <button onClick={() => handleEdit(item)} style={editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.itemId)} style={deleteBtn}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {items.length > itemsPerPage && (
          <div style={pagination}>
            <button
              style={pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <span style={pageText}>Page {currentPage} of {totalPages}</span>

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

const page = { padding: "30px" };

const header = {
  background: "linear-gradient(135deg, #7A1313, #9B1C1C)",
  color: "white",
  padding: "30px",
  borderRadius: "22px",
  marginBottom: "25px"
};

const title = { margin: 0, fontSize: "32px" };

const subtitle = { marginTop: "10px", color: "#F5F2ED" };

const formCard = {
  background: "#FFFFFF",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const sectionTitle = { margin: 0, color: "#7A1313" };

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

const smallText = { marginTop: "8px", color: "#666" };

const table = { width: "100%", borderCollapse: "collapse" };

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

const pageText = { color: "#333", fontWeight: "700" };

export default Inventory;