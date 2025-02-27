import "./index.css";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/Dashboard/User";
import Admin from "./pages/Dashboard/Admin";
import ProtectedRoute from "./middlewares/ProtectedRoutes";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import Adopt from "./pages/Adopt";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import PetPage from "./pages/PetPage";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Landing />} />
          <Route element={<ProtectedRoute allowedRoles={"user"} />}>
            <Route path="/user-dashboard" element={<User />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={"admin"} />}>
            <Route path="/admin-dashboard" element={<Admin />} />
          </Route>
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/adopt/pets/:id" element={<PetPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
