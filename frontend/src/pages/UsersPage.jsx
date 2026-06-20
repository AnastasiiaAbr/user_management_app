import { useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import useMessage from "../hooks/useMessage";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  const {message, messageType, showMessage} = useMessage();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUnauthorized = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    }
    console.log(error);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUsers(response.data);
    } catch (error) {
      handleUnauthorized(error);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(
        selectedUsers.filter(
          userId => userId !== id
        )
      );
    } else {
      setSelectedUsers([
        ...selectedUsers,
        id
      ]);
    }
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(
        users.map(user => user.id)
      );
    }
  };

  const handleBlock = async () => {
    try {
      const token =
        localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/users/block`,
        {
          ids: selectedUsers
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );
      fetchUsers();
      setSelectedUsers([]);
      showMessage('Users blocked successfully');
    } catch (error) {
      handleUnauthorized(error);
    }
  };

  const handleUnblock = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/users/unblock`,
        {
          ids: selectedUsers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchUsers();
      setSelectedUsers([])
      showMessage('Users unblocked successfully');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            ids: selectedUsers
          }
        }
      );
      fetchUsers();
      setSelectedUsers([])
      showMessage('Users deleted successfully');
    } catch (error) {
      handleUnauthorized(error);
    }
  };

  const handleDeleteUnverified = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/api/users/unverified`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchUsers();
      setSelectedUsers([])
      showMessage('Users deleted successfully');
    } catch (error) {
      handleUnauthorized(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString(
      'ru-RU',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  return (
    <>
      <Header />

      <div className="container-fluid px-4 mt-4">

        <div className="card shadow-sm">

          <div className="card-body">

            <h4 className="mb-4">
              Users
            </h4>

            <div className="mb-3 d-flex gap-2">

              <button
                className='btn btn-outline-primary'
                title="Block"
                disabled={selectedUsers.length === 0}
                onClick={handleBlock}
              >
                <i className="bi bi-lock-fill me-2"></i>
                Block
              </button>

              <button
                className='btn btn-outline-primary'
                title="Unblock"
                disabled={selectedUsers.length === 0}
                onClick={handleUnblock}
              >
                <i className="bi bi-unlock-fill"></i>
              </button>

              <button
                className='btn btn-outline-danger'
                title="Delete"
                disabled={selectedUsers.length === 0}
                onClick={handleDelete}
              >
                <i className="bi bi-trash-fill"></i>
              </button>

              <button
                className='btn btn-outline-danger'
                title="Delete Unverified"
                onClick={handleDeleteUnverified}
              >
                <i className="bi bi-person-x-fill"></i>
              </button>

            </div>

            {message && (
              <div
                className={`alert alert-${messageType} alert-dismissible fade show mx-4 mt-3`}
                role="alert"
              >
                {message}

              </div>
            )}

            <table className="table table-striped table-hover align-middle">

              <thead className="table-light">

                <tr>

                  <th style={{ width: '50px' }}>
                    <input
                      type='checkbox'
                      checked={
                        users.length > 0 &&
                        selectedUsers.length === users.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>

                  <th>Name</th>

                  <th>Email</th>

                  <th>Status</th>

                  <th>Last Login</th>

                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>

                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() =>
                          handleSelectUser(user.id)
                        }
                      />

                    </td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={
                          user.status === 'active'
                            ? 'badge bg-success'
                            : user.status === 'blocked'
                              ? 'badge bg-danger'
                              : 'badge bg-warning text-dark'
                        }
                      >
                        {user.status}
                      </span>
                    </td>

                    <td>{formatDate(user.last_login)}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
};

export default UsersPage;