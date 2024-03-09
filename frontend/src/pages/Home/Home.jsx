import React from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

function Home() {
  const signInLinkStyle = {
    color: "#0077ff",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "10px",
  };
  const navigate = useNavigate();
  function startRegister() {
    console.log("button clicked");
    navigate("/register");
  }

  return (
    <div className={styles.cardWrapper}>
      <Card title="welcome to coders house" icon="logo2">
        <p className={`${styles.text}`}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam minus
          quia veniam consequuntur labore neque dolor obcaecati! Nam, corrupti
          aut. Repellendus non neque similique necessitatibus excepturi eius
          quidem delectus minima!
        </p>
        <div>
          {/* <button>
            <span>Get your Username</span>
            <img src="/images/arrow-frwd.png" alt="arrow" />
          </button> */}
          <Button onClick={startRegister} text="Get your Username"></Button>
        </div>
        <div className={styles.signinWrapper}>
          <span className={styles.hasInvite}>Have an invite text?</span>
          <Link style={signInLinkStyle} to="/login">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Home;
