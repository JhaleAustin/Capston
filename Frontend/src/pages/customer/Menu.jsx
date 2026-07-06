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
    <div>
      <h1>Menu</h1>

      {items.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        items.map((item) => (
          <div key={item.itemId} style={card}>
            <h3>{item.itemName}</h3>
            <p>{item.description}</p>
            <h2>₱{item.sellingPrice}</h2>
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
  borderRadius: "8px"
};

export default Menu;