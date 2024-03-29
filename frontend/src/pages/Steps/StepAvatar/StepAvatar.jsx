import React, { useEffect, useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepAvatar.module.css";
import { UseSelector, useSelector, useDispatch } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";
import { useNavigate } from "react-router-dom";
function StepAvatar({ onNext }) {
  const navigate = useNavigate();
  const { name, avatar } = useSelector((state) => state.activate);
  const [unMounted, setUnMounted] = useState(false);
  const [image, setImage] = useState("/images/man2.png");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
    console.log(e);
  }
  async function submit() {
    if (!avatar || !name) return;
    setLoading(true);
    try {
      console.log("here  is the name and avatar ", name, avatar);
      const { data } = await activate({ name, avatar });
      if (data.auth) {
        dispatch(setAuth(data));
        // navigate("/rooms");
      }
      console.log(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }
  // useEffect(() => {
  //   return () => {
  //     setUnMounted(true);
  //   };
  // }, []);

  if (loading) {
    return <Loader message="Activation in Progress" />;
  }
  return (
    <>
      <Card title={`okay, ${name} how's it`} icon="man">
        <p className={styles.subHeading}>How's this photo</p>
        <div className={styles.avatarWrapper}>
          <img className={styles.imageAvatar} src={image} alt="image" />
        </div>
        <div>
          <input
            onChange={captureImage}
            id="avatarInput"
            type="file"
            className={styles.avatarInput}
          />
          <label className={styles.avatarLabel} htmlFor="avatarInput">
            Choose a different Photo
          </label>
        </div>
        <div className={styles.actionButtonWrap}>
          <Button onClick={submit} text="Next"></Button>
        </div>
      </Card>
    </>
  );
}

export default StepAvatar;
