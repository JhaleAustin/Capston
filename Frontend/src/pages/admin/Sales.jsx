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
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

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

  const selectedItem = inventory.find(
    (item) => item.itemId === form.itemId
  );

  const subtotal = selectedItem
    ? Number(selectedItem.sellingPrice) * Number(form.quantity || 0)
    : 0;

  const estimatedTotal =
    subtotal - Number(form.discount || 0) + Number(form.tax || 0);

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

  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = sales.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={title}>Sales Management</h1>
        <p style={subtitle}>
          Create customer transactions and monitor sales history.
        </p>
      </div>

      <div style={contentGrid}>
        <div style={formCard}>
          <h2 style={sectionTitle}>Create New Sale</h2>

          <form onSubmit={handleSubmit} style={formGrid}>
            <input
              style={input}
              name="customerName"
              placeholder="Customer Name"
              value={form.customerName}
              onChange={handleChange}
              required
            />

            <select
              style={input}
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
              style={input}
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />

            <select
              style={input}
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
              <option value="Card">Card</option>
            </select>

            <input
              style={input}
              name="amountPaid"
              type="number"
              placeholder="Amount Paid"
              value={form.amountPaid}
              onChange={handleChange}
              required
            />

            <input
              style={input}
              name="discount"
              type="number"
              placeholder="Discount"
              value={form.discount}
              onChange={handleChange}
            />

            <input
              style={input}
              name="tax"
              type="number"
              placeholder="Tax"
              value={form.tax}
              onChange={handleChange}
            />

            <button type="submit" style={primaryBtn}>
              Create Sale
            </button>
          </form>
        </div>

        <div style={summaryCard}>
          <h2 style={sectionTitle}>Sale Preview</h2>

          <div style={previewRow}>
            <span>Selected Item</span>
            <strong>{selectedItem ? selectedItem.itemName : "None"}</strong>
          </div>

          <div style={previewRow}>
            <span>Subtotal</span>
            <strong>₱{subtotal}</strong>
          </div>

          <div style={previewRow}>
            <span>Discount</span>
            <strong>₱{Number(form.discount || 0)}</strong>
          </div>

          <div style={previewRow}>
            <span>Tax</span>
            <strong>₱{Number(form.tax || 0)}</strong>
          </div>

          <div style={totalBox}>
            <span>Estimated Total</span>
            <h2>₱{estimatedTotal}</h2>
          </div>
        </div>
      </div>

      <div style={tableCard}>
        <div style={tableHeader}>
          <div>
            <h2 style={sectionTitle}>Sales History</h2>
            <p style={smallText}>Total Transactions: {sales.length}</p>
          </div>
        </div>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Invoice</th>
              <th style={th}>Customer</th>
              <th style={th}>Total</th>
              <th style={th}>Payment</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSales.length === 0 ? (
              <tr>
                <td colSpan="6" style={emptyCell}>
                  No sales found.
                </td>
              </tr>
            ) : (
              paginatedSales.map((sale) => (
                <tr key={sale.saleId}>
                  <td style={td}>
                    <strong>{sale.invoiceNo}</strong>
                  </td>
                  <td style={td}>{sale.customerName}</td>
                  <td style={td}>₱{sale.total}</td>
                  <td style={td}>{sale.paymentMethod}</td>
                  <td style={td}>
                    <span style={statusBadge}>{sale.status}</span>
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => handleDelete(sale.saleId)}
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

        {sales.length > itemsPerPage && (
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

const contentGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "20px",
  marginBottom: "25px"
};

const formCard = {
  background: "#FFFFFF",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const summaryCard = {
  background: "#FFFFFF",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  height: "fit-content"
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

const primaryBtn = {
  padding: "14px 18px",
  background: "#9B1C1C",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer"
};

const previewRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 0",
  borderBottom: "1px solid #eee",
  color: "#333"
};

const totalBox = {
  marginTop: "20px",
  background: "#FFF0D6",
  padding: "18px",
  borderRadius: "16px",
  color: "#7A1313"
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

export default Sales;