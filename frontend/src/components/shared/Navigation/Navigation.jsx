import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

function Navigation() {
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
  };
  const logoText = {
    marginLeft: "10px",
  };

  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img src="/images/logo2.png" alt="logo" />
        <span style={logoText}>CodersHouse</span>
      </Link>
      {isAuth && (
        <div className={styles.navRight}>
          <h3 style={{ color: "white" }}>{user.name}</h3>
          <Link>
            <img
              className={styles.avatar}
              src={user.avatar ? user.avatar : "/images/emoji.png"}
              width="40px"
              height="40px"
              alt="prfileImg"
            />
            /
          </Link>
          <button className={styles.logoutButton} onClick={logoutUser}>
            Logout
          </button>
        </div>
      )}
      {/* {isAuth && <button onClick={logoutUser}>Logout</button>} */}
    </nav>
  );
}

export default Navigation;
