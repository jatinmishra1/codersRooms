import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Authenticate from "./pages/Authenticate/Authenticate";
import { Children } from "react";
import Activate from "./pages/Activate/Activate";
import Room from "./pages/Room/Room";
import { UseSelector, useSelector } from "react-redux";
// const isAuth = !true;
// const user = {
//   activated: !true,
// };

const GuestRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  let location = useLocation();
  return isAuth ? (
    <Navigate to="/rooms" state={{ from: location }} replace />
  ) : (
    children
  );
};
const SemiProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  let location = useLocation();
  return !isAuth ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : isAuth && !user.activated ? (
    children
  ) : (
    <Navigate to="/rooms" state={{ from: location }} replace />
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  let location = useLocation();
  return !isAuth ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" state={{ from: location }} replace />
  ) : (
    children
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          {/* <Route path="/" exact element={<Home />} /> */}
          <Route
            path="/"
            element={
              <GuestRoute>
                <Home />
              </GuestRoute>
            }
          />
          {/* <Route path="/register" exact element={<Register />} />
          <Route path="/login" exact element={<Login />} /> */}
          <Route
            path="/authenticate"
            element={
              <GuestRoute>
                <Authenticate />
              </GuestRoute>
            }
          />
          <Route
            path="/activate"
            element={
              <SemiProtectedRoute>
                <Activate />
              </SemiProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />

          {/* <Route path="/authenticate" exact element={<Authenticate />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
