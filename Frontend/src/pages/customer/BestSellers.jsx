import { useEffect, useState } from "react";
import { getBestSelling } from "../../api/salesApi";

function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBestSellers = async () => {
    try {
      const response = await getBestSelling();

      if (response.success) {
        setBestSellers(response.data);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load best sellers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBestSellers();
  }, []);

  if (loading) {
    return <h2>Loading best sellers...</h2>;
  }

  return (
    <div>
      <h1>Best Sellers</h1>
      <p>See the most popular items based on sales.</p>

      {bestSellers.length === 0 ? (
        <p>No best-selling products yet.</p>
      ) : (
        bestSellers.map((item, index) => (
          <div key={index} style={card}>
            <h2>{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}</h2>
            <h3>{item[0]}</h3>
            <p>Total Sold: {item[1]}</p>
          </div>
        ))
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
  background: "#fff"
};

export default BestSellers;