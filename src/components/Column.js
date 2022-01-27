import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";

const Column = ({ column, tasks, index, add, updateTitle }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [titleInput, setTitleInput] = useState(column.title);
  const [openTitle, setOpenTitle] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    add(input, column.id);
    setOpen(false);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    updateTitle(titleInput, column.id);
    setOpenTitle(false);
  };
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="column"
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          {openTitle && (
            <form onSubmit={handleTitleSubmit}>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
              />
            </form>
          )}
          {!openTitle && (
            <div onClick={() => setOpenTitle(true)} className="title">
              {column.title}
            </div>
          )}
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                className="task-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    index={index}
                    open={open}
                    setOpen={setOpen}
                  />
                ))}
                {provided.placeholder}
                <div>
                  {open && (
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <button>Add</button>
                    </form>
                  )}
                </div>
                {!open && (
                  <button onClick={() => setOpen(true)}> + Add a card</button>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
