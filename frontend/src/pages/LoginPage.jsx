import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import img from '../assets/geometricImg.jpg';
import useMessage from "../hooks/useMessage";

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const { message, messageType, showMessage } = useMessage();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('verified')) {
      showMessage(
        'Account verified successfully. Please sign in.',
        'success'
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responce = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password
        }
      );

      localStorage.setItem(
        'token',
        responce.data.token
      );

      navigate('/users');
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
        'Login failed',
        'danger'
      );

      console.log(error);
    }
  };

  return (
    <div className="container-fluid p-0">

      <div className="row min-vh-100 g-0">

        <div className="col-lg-5 d-flex justify-content-center align-items-center">

          <div className="card shadow border-0 p-5"
            style={{
              width: '100%',
              maxWidth: '550px'
            }}
          >

            <div className="card-body">

              <div className="text-center mb-4">

                <h1 className="fw-bold">
                  User Management System
                </h1>

                <p className="text-muted">
                  Start your journey
                </p>

              </div>

              {message && (
                <div className={`alert alert-${messageType}`} role='alert'> {message} </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">

                  <input
                    className="form-control"
                    type="email"
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
                    className="form-control"
                    type="password"
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
                  className="btn btn-primary w-100"
                >
                  Login
                </button>

              </form>

              <div className="d-flex justify-content-between mt-3">
                <div><p>Don't have an account?
                  <Link
                    to="/register"
                    className="text-decoration-none ms-2"
                  >
                    Sign up
                  </Link>
                </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="col-lg-7 p-0">

          <img
            src={img}
            alt="Login"
            className="w-100 h-100"
            style={{
              objectFit: 'cover'
            }}
          />

        </div>

      </div>

    </div>
  );
};

export default LoginPage;