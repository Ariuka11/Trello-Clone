import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./App.css";
import Column from "./components/Column";
import Navbar from "./components/Navbar";
import initialData from "./data";

const App = () => {
  const [data, setData] = useState(initialData);

  const [input, setInput] = useState("");

  const add = (text, columnId) => {
    const newCardId = "task-5";
    const newCard = {
      id: newCardId,
      content: text,
    };

    const list = data.columns[columnId];
    list.taskIds = [...data.columns[columnId].taskIds, newCardId];

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: list,
      },
      tasks: {
        ...data.tasks,
        [newCardId]: newCard,
      },
    };
    setData(newState);
  };

  const addColumn = (newTitle) => {
    const newId = "column-3";

    const newColumn = {
      id: newId,
      title: newTitle,
      taskIds: [],
    };

    const newState = {
      ...data,
      columnOrder: [...data.columnOrder, newId],
      columns: {
        ...data.columns,
        [newId]: newColumn,
      },
    };
    console.log(newState);
    setData(newState);
  };

  const updateTitle = (newTitle, columnId) => {
    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          title: newTitle,
        },
      },
    };
    setData(newState);
    console.log(newState);
  };

  const deleteTask = (taskId, columnId) => {
    const newData = Object.keys(data.tasks).reduce((acc, key) => {
      if (key !== taskId) {
        acc[key] = data.tasks[key];
      }
      return acc;
    }, {});
    const newArray = data.columns[columnId].taskIds.filter(
      (id) => id !== taskId
    );

    const newState = {
      ...data,
      tasks: newData,
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          taskIds: newArray,
        },
      },
    };
    console.log(newState);
    setData(newState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteTask("task-1", "column-1");
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === "column") {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newData = {
        ...data,
        columnOrder: newColumnOrder,
      };
      setData(newData);
      return;
    }
    const home = data.columns[source.droppableId];
    const foreign = data.columns[destination.droppableId];

    if (home === foreign) {
      const newTaskIds = Array.from(home.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newHome = {
        ...home,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newHome.id]: newHome,
        },
      };

      setData(newData);
      return;
    }

    // moving from one list to another

    const homeTaskIds = Array.from(home.taskIds);
    homeTaskIds.splice(source.index, 1);
    const newHome = {
      ...home,
      taskIds: homeTaskIds,
    };

    const foreignTaskIds = Array.from(foreign.taskIds);
    foreignTaskIds.splice(destination.index, 0, draggableId);
    const newForeign = {
      ...foreign,
      taskIds: foreignTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newHome.id]: newHome,
        [newForeign.id]: newForeign,
      },
    };
    setData(newData);
  };
  return (
    <div className="container">
      <Navbar />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided, snapshot) => (
            <div
              className="column-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.columnOrder.map((columnId, index) => {
                const column = data.columns[columnId];
                const tasks = column.taskIds.map(
                  (taskId) => data.tasks[taskId]
                );
                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>Add</button>
      </form>
    </div>
  );
};

export default App;
