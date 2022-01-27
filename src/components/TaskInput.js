import React, { useState } from "react";
import useVisible from "../utils/useVisible";

const TaskInput = ({ addTask, column }) => {
  const [input, setInput] = useState("");
  const { ref, isVisible, setIsVisible } = useVisible(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(input, column.id);
    setInput("");
    setIsVisible(false);
  };

  return (
    <div className="taskInput">
      {isVisible && (
        <form onSubmit={handleSubmit} ref={ref}>
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button>Add</button>
        </form>
      )}
      {!isVisible && (
        <button className="taskButton" onClick={() => setIsVisible(!isVisible)}>
          + Add task
        </button>
      )}
    </div>
  );
};

export default TaskInput;
