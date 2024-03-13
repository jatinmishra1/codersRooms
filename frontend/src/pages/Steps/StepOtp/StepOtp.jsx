import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Input from "../../../components/shared/Input/Input";
import styles from "./StepOtp.module.css";
import Button from "../../../components/shared/Button/Button";
import { verifyOtp } from "../../../http";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";

function StepOtp({ onNext }) {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { phone, hash } = useSelector((state) => state.auth.otp);
  async function submit() {
    if (!otp || !phone || !hash) return;
    try {
      const { data } = await verifyOtp({ otp, phone, hash });
      console.log(data);
      dispatch(setAuth(data));
    } catch (e) {
      console.log(e);
    }
    // onNext()
  }
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we jsut send" icon="Lock">
          <Input
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
          <div>
            {/* <button>
            <span>Get your Username</span>
            <img src="/images/arrow-frwd.png" alt="arrow" />
          </button> */}
            <div className={styles.actionButtonWrap}>
              <Button onClick={submit} text="Next"></Button>
            </div>
            <p className={styles.bottomPara}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Necessitatibus error tempore ad veritatis mollitia, natus maiores
              perferendis ad vel corporis?
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

export default StepOtp;
