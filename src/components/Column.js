import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import TaskInput from "./TaskInput";
import TitleInput from "./TitleInput";

const Column = ({ column, tasks, index, addTask, updateTitle }) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="column"
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <TitleInput
            updateTitle={updateTitle}
            column={column}
            className="title"
          />
          <Droppable droppableId={column.id}>
            {(provided) => (
              <div
                className="task-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
                <TaskInput column={column} addTask={addTask} />
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
