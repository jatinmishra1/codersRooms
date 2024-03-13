import React, { useState } from "react";
import Button from "../../../../components/shared/Button/Button";
import Card from "../../../../components/shared/Card/Card";
import Input from "../../../../components/shared/Input/Input";
import styles from "../StepPhoneEmail.module.css";
import { sendOtp } from "../../../../http";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";

function Phone({ onNext }) {
  const [phoneNumber, setPhoneNumber] = useState();
  const dispatch = useDispatch();
  const submit = async () => {
    if (!phoneNumber) return;
    const { data } = await sendOtp({ phone: phoneNumber });
    console.log(data);
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    onNext();
  };

  return (
    <>
      <Card title="Enter your Phone Number" icon="Phone">
        <Input
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
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
    </>
  );
}

export default Phone;
