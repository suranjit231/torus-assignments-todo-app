import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AddTask.module.css";
import { errorSelector, clearError } from "../../redux/errorReducer";
import { authSelector } from "../../redux/authReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import { toast } from "react-toastify";
import axios from "axios";
import { addTaskApiAsync } from "../../redux/taskReducer";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";


export default function AddTaskForm() {
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
  



  //====== fetch all the users list =====//
  useEffect(()=>{
    async function fetchUsers(){
      try{
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/getUsers`, {withCredentials:true});
        if(res.data.success){
          setUsers([...res.data.users]);

        }else{
          toast.error("No users is available to assign task");
          setUsers([]);
        }

      }catch(error){
        return toast.error(error.response.data.message);

      }}

    fetchUsers();

  },[])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate || !assignedUser) {
      toast.error("Please fill all required fields");
      return;
    }

    const taskData={adminUser: user._id,assignedUser, title, description, status, priority,dueDate};
    const result = await dispatch(addTaskApiAsync(taskData));
   
    if(result.type === "task/addTaskApi/fulfilled"){
      toast.success("Task created successfully!");
      navigate(`/tasks/${user._id}`)


    }
};




  return (
    <div className={styles.addTaskFormPageContainer}>
      <h2>Add New Task</h2>
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
            {loading ? <ClipLoader size={15} color={"#fff"} /> : "Add Task" }
        </button>


      </form>
    </div>
  );
}
