import { useEffect, useState } from "react";
import { getSalesReport } from "../../api/reportsApi";

function Reports() {
  const [report, setReport] = useState(null);

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
    return <h2>Loading reports...</h2>;
  }

  return (
    <div>
      <h1>Sales Reports</h1>

      <div>
        <h2>Total Revenue: ₱{report.totalRevenue}</h2>
        <h2>Total Transactions: {report.transactions}</h2>
      </div>

      <hr />

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {report.sales.length === 0 ? (
            <tr>
              <td colSpan="5">No sales found.</td>
            </tr>
          ) : (
            report.sales.map((sale) => (
              <tr key={sale.saleId}>
                <td>{sale.invoiceNo}</td>
                <td>{sale.customerName}</td>
                <td>₱{sale.total}</td>
                <td>{sale.paymentMethod}</td>
                <td>{sale.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;