import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Todo = () => {
  // This state stores tasks grouped by category
  const [columns, setColumns] = useState({
    todo: [],
    inprogress: [],
    done: [],
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/tasks");
      return res.data;
    },
  });

  // When tasks are fetched, group them into columns based on their category.
  useEffect(() => {
    if (tasks) {
      const grouped = { todo: [], inprogress: [], done: [] };
      tasks.forEach((task) => {
        // Normalize the category if needed; default to "todo"
        const cat =
          task.category && typeof task.category === "string"
            ? task.category.toLowerCase()
            : "todo";
        if (cat === "todo" || cat === "to-do") {
          grouped.todo.push(task);
        } else if (cat === "inprogress" || cat === "in progress") {
          grouped.inprogress.push(task);
        } else if (cat === "done") {
          grouped.done.push(task);
        }
      });
      // Sort each column by the task order
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => a.order - b.order);
      });
      setColumns(grouped);
    }
  }, [tasks]);

  // Handle drag end events: update columns and then notify the backend.
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Copy the current state
    const newColumns = { ...columns };
    // Get source and destination lists (make a shallow copy)
    const sourceList = Array.from(newColumns[source.droppableId]);
    const destinationList =
      source.droppableId === destination.droppableId
        ? sourceList
        : Array.from(newColumns[destination.droppableId]);

    // Remove the dragged item from its source list
    const [movedItem] = sourceList.splice(source.index, 1);

    // If moving between columns, update the category on the task
    if (source.droppableId !== destination.droppableId) {
      movedItem.category = destination.droppableId;
    }
    // Insert it into the destination list at the new index
    destinationList.splice(destination.index, 0, movedItem);

    // Reassign order for each item in the updated lists
    const updatedSourceList = sourceList.map((item, index) => ({
      ...item,
      order: index,
    }));
    const updatedDestinationList = destinationList.map((item, index) => ({
      ...item,
      order: index,
    }));

    // Update the new columns state with the updated lists
    newColumns[source.droppableId] = updatedSourceList;
    newColumns[destination.droppableId] = updatedDestinationList;

    setColumns(newColumns);

    // Prepare an array of updated tasks from both affected columns
    const updatedTasks =
      source.droppableId === destination.droppableId
        ? updatedSourceList
        : [...updatedSourceList, ...updatedDestinationList];

    // Send the updated tasks (their order and category) to the backend.
    try {
      await axios.put("http://localhost:5000/tasks/update-order", {
        tasks: updatedTasks.map(({ _id, order, category }) => ({
          _id,
          order,
          category,
        })),
      });
    } catch (error) {
      console.error("Failed to update tasks:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-bold mb-4">ALL TASKS</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {Object.keys(columns).map((columnId) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded-md flex-1 min-h-[300px]"
                >
                  <h3 className="text-center capitalize mb-2">
                    {columnId === "inprogress" ? "In Progress" : columnId}
                  </h3>
                  {columns[columnId].map((item, index) => (
                    <Draggable
                      key={item._id.toString()}
                      draggableId={item._id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="cursor-grab rounded-md border bg-white p-4 mb-2"
                        >
                          <div className="flex items-center space-x-4">
                            <span>{item.order}</span>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {item.title}
                              </span>
                              <span className="text-sm text-gray-600">
                                {item.description}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Todo;
