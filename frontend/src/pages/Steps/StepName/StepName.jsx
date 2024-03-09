import React from "react";

function StepName({ onNext }) {
  return (
    <>
      <div>Name comp</div>
      <button onClick={onNext}>Next</button>
    </>
  );
}

export default StepName;
