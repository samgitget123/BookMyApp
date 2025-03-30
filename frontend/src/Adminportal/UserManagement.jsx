import React, { useEffect, useState } from "react";
import axios from "axios";
import { useBaseUrl } from "../Contexts/BaseUrlContext";
import { useNavigate } from "react-router-dom";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/user/allusers`);
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  // Toggle userFlag (true/false)
  const toggleUserFlag = async (user_id, currentFlag) => {
    try {
      const newFlag = !currentFlag;
      await axios.put(`${baseUrl}/api/user/userFlag/${user_id}`, {
        userFlag: newFlag,
      });

      // Update UI after successful change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === user_id ? { ...user, userFlag: newFlag } : user
        )
      );
    } catch (error) {
      console.error("Error updating user flag:", error);
    }
  };

  return (
    <div className="container mt-4">
         <h4 className="mb-3">User<span style={{ color: "#198754" }}> Management</span></h4>
     
      <button className="btn btn-sm btn-success mb-3" onClick={() => navigate("/admindashboard")}>
        🔙 Back
      </button>
      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : (
        <div className="table-responsive">
          {users.length === 0 ? (
            <div className="text-center my-4">
              <p>No users found</p>
            </div>
          ) : (
            <table className="table table-sm table-striped table-bordered">
              <thead className="table-dark">
                <tr className="text-center">
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id} className="text-center">
                    <td>{user.name}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={user.userFlag ? "text-danger" : "text-success"}>
                        {user.userFlag ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${user.userFlag ? "btn-success" : "btn-danger"}`}
                        onClick={() => toggleUserFlag(user.user_id, user.userFlag)}
                      >
                        {user.userFlag ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
