import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import styles from "./AddTask.module.css"; // Same styling as AddTask
import { errorSelector, clearError, setError } from "../../redux/errorReducer";
import { authSelector } from "../../redux/authReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import { updateTaskApiAsync } from "../../redux/taskReducer"; 

export default function EditTask() {
  const { taskId } = useParams(); // Get the taskId from the URL
  const { user } = useSelector(authSelector); // Current logged-in user (adminUser)
  const { loading } = useSelector(loadingSelector);
  const { errorMessage } = useSelector(errorSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("to-do");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [users, setUsers] = useState([]);

  //===== show error toast ========//
  useEffect(() => {
    if (errorMessage) {
      if (!toast.isActive('errorToast')) {
        toast.error(errorMessage, { toastId: 'errorToast' });
      }
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, dispatch]);

  //====== fetch task by taskId and pre-populate fields =====//
  useEffect(() => {
    async function fetchTask() {
      try {
        console.log("editable taskId: ", taskId);
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/taskById/${taskId}`,
          { withCredentials: true }
        );
        if (res.data) {
          const task = res.data.task;
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
          setPriority(task.priority);
          setDueDate(task.dueDate.split('T')[0]); // Format the date to yyyy-mm-dd
          setAssignedUser(task.assignedUser._id); // Assuming task.assignedUser is an object
        }
      } catch (error) {
        dispatch(setError(error.response?.data?.message || "Error fetching task"));
      }
    }

    fetchTask();
  }, [taskId, dispatch]);

  //====== fetch all users list for assigning =====//
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/getUsers`, { withCredentials: true });
        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          toast.error("No users are available to assign the task");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching users");
      }
    }

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !assignedUser) {
      toast.error("Please fill all required fields");
      return;
    }

    const updatedTask = {
      adminUser: user._id,
      assignedUser,
      title,
      description,
      status,
      priority,
      dueDate,
    };

    const result = await dispatch(updateTaskApiAsync({ taskId, updatedTask }));
    console.log("result for update task: ", result);

    if (result.type === "/task/updateTodoApi/fulfilled") {
      toast.success("Task updated successfully!");
      navigate(`/tasks/${user._id}`);
    }
  };

  return (
    <div className={styles.addTaskFormPageContainer}>
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit} className={styles.addTaskForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="to-do">To-do</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="assignedUser">Assign To</label>
          <select
            id="assignedUser"
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button disabled={loading} className={styles.submitButton}>
          {loading ? <ClipLoader size={15} color={"#fff"} /> : "Update Task"}
        </button>
      </form>
    </div>
  );
}
