import { useEffect, useState } from "react";
import { getInventory } from "../../api/inventoryApi";

function Menu() {
  const [items, setItems] = useState([]);

  const loadMenu = async () => {
    const response = await getInventory();

    if (response.success) {
      setItems(response.data);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  return (
    <div style={page}>
      <div style={hero}>
        <span style={heroBadge}>Japanese Cuisine</span>

        <h1 style={title}>Kyojiro Menu</h1>

        <p style={subtitle}>
          Experience authentic Japanese flavors and discover our delicious dishes.
        </p>
      </div>

      {items.length === 0 ? (
        <div style={emptyCard}>
          <h2>No menu items available.</h2>
          <p>Please check back later.</p>
        </div>
      ) : (
        <div style={grid}>
          {items.map((item) => (
            <div key={item.itemId} style={card}>
              <div style={imageContainer}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    style={image}
                  />
                ) : (
                  <div style={placeholder}>
                    🍜
                  </div>
                )}
              </div>

              <div style={cardBody}>
                <h2 style={foodName}>
                  {item.itemName}
                </h2>

                <p style={description}>
                  {item.description}
                </p>

                <div style={footer}>
                  <h3 style={price}>
                    ₱{item.sellingPrice}
                  </h3>

                  <span
                    style={{
                      ...stockBadge,
                      background:
                        item.quantity > 0
                          ? "#E8F7E8"
                          : "#FFE5E5",
                      color:
                        item.quantity > 0
                          ? "#0A7A28"
                          : "#9B1C1C",
                    }}
                  >
                    {item.quantity > 0
                      ? "Available"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const page = {
  padding: "35px",
  background: "#F5F2ED",
  minHeight: "100vh",
};

const hero = {
  background:
    "linear-gradient(135deg,#7A1313,#9B1C1C)",
  color: "white",
  padding: "50px 30px",
  borderRadius: "30px",
  textAlign: "center",
  marginBottom: "35px",
  boxShadow:
    "0 14px 35px rgba(0,0,0,0.16)",
};

const heroBadge = {
  background: "#E7C56A",
  color: "#111",
  padding: "10px 20px",
  borderRadius: "30px",
  fontWeight: "900",
  display: "inline-block",
  marginBottom: "18px",
};

const title = {
  margin: 0,
  fontSize: "48px",
};

const subtitle = {
  marginTop: "15px",
  color: "#F5F2ED",
  maxWidth: "700px",
  marginInline: "auto",
  lineHeight: "1.7",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(300px,1fr))",
  gap: "30px",
};

const card = {
  background: "#FFFFFF",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow:
    "0 12px 35px rgba(0,0,0,0.08)",
};

const imageContainer = {
  height: "230px",
  background: "#f7f7f7",
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const placeholder = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "80px",
  background: "#FFF9EA",
};

const cardBody = {
  padding: "25px",
};

const foodName = {
  margin: 0,
  color: "#7A1313",
};

const description = {
  marginTop: "15px",
  color: "#666",
  lineHeight: "1.7",
  minHeight: "65px",
};

const footer = {
  marginTop: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const price = {
  margin: 0,
  color: "#111",
  fontSize: "30px",
};

const stockBadge = {
  padding: "8px 14px",
  borderRadius: "20px",
  fontWeight: "700",
  fontSize: "13px",
};

const emptyCard = {
  background: "#fff",
  padding: "60px",
  borderRadius: "24px",
  textAlign: "center",
  color: "#777",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)",
};

export default Menu;