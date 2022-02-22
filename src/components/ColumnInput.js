import React, { useState } from "react";
import useVisible from "../utils/useVisible";

const Input = ({ addColumn }) => {
  const [input, setInput] = useState("");
  const { ref, isVisible, setIsVisible } = useVisible(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addColumn(input);
    setInput("");
  };

  return (
    <div className="columnInput">
      {isVisible && (
        <form onSubmit={handleSubmit} ref={ref}>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button>Add</button>
        </form>
      )}
      {!isVisible && (
        <button
          className="columnButton"
          onClick={() => setIsVisible(!isVisible)}
        >
          + Create New List
        </button>
      )}
    </div>
  );
};

export default Input;
