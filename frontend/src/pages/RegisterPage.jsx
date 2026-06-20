import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import img from '../assets/geometricImg.jpg';
import useMessage from "../hooks/useMessage";

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyLink, setVerifyLink] = useState('');

  const { message, messageType, showMessage } = useMessage();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          name,
          email,
          password
        }
      );

      setVerifyLink(response.data.verifyLink);

      showMessage(
        'Registration successful. Please verify your account.',
        'success'
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
        'Registration failed',
        'danger'
      );

      console.log(error);
    }
  };
  return (
    <div className="container-fluid p-0">

      <div className="row min-vh-100 g-0">

        <div className="col-lg-5 d-flex justify-content-center align-items-center bg-light">

          <div
            className="card shadow border-0 p-5"
            style={{
              width: '100%',
              maxWidth: '550px'
            }}
          >

            <div className="text-center mb-4">

              <h1 className="fw-bold mb-2">
                User Management System
              </h1>

              <p className="text-muted">
                Create your account
              </p>

            </div>

            {message && (
              <div
                className={`alert alert-${messageType}`}
                role="alert"
              >
                {message}
              </div>
            )}

            {verifyLink && (
              <div className="text-center mb-3">
                <a
                  href={verifyLink}
                  className="btn btn-success"
                >
                  Verify Account
                </a>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
              >
                Register
              </button>

            </form>

            <div className="text-center mt-4">

              <span className="text-muted">
                Already have an account?
              </span>

              <Link
                to="/login"
                className="text-decoration-none ms-2"
              >
                Sign in
              </Link>

            </div>

          </div>

        </div>

        <div className="col-lg-7 p-0">

          <img
            src={img}
            alt="Register"
            className="w-100 h-100"
            style={{
              objectFit: 'cover'
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;