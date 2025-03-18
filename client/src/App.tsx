import "./index.css";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./middlewares/ProtectedRoutes";
import Adopt from "./pages/Adopt";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import PetPage from "./pages/PetPage";
import Favorite from "./pages/Favorite";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import UserLayout from "./components/Layout/UserLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import AddProduct from "./pages/Admin/AddProducts";

axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Landing />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorite />} />
          </Route>
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/adopt/pets/:id" element={<PetPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AddProduct />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
