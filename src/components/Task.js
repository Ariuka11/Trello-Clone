import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Task = ({ index, task, deleteTask, columnId }) => {
  const handleClick = (e) => {
    e.preventDefault();
    deleteTask(task.id, columnId);
  };
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div>{task.content}</div>
          <span onClick={handleClick}>X</span>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
