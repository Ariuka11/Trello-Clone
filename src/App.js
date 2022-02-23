import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./App.scss";
import Column from "./components/Column";
import Navbar from "./components/Navbar";
import initialData from "./data";
import { v4 as uuidv4 } from "uuid";
import ColumnInput from "./components/ColumnInput";
import axios from "axios";

const App = () => {
  const [data, setData] = useState(initialData);
  const [img, setImg] = useState([]);
  const [input, setInput] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetching Image from Unsplash API
  useEffect(() => {
    const fetchImg = async () => {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?page=3&query=${
          input.length > 0 ? input : "office"
        }&client_id=${process.env.REACT_APP_IMG_API}&orientation=landscape`
      );
      console.log(res.data.results);
      setImg(res.data.results);
    };
    fetchImg();
  }, [input]);

  const [divImage, setDivImage] = useState({
    backgroundImage: "url(/venice.jpg)",
  });

  const handleClick = (image) => {
    setDivImage({
      backgroundImage: `url(${image})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    });
    console.log(image);
  };

  // Adding new task
  const addTask = (text, columnId) => {
    const newCardId = uuidv4();
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

  // Adding new Column
  const addColumn = (newTitle) => {
    const newId = uuidv4();

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

  //Updating Column Title
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

  // Removing task from the column
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
    setData(newState);
  };

  const deleteColumn = (columnId) => {
    const newData = Object.keys(data.columns).reduce((acc, key) => {
      if (key !== columnId) {
        acc[key] = data.columns[key];
      }
      return acc;
    }, {});
    const newArray = data.columnOrder.filter((id) => id !== columnId);
    const newState = {
      ...data,
      columns: newData,
      columnOrder: newArray,
    };
    setData(newState);
  };

  // Draggin function

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
    // Changing Column Order
    if (type === "column") {
      const newColumnOrder = Array.from(data?.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newData = {
        ...data,
        columnOrder: newColumnOrder,
      };
      setData(newData);
      return;
    }

    // Changing task order in one column
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

    // Moving task to another column
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
    return;
  };

  // Detecting Click outside the React component
  const reff = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (open && reff.current && !reff.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", checkIfClickedOutside);

    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [open]);

  return (
    <div className="container" style={divImage}>
      <Navbar />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="column-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data &&
                data.columnOrder.map((columnId, index) => {
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
                      updateTitle={updateTitle}
                      addTask={addTask}
                      deleteTask={deleteTask}
                      deleteColumn={deleteColumn}
                    />
                  );
                })}

              {provided.placeholder}
              <ColumnInput addColumn={addColumn} />
              <button onClick={() => setOpen((prev) => !prev)}>
                Change background
              </button>
              {open && (
                <div className="photos" ref={reff}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className="img-container">
                    {img.map((i) => (
                      <img
                        src={i.urls.small}
                        key={i.id}
                        alt={i.alt_description}
                        onClick={() => handleClick(i.urls.full)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
