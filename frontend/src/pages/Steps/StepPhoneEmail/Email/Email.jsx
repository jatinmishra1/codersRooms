import React, { useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import Input from "../../../../components/shared/Input/Input";
import styles from "../StepPhoneEmail.module.css";

function Email({ onNext }) {
  const [email, setEmail] = useState("");
  return (
    <>
      <Card title="Enter your Email" icon="Email">
        <Input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div>
          {/* <button>
                <span>Get your Username</span>
                <img src="/images/arrow-frwd.png" alt="arrow" />
              </button> */}
          <div className={styles.actionButtonWrap}>
            <Button onClick={onNext} text="Next"></Button>
          </div>
          <p className={styles.bottomPara}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Necessitatibus error tempore ad veritatis mollitia, natus maiores
            perferendis ad vel corporis?
          </p>
        </div>
      </Card>
    </>
  );
}

export default Email;
