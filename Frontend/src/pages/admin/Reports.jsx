import { useEffect, useState } from "react";
import { getSalesReport } from "../../api/reportsApi";

function Reports() {
  const [report, setReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const loadReport = async () => {
    const response = await getSalesReport();

    if (response.success) {
      setReport(response.data);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (!report) {
    return <h2 style={{ padding: "30px" }}>Loading reports...</h2>;
  }

  const totalPages = Math.ceil(report.sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = report.sales.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={title}>Sales Reports</h1>
        <p style={subtitle}>
          View sales transactions, revenue, and payment records.
        </p>
      </div>

      <div style={summaryGrid}>
        <div style={summaryCard}>
          <p style={summaryLabel}>Total Revenue</p>
          <h2 style={summaryValue}>₱{report.totalRevenue}</h2>
        </div>

        <div style={summaryCard}>
          <p style={summaryLabel}>Total Transactions</p>
          <h2 style={summaryValue}>{report.transactions}</h2>
        </div>
      </div>

      <div style={tableCard}>
        <h2 style={sectionTitle}>Sales Transaction List</h2>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Invoice</th>
              <th style={th}>Customer</th>
              <th style={th}>Total</th>
              <th style={th}>Payment Method</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedSales.length === 0 ? (
              <tr>
                <td colSpan="5" style={emptyCell}>
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
                    <span style={statusBadge}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {report.sales.length > itemsPerPage && (
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
  padding: "30px",
};

const header = {
  background: "linear-gradient(135deg, #7A1313, #9B1C1C)",
  color: "white",
  padding: "30px",
  borderRadius: "22px",
  marginBottom: "25px",
};

const title = {
  margin: 0,
  fontSize: "32px",
};

const subtitle = {
  marginTop: "10px",
  color: "#F5F2ED",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
  marginBottom: "25px",
};

const summaryCard = {
  background: "#FFFFFF",
  borderLeft: "6px solid #9B1C1C",
  padding: "24px",
  borderRadius: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const summaryLabel = {
  margin: 0,
  color: "#666",
  fontWeight: "700",
};

const summaryValue = {
  marginTop: "10px",
  color: "#111",
  fontSize: "32px",
};

const tableCard = {
  background: "#FFFFFF",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "20px",
  color: "#7A1313",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  background: "#9B1C1C",
  color: "white",
  padding: "15px",
  textAlign: "left",
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #eee",
  color: "#333",
};

const emptyCell = {
  padding: "35px",
  textAlign: "center",
  color: "#777",
};

const statusBadge = {
  background: "#E8F7E8",
  color: "#0A7A28",
  padding: "7px 14px",
  borderRadius: "20px",
  fontWeight: "700",
  fontSize: "13px",
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginTop: "22px",
};

const pageBtn = {
  padding: "10px 18px",
  background: "#7A1313",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
};

const pageText = {
  color: "#333",
  fontWeight: "700",
};

export default Reports;