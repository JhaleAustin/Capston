import { useEffect, useState } from "react";
import { getInventory } from "../../api/inventoryApi";

import {
  getSales,
  createSale,
  deleteSale
} from "../../api/salesApi";

function Sales() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [form, setForm] = useState({
    customerName: "Walk-in Customer",
    paymentMethod: "Cash",
    amountPaid: "",
    discount: 0,
    tax: 0,
    itemId: "",
    quantity: 1
  });

  const loadData = async () => {
    const salesResponse = await getSales();
    const inventoryResponse = await getInventory();

    if (salesResponse.success) {
      setSales(salesResponse.data);
    }

    if (inventoryResponse.success) {
      setInventory(inventoryResponse.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customerName: form.customerName,
      cashierId: user.uid,
      cashierName: user.name,
      paymentMethod: form.paymentMethod,
      amountPaid: Number(form.amountPaid),
      discount: Number(form.discount),
      tax: Number(form.tax),
      items: [
        {
          itemId: form.itemId,
          quantity: Number(form.quantity)
        }
      ]
    };

    const response = await createSale(payload);

    if (!response.success) {
      alert(response.message);
      return;
    }

    alert("Sale created successfully.");

    setForm({
      customerName: "Walk-in Customer",
      paymentMethod: "Cash",
      amountPaid: "",
      discount: 0,
      tax: 0,
      itemId: "",
      quantity: 1
    });

    loadData();
  };

  const handleDelete = async (saleId) => {
    if (!confirm("Delete this sale?")) return;

    await deleteSale(saleId);
    alert("Sale deleted.");
    loadData();
  };

  return (
    <div>
      <h1>Sales Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleChange}
          required
        />

        <select
          name="itemId"
          value={form.itemId}
          onChange={handleChange}
          required
        >
          <option value="">Select Item</option>
          {inventory.map((item) => (
            <option key={item.itemId} value={item.itemId}>
              {item.itemName} - ₱{item.sellingPrice} - Stock: {item.quantity}
            </option>
          ))}
        </select>

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
        >
          <option value="Cash">Cash</option>
          <option value="GCash">GCash</option>
          <option value="Card">Card</option>
        </select>

        <input
          name="amountPaid"
          type="number"
          placeholder="Amount Paid"
          value={form.amountPaid}
          onChange={handleChange}
          required
        />

        <input
          name="discount"
          type="number"
          placeholder="Discount"
          value={form.discount}
          onChange={handleChange}
        />

        <input
          name="tax"
          type="number"
          placeholder="Tax"
          value={form.tax}
          onChange={handleChange}
        />

        <button type="submit">Create Sale</button>
      </form>

      <hr />

      <h2>Sales History</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan="6">No sales found.</td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale.saleId}>
                <td>{sale.invoiceNo}</td>
                <td>{sale.customerName}</td>
                <td>₱{sale.total}</td>
                <td>{sale.paymentMethod}</td>
                <td>{sale.status}</td>
                <td>
                  <button onClick={() => handleDelete(sale.saleId)}>
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

export default Sales;