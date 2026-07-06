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
    <div>
      <h1>Activity Logs</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Module</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4">No activity logs found.</td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.logId}>
                <td>{log.userName}</td>
                <td>{log.action}</td>
                <td>{log.module}</td>
                <td>{log.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityLogs;