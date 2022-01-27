import React, { useState } from "react";
import useVisible from "../utils/useVisible";

const Input = ({ addColumn }) => {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const { ref, isVisible, setIsVisible } = useVisible(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    addColumn(input);
    setOpen(false);
    setInput("");
  };

  return (
    <div>
      {isVisible && (
        <form onSubmit={handleSubmit} ref={ref}>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button>Add</button>
        </form>
      )}
      {!isVisible && (
        <button
          onClick={() => setOpen((currentOpen) => !currentOpen)}
          onClick={(e) => setIsVisible(!isVisible)}
        >
          + Add another list
        </button>
      )}
    </div>
  );
};

export default Input;
