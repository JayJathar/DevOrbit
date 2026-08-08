import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

import Welcome from "./Pages/Welcome/Welcome";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Forgotpassword from "./Pages/Forgotpassword/Forgotpassword";
import Home from "./Pages/Home/Home";
import Explore from "./Pages/Explore/Explore";
import NotFound from "./Pages/NotFound/NotFound";
import ResetPassword from "./Pages/Resetpassword/Restpassword";

import ProtectedRoute from "./components/Navbar/ProtectedRoute/ProtectedRoute";

function App() {
  const location = useLocation();

  const showNavbar = ["/Home", "/Explore"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Forgotpassword" element={<Forgotpassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
