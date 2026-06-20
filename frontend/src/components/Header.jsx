import { useNavigate } from "react-router-dom";

function Header() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-primary shadow-sm">

      <div className="container-fluid px-4">

        <div>
          <h4 className="mb-0 text-white">
            User Management System
          </h4>

          <small className="text-light">
            Administration Panel
          </small>
        </div>

        <button
          className="btn btn-light"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Header;