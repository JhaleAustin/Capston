function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>You can browse the menu, submit feedback, and view your profile.</p>
    </div>
  );
}

export default Dashboard;