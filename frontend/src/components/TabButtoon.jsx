import React from "react";

function MyButton({ onClick, children}) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

export default MyButton;
