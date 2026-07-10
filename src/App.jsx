import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Container } from "./components";
import aniloader from "./assets/aniloader.gif";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className="w-full block text-center">
        <Header />
        <main>
          <p className="mt-4 text-2xl font-bold">{userData && `Welcome, ${userData.name} `} </p>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <Container>
      {" "}
      <img className="mx-auto" src={aniloader} alt="Loading..." />{" "}
    </Container>
  );
}

export default App;
