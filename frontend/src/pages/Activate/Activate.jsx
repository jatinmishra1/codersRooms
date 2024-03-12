import React, { useState } from "react";
import StepAvatar from "../Steps/StepAvatar/StepAvatar";
import StepName from "../Steps/StepName/StepName";

const steps = {
  1: StepName,
  2: StepAvatar,
};

function Activate() {
  function onNext() {
    setStep(step + 1);
  }

  const [step, setStep] = useState(1);
  const Step = steps[step];
  return (
    <div className="cardWrapper">
      <Step onNext={onNext}></Step>
    </div>
  );
}

export default Activate;
