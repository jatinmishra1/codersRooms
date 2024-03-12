import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import Input from "../../../components/shared/Input/Input";
import { useSelector, useDispatch } from "react-redux";
import { setName } from "../../../store/activateSlice";
import styles from "./StepName.module.css";
function StepName({ onNext }) {
  const { name } = useSelector((state) => state.activate);
  const [fullName, setFullName] = useState(name);
  const dispatch = useDispatch();
  function nextStep() {
    if (!fullName) {
      return;
    }
    dispatch(setName(fullName));
    onNext();
  }
  return (
    <>
      <Card title="Whats your Full fullName" icon="emoji">
        <Input
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
          }}
        />
        <div>
          {/* <button>
            <span>Get your Username</span>
            <img src="/images/arrow-frwd.png" alt="arrow" />
          </button> */}

          <p className={styles.paragraph}>
            People use Real fullName at Coders Room
          </p>
          <div className={styles.actionButtonWrap}>
            <Button onClick={nextStep} text="Next"></Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default StepName;
