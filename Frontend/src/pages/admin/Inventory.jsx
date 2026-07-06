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

    if (inventoryResponse.success) {
      setItems(inventoryResponse.data);
    }

    if (categoryResponse.success) {
      setCategories(categoryResponse.data);
    }

    if (supplierResponse.success) {
      setSuppliers(supplierResponse.data);
    }
  };

  useEffect(() => {
    loadData();
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

  return (
    <div>
      <h1>Inventory Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="itemName"
          placeholder="Item Name"
          value={form.itemName}
          onChange={handleChange}
          required
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option
              key={category.categoryId}
              value={category.categoryId}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="supplierId"
          value={form.supplierId}
          onChange={handleChange}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option
              key={supplier.supplierId}
              value={supplier.supplierId}
            >
              {supplier.companyName}
            </option>
          ))}
        </select>

        <input
          name="barcode"
          placeholder="Barcode"
          value={form.barcode}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="costPrice"
          type="number"
          placeholder="Cost Price"
          value={form.costPrice}
          onChange={handleChange}
          required
        />

        <input
          name="sellingPrice"
          type="number"
          placeholder="Selling Price"
          value={form.sellingPrice}
          onChange={handleChange}
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
          name="minimumStock"
          type="number"
          placeholder="Minimum Stock"
          value={form.minimumStock}
          onChange={handleChange}
          required
        />

        <input
          name="unit"
          placeholder="Unit"
          value={form.unit}
          onChange={handleChange}
        />

        <label>
          Expiration Date
          <input
            name="expirationDate"
            type="date"
            value={form.expirationDate}
            onChange={handleChange}
          />
        </label>

        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Item" : "Add Item"}
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
            <th>Item</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Quantity</th>
            <th>Min Stock</th>
            <th>Selling Price</th>
            <th>Expiration Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="9">No inventory found.</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.itemId}>
                <td>{item.itemName}</td>
                <td>{getCategoryName(item.categoryId)}</td>
                <td>{getSupplierName(item.supplierId)}</td>
                <td>{item.quantity}</td>
                <td>{item.minimumStock}</td>
                <td>₱{item.sellingPrice}</td>
                <td>{item.expirationDate || "N/A"}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(item.itemId)}>
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

export default Inventory;