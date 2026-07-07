import { useEffect, useState } from "react";
import { getActivityLogs } from "../../api/activityApi";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    const response = await getActivityLogs();

    if (response.success) {
      setLogs(response.data);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

 return (
  <div style={page}>
    <div style={header}>
      <div>
        <h1 style={title}>Activity Logs</h1>
        <p style={subtitle}>
          Monitor all activities performed within the system.
        </p>
      </div>
    </div>

    <div style={tableCard}>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>User</th>
            <th style={th}>Action</th>
            <th style={th}>Module</th>
            <th style={th}>Description</th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" style={emptyCell}>
                No activity logs found.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.logId} style={tr}>
                <td style={td}>
                  <div style={userBox}>
                    <div style={avatar}>
                      {log.userName?.charAt(0)}
                    </div>
                    {log.userName}
                  </div>
                </td>

                <td style={td}>
                  <span style={badge}>
                    {log.action}
                  </span>
                </td>

                <td style={td}>{log.module}</td>

                <td style={td}>{log.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
  borderRadius: "20px",
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

const tableCard = {
  background: "#fff",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  background: "#9B1C1C",
  color: "white",
  padding: "18px",
  textAlign: "left",
  fontSize: "15px",
};

const tr = {
  borderBottom: "1px solid #eee",
};

const td = {
  padding: "18px",
  color: "#333",
};

const emptyCell = {
  padding: "40px",
  textAlign: "center",
  color: "#888",
};

const userBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
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
  fontWeight: "bold",
};

const badge = {
  background: "#FFF0D6",
  color: "#B45309",
  padding: "8px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
};

export default ActivityLogs;