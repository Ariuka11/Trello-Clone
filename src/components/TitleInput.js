import React, { useState } from "react";
import useVisible from "../utils/useVisible";

const TitleInput = ({ updateTitle, column }) => {
  const [input, setInput] = useState(column.title);
  const { ref, isVisible, setIsVisible } = useVisible(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTitle(input, column.id);
    setInput("");
    setIsVisible(false);
  };

  return (
    <div className="titleInput">
      {isVisible && (
        <form onSubmit={handleSubmit} ref={ref}>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
        </form>
      )}
      {!isVisible && (
        <div onClick={() => setIsVisible(!isVisible)} className="title">
          {column.title}
        </div>
      )}
    </div>
  );
};

export default TitleInput;
