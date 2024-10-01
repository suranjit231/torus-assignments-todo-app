import { FaClock, FaStar, FaEdit, FaTrash,FaUser } from "react-icons/fa";
import { FaLessThan, FaGreaterThan } from "react-icons/fa";
import styles from "./TaskPage.module.css";
import { authSelector } from "../../redux/authReducer";
import { useSelector, useDispatch } from "react-redux";
import {  taskSelector, deleteTaskApiAsync,
   updateTaskStatusAsync, taskActions } from "../../redux/taskReducer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { setError, clearError, errorSelector } from "../../redux/errorReducer";
import { Link } from "react-router-dom";
import ErrorToast from "../../components/error/ErrorToast";



export default function TaskPage() {
  const { user } = useSelector(authSelector);
  const { tasks } = useSelector(taskSelector);
  const { errorMessage } = useSelector(errorSelector);
  const dispatch = useDispatch();

  const [selectedTaskId, setSelectedTaskId] = useState(null);
 
 // console.log("tasks: ", tasks)

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

  

  useEffect(()=>{
   async function fetchTask(){
      try{
        let fetchUrl = user?.role==="admin"?"getTaskByAdmin":"getTaskByUsers";
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/${fetchUrl}`,
          {withCredentials:true});

          dispatch(taskActions.setInitialTask(res.data.tasks))

      }catch(error){
        dispatch(setError(error.response.data.message))

      }}

    fetchTask();

  },[dispatch])

 



  // Helper function to render status icon and style dynamically
  const renderStatusIcon = (status) => {
    switch (status) {
      case "to-do":
        return <FaClock className={styles.statusIcon} style={{ color: "blue" }} title="To-do" />;
      case "in progress":
        return <FaClock className={styles.statusIcon} style={{ color: "orange" }} title="In Progress" />;
      case "completed":
        return <FaClock className={styles.statusIcon} style={{ color: "green" }} title="Completed" />;
      default:
        return null;
    }
  };

  // Helper function to render priority icon and style dynamically
  const renderPriorityIcon = (priority) => {
    switch (priority) {
      case "low":
        return <FaStar className={styles.statusIcon} style={{ color: "green" }} title="Low Priority" />;
      case "medium":
        return <FaStar className={styles.statusIcon} style={{ color: "yellow" }} title="Medium Priority" />;
      case "high":
        return <FaStar className={styles.statusIcon} style={{ color: "red" }} title="High Priority" />;
      default:
        return null;
    }
  };

  //=========== Function to handle status update ==============//
  const handleStatusUpdate = (taskId, newStatus) => {
    setSelectedTaskId(null); // Close the dropdown after selecting
    dispatch(updateTaskStatusAsync({ taskId, status: newStatus }));  
  };

  //========== handle click delete tasks =====================//
  async function handleClickDeleteTask(taskId){
      const result = await dispatch(deleteTaskApiAsync({taskId:taskId}));
      if(result.type === "task/deleteTask/fulfilled"){
        toast.success("task is deleted!");
      }

  }

  return (
    <>

    { tasks.length<1 ? ( <ErrorToast />):(



    
    <div className={styles.taskPageContainer}>
      {tasks.map((task) => (
        <div key={task._id} className={styles.taskBox}>
          <div className={styles.taskHeadingSec}>
            <h2>{task.title}</h2>
            <p>{new Date(task.dueDate).toLocaleDateString()}</p>
          </div>

          <div className={styles.taskStatusSec}>
            <p onClick={() => setSelectedTaskId(task._id === selectedTaskId ? null : task._id)}>
              {renderStatusIcon(task.status)} {task.status}
            </p>

            {/* Dropdown to select task status */}
            {selectedTaskId === task._id && (
              <div className={styles.statusDropdown}>
                <ul>
                  <li onClick={() => handleStatusUpdate(task._id, 'to-do')}>To-do</li>
                  <li onClick={() => handleStatusUpdate(task._id, 'in progress')}>In Progress</li>
                  <li onClick={() => handleStatusUpdate(task._id, 'completed')}>Completed</li>
                </ul>
              </div>
            )}

            <p>{renderPriorityIcon(task.priority)} {task.priority}</p>
            <p>
              <FaUser className={styles.statusIcon} />
              {user.role === "admin" ? `Assigned to ${task.assignedUser.name}` : `Assigned by ${task.adminUser.name}`}
            </p>
          </div>

          <p className={styles.taskDescriptions}>{task.description}</p>

          { user.role==="admin" && <div className={styles.taskActionSec}>

            <Link to={`/tasks/edit-task/${task._id}`}>
              <FaEdit 
              className={styles.actionIcon} title="Edit Task" />
            </Link>

            <FaTrash onClick={()=>handleClickDeleteTask(task._id)}
             className={styles.actionIcon} title="Delete Task" />

          </div>}


        </div>
      ))}

      <div className={styles.paginationControle}>
        <span><FaLessThan /></span>
        <span className={styles.activePage}>1</span>
        <span>/</span>
        <span>10</span>
        <span><FaGreaterThan /></span>
      </div>
    </div>
) }
   
 </> );
}



