import './index.css';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router';
import Landing from './pages/Landing';
import LoadingPage from './components/LoadingPage/LoadingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import User from './pages/Dashboard/User';
import Admin from './pages/Dashboard/Admin';
import ProtectedRoute from './middlewares/ProtectedRoutes';
import ClearCookie from './middlewares/ClearCookie';
import LayoutWithNavbar from './components/LayoutWithNavbar';
import { useEffect, useState } from 'react';
import Adopt from './pages/Adopt';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
axios.defaults.withCredentials = true;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Wait until the main content is fully rendered
    const handleContentLoaded = () => {
      setTimeout(() => setIsLoading(false), 500); // Remove LoadingPage after animation
      setFadeOut(true);
    };

    requestAnimationFrame(() => {
      setTimeout(handleContentLoaded, 100);
    });

    return () => {};
  }, []);

  return (
    <>
    <Toaster position='bottom-left' toastOptions={{duration: 2000}} />
    {isLoading? (<LoadingPage fadeOut={fadeOut} />) : (
      <>
        <ClearCookie />
        <Routes>
          <Route element={<LayoutWithNavbar />}>
            <Route path="/" element={<Landing />}/>
            <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
              <Route path="/user-dashboard" element={<User />}/>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin-dashboard" element={<Admin />}/>
            </Route>
            <Route path="/adopt" element={<Adopt />}/>
            <Route path="/shop" element={<Shop/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
          </Route>
        </Routes>
        </>
    ) }
    
    </>
  )
}

export default App
