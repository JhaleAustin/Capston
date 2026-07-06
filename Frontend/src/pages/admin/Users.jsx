import { useEffect, useState } from "react";

import {
  getUsers,
  updateUser,
  deleteUser
} from "../../api/usersApi";

function Users() {
  const [users, setUsers] = useState([]);

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

  return (
    <div>
      <h1>Users Management</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.uid}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.uid, e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="staff">staff</option>
                    <option value="customer">customer</option>
                  </select>
                </td>
                <td>{user.status}</td>
                <td>
                  <button onClick={() => changeStatus(user.uid, "Active")}>
                    Activate
                  </button>
                  <button onClick={() => changeStatus(user.uid, "Inactive")}>
                    Deactivate
                  </button>
                  <button onClick={() => handleDelete(user.uid)}>
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

export default Users;