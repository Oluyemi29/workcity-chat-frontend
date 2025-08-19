import { useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import userAuth from "./store/userAuth";
import Loading from "./components/Loading";

function App() {
  const { CheckIsActive, isLogginActive, isCheckingLogin } = userAuth();

  useEffect(() => {
    CheckIsActive();
  }, [CheckIsActive]);
  if (isCheckingLogin && !isLogginActive) {
    return (
      <div className="w-full">
        <Loading />
      </div>
    );
  }
  return (
    <Routes>
      <Route
        element={!isLogginActive ? <Register /> : <Navigate to="/dashboard" />}
        path="/"
      />
      <Route
        element={!isLogginActive ? <Login /> : <Navigate to="/dashboard" />}
        path="/login"
      />
      <Route
        path="/dashboard"
        element={isLogginActive ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
