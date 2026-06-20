import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path='/login'
          element={<LoginPage />}
        />
        <Route path='/register'
          element={<RegisterPage />}
        />
        <Route path='/users'
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;