import React, { useState, useEffect, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AuthContext from "../../Provider/AuthContext";
import { Modal, Button, Form, Input, Select } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";

const { Option } = Select;

const Todo = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // State for add and edit modals
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // This state stores tasks grouped by category
  const [columns, setColumns] = useState({
    todo: [],
    inprogress: [],
    done: [],
  });

  // Fetch tasks using React Query
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/tasks");
      return res.data;
    },
  });

  // Group tasks into columns based on category when data is fetched
  useEffect(() => {
    if (tasks) {
      const grouped = { todo: [], inprogress: [], done: [] };
      tasks.forEach((task) => {
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

  // Handle drag and drop events (order/category update)
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const newColumns = { ...columns };
    const sourceList = Array.from(newColumns[source.droppableId]);
    const destinationList =
      source.droppableId === destination.droppableId
        ? sourceList
        : Array.from(newColumns[destination.droppableId]);

    // Remove the dragged item from its source list
    const [movedItem] = sourceList.splice(source.index, 1);
    // If moving between columns, update its category
    if (source.droppableId !== destination.droppableId) {
      movedItem.category = destination.droppableId;
    }
    // Insert it into the destination list at the new index
    destinationList.splice(destination.index, 0, movedItem);

    // Update order for each item in the affected lists
    const updatedSourceList = sourceList.map((item, index) => ({
      ...item,
      order: index,
    }));
    const updatedDestinationList = destinationList.map((item, index) => ({
      ...item,
      order: index,
    }));

    newColumns[source.droppableId] = updatedSourceList;
    newColumns[destination.droppableId] = updatedDestinationList;
    setColumns(newColumns);

    // Combine the updated tasks and send them to the backend
    const updatedTasks =
      source.droppableId === destination.droppableId
        ? updatedSourceList
        : [...updatedSourceList, ...updatedDestinationList];

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

  // Add Task modal handlers
  const showAddModal = () => setIsAddModalVisible(true);
  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
  };

  const handleAddTask = async (values) => {
    const newTask = {
      uid: user.uid,
      title: values.title,
      description: values.description,
      category: values.category,
      order: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5000/tasks", newTask);
      queryClient.invalidateQueries(["tasks"]);
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // Edit Task modal handlers
  const showEditModal = (task) => {
    setCurrentTask(task);
    setIsEditModalVisible(true);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      category: task.category,
    });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setCurrentTask(null);
    editForm.resetFields();
  };

  const handleEditTask = async (values) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${currentTask._id}`, {
        title: values.title,
        description: values.description,
        category: values.category,
      });
      queryClient.invalidateQueries(["tasks"]);
      setIsEditModalVisible(false);
      setCurrentTask(null);
      editForm.resetFields();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // Delete task handler
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      queryClient.invalidateQueries(["tasks"]);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-center text-2xl font-bold">ALL TASKS</h2>
      <Button type="primary" onClick={showAddModal} className="mb-4">
        Add Task
      </Button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {Object.keys(columns).map((columnId) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[300px] flex-1 rounded-md bg-gray-100 p-4"
                >
                  <h3 className="mb-2 text-center capitalize">
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
                          className="mb-2 flex items-center justify-between cursor-grab rounded-md border bg-white p-4"
                        >
                          <div className="flex items-center space-x-4">
                            <span>{item.order + 1}</span>
                            <div className="flex flex-col">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-sm text-gray-600">
                                {item.description}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => showEditModal(item)}
                              className="text-blue-500 hover:text-blue-700 cursor-pointer p-2"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(item._id)}
                              className="text-red-500 hover:text-red-700 cursor-pointer p-2"
                            >
                              <FaTrash />
                            </button>
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

      {/* Add Task Modal */}
      <Modal
        title="Add Task"
        visible={isAddModalVisible}
        onCancel={handleAddCancel}
        footer={null}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddTask}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the task title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the task description" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            initialValue="todo"
            rules={[
              { required: true, message: "Please select the task category" },
            ]}
          >
            <Select>
              <Option value="todo">To-Do</Option>
              <Option value="inprogress">In Progress</Option>
              <Option value="done">Done</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditTask}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the task title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the task description" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              { required: true, message: "Please select the task category" },
            ]}
          >
            <Select>
              <Option value="todo">To-Do</Option>
              <Option value="inprogress">In Progress</Option>
              <Option value="done">Done</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Todo;
