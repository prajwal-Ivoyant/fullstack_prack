import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/authPage";
import Posts from "./components/Posts";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/posts"
          element={token ? <Posts /> : <Navigate to="/login" />}
        />

        <Route
          path="*"
          element={<Navigate to={token ? "/posts" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;