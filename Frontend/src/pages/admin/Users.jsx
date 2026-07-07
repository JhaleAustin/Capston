import { useEffect, useState } from "react";

import {
  getUsers,
  updateUser,
  deleteUser
} from "../../api/usersApi";

function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const loadUsers = async () => {
    const response = await getUsers();

    if (response.success) {
      setUsers(response.data);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (uid, role) => {
    await updateUser(uid, { role });
    alert("User role updated.");
    loadUsers();
  };

  const changeStatus = async (uid, status) => {
    await updateUser(uid, { status });
    alert("User status updated.");
    loadUsers();
  };

  const handleDelete = async (uid) => {
    if (!confirm("Delete this user?")) return;

    await deleteUser(uid);
    alert("User deleted.");
    loadUsers();
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={page}>
      <div style={header}>
        <h1 style={title}>Users Management</h1>
        <p style={subtitle}>
          Manage admin, staff, and customer accounts in the system.
        </p>
      </div>

      <div style={tableCard}>
        <div style={tableHeader}>
          <div>
            <h2 style={sectionTitle}>User Accounts</h2>
            <p style={smallText}>Total Users: {users.length}</p>
          </div>
        </div>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Role</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={emptyCell}>
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.uid}>
                  <td style={td}>
                    <div style={userBox}>
                      <div style={avatar}>
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <strong>{user.name}</strong>
                    </div>
                  </td>

                  <td style={td}>{user.email}</td>
                  <td style={td}>{user.phone}</td>

                  <td style={td}>
                    <select
                      style={select}
                      value={user.role}
                      onChange={(e) =>
                        changeRole(user.uid, e.target.value)
                      }
                    >
                      <option value="admin">admin</option>
                      <option value="staff">staff</option>
                      <option value="customer">customer</option>
                    </select>
                  </td>

                  <td style={td}>
                    <span
                      style={{
                        ...statusBadge,
                        background:
                          user.status === "Active"
                            ? "#E8F7E8"
                            : "#FFF0D6",
                        color:
                          user.status === "Active"
                            ? "#0A7A28"
                            : "#9B1C1C"
                      }}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td style={td}>
                    <button
                      style={activateBtn}
                      onClick={() =>
                        changeStatus(user.uid, "Active")
                      }
                    >
                      Activate
                    </button>

                    <button
                      style={deactivateBtn}
                      onClick={() =>
                        changeStatus(user.uid, "Inactive")
                      }
                    >
                      Deactivate
                    </button>

                    <button
                      style={deleteBtn}
                      onClick={() => handleDelete(user.uid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {users.length > itemsPerPage && (
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

const sectionTitle = {
  margin: 0,
  color: "#7A1313"
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

const userBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px"
};

const avatar = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#E7C56A",
  color: "#111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900"
};

const select = {
  padding: "9px 12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "#FFF",
  fontWeight: "700"
};

const statusBadge = {
  padding: "7px 14px",
  borderRadius: "20px",
  fontWeight: "700",
  fontSize: "13px"
};

const activateBtn = {
  padding: "8px 12px",
  background: "#E8F7E8",
  color: "#0A7A28",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
  marginRight: "6px"
};

const deactivateBtn = {
  padding: "8px 12px",
  background: "#E7C56A",
  color: "#111",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  cursor: "pointer",
  marginRight: "6px"
};

const deleteBtn = {
  padding: "8px 12px",
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

export default Users;