import { useState } from "react";

function App() {
  const [columns,setColumns] = useState({
    todo:{
      name:"To Do",
      items:[
        {id:"1",content:"Assignment"},
        {id:"2",content:"porjects work"},
      ]
    },
    inProgress:{
      name:"In Progress",
      items:[
        {id:"3",content:"discussing with team"},
        
      ]
    },
    done:{
      name:"Done",
      items:[
        {id:"4",content:"completed assignment"},
      ]
    }
  })
  const [newTask,setNewTask] = useState("");
  const [activeColumn, setActiveColumn] = useState<keyof typeof columns>("todo");
  const [draggedItem,setDraggedItem] = useState<{
    columnId: keyof typeof columns;
    item: { id: string; content: string };
  } | null>(null);
  const addNewTask = () =>{
    if(newTask.trim() === "") return;
    const updatedColumns = {...columns};

    updatedColumns[activeColumn].items.push({
      id:Date.now().toString(),
      content:newTask,
    });
    setColumns(updatedColumns);
    setNewTask("");
  };
  const removeTask = (columnId: keyof typeof columns, taskId: string) =>{
    const updatedColumns = {...columns};
    updatedColumns[columnId].items =
    updatedColumns[columnId].items.filter(
      (item) => item.id !== taskId
    );
    setColumns(updatedColumns);
  };

  const handleDragover = (e: any, targetcolumnId: keyof typeof columns) => {
    e.preventDefault();
  }
  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-blue-100 to-blue-700",
      border: "border-black",
    },
    inProgress: {
      header: "bg-gradient-to-r from-yellow-100 to-yellow-500",
      border: "border-black",
    },
    done: {
      header: "bg-gradient-to-r from-green-100 to-green-700",
      border: "border-black",
    },
  };

  const handleDrop = (e: any, targetcolumnId: keyof typeof columns) => {
    e.preventDefault();
    if (!draggedItem) return;
    const { columnId: sourceColumnId, item } = draggedItem;
    if (sourceColumnId === targetcolumnId) return;
    const updatedColumns = { ...columns };

    updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter(
      (i) => i.id !== item.id
    );
    updatedColumns[targetcolumnId].items.push(item);
    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  return (
    <div className="p-4  w-full min-h-screen bg-gradient-to-b from-olive-200 to-blue-100 justify-between flex items-center justify-center">
      <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-black">KANBAN BOARD</h1>
        <div className="bg-blue-200 mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder=" Add a new task..."
            className="flex-grow p-3 bg-white text-black border-black"
            onKeyDown={(e) => e.key === "Enter" && addNewTask()}
          />
          <select
            value={activeColumn}
            onChange={(e) => setActiveColumn(e.target.value as keyof typeof columns)}
            className="p-3 bg-gradient-to-r from-orange-200 to-orange-500 hover:from-red-500 hover:to-pink-300 text-black border-0 border-l border-zinc-600 cursor-pointer"
          >
            <option value= "todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button
            onClick={addNewTask}
            className="px-6 bg-gradient-to-r from-blue-600 to-purple-500 text-black font-medium hover:from-red-500 hover:to-pink-300 transition-all duration-200 cursor-pointer"
          >
            Add
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 w-full">
          {(Object.keys(columns) as Array<keyof typeof columns>).map((columnId) => (
            <div
              key={columnId}
              className={`flex-shrink-0 w-80 bg-gradient-to-r from-zinc-500 to-brown-400 rounded-lg shadow-lg border-t-4 ${columnStyles[columnId].border}`}
              onDragOver={(e) => handleDragover(e, columnId)}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className={`p-4 text-black font-bold text-xl rounded-t-md flex items-center justify-between  ${columnStyles[columnId].header}`}>
                {columns[columnId].name}
              </div>

              <div className="p-4">
                {columns[columnId].items.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggedItem({ columnId, item })}
                    className="mb-3 p-3 bg-gradient-to-r from-indigo-400 to-yellow-200 text-black rounded shadow cursor-pointer flex justify-between items-center"
                  >
                    <span>{item.content}</span>
                    <button
                      onClick={() => removeTask(columnId, item.id)}
                      className="ml-2 text-red-500"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;

