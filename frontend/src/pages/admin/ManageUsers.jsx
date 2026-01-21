import API from "../../api/axios";
import { useEffect, useState } from "react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>

      <table
        style={{
          width: "100%", // full width
          borderCollapse: "collapse", // clean borders
          textAlign: "left",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            {["Name", "Email", "Role", "Status", "Delete"].map((heading) => (
              <th
                key={heading}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "20%", // equal width columns
                  background: "#f4f4f4",
                  fontWeight: "bold",
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {u.name}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {u.email}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {u.role}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {u.status}
              </td>

              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => handleDelete(u._id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
