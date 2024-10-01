import styles from "./SideBar.module.css";
import { FaUserCircle,FaClock, FaSpinner, FaCheckCircle,FaStar, FaSignOutAlt, FaTasks} from "react-icons/fa";
import { RiFunctionAddFill } from "react-icons/ri";
import { logoutApiAsync } from "../../redux/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { authSelector } from "../../redux/authReducer";
import { getTaskByStatusApi, taskActions } from "../../redux/taskReducer";
import { setError } from "../../redux/errorReducer";
import axios from "axios";




export default function SideBar({ isShowSideBar, toggleSideBar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector(authSelector);
  const location = useLocation();

  //====== handle logout click ====//
  function handleLogoutClick(){
    console.log("logout btn clicked")
      dispatch(logoutApiAsync());
      if(isShowSideBar){
        toggleSideBar();
      }
  }

  //====== show add task page =======//
  function showAddTaskPage(){
    navigate("tasks/add-task");
    toggleSideBar();
  }

 async function showAllTaskPage(){
    try{
      let fetchUrl = user?.role==="admin"?"getTaskByAdmin":"getTaskByUsers";
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/tasks/${fetchUrl}`,
        {withCredentials:true});

        dispatch(taskActions.setInitialTask(res.data.tasks));
        
      navigate(`tasks/${user._id}`);
      toggleSideBar();

    }catch(error){
      dispatch(setError(error.response.data.message))

    }

  }

  //======= functions find task by status ===========//
  function findTaskByStatus(status){

    dispatch(getTaskByStatusApi({status:status}));
    navigate(`tasks/${user._id}`);
    toggleSideBar();

  }




  return (
    <>
    { isLoggedIn && user &&
      <div
        className={`${styles.sidebarContainer} ${
          isShowSideBar ? styles.showSideBarContainer : styles.hideSideBarContainer
        }`}
      >
        <div className={styles.usersDiv}>
          <FaUserCircle className={styles.userIcons} />
          <h3 className={styles.userName}>{user.name}</h3>
        </div>

        <div className={styles.linksContainer}>
         

          { user && user.role==="admin" && (
             <p onClick={()=>showAddTaskPage()}>
              <RiFunctionAddFill className={styles.sidebarLink} /> Add Task
            </p>

          )}

          <p onClick={()=>showAllTaskPage()}>
            <FaTasks className={styles.sidebarLink} /> All Task
          </p>


          <p onClick={()=>findTaskByStatus("to-do")} >
            <FaClock className={styles.sidebarLink} /> Pending Task
          </p>

          <p onClick={()=>findTaskByStatus("in progress")} >
            <FaSpinner className={styles.sidebarLink} /> In Progress Task
          </p>

          <p onClick={()=>findTaskByStatus("completed")}>
            <FaCheckCircle className={styles.sidebarLink} /> Completed Task
          </p>
          <p onClick={()=>findTaskByStatus("high")}>
            <FaStar className={styles.sidebarLink} /> Important Task
          </p>
          <p onClick={()=>handleLogoutClick()} >
            <FaSignOutAlt className={styles.sidebarLink} /> Logout
          </p>
        </div>
      </div>

}
    </>
  );
}
