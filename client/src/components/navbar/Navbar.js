import {useState, useEffect, useRef} from "react";
import styles from "./Navbar.module.css";
import { IoSearchSharp } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, Outlet } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import SideBar from "../sidebar/SideBar";
import { authSelector } from "../../redux/authReducer";
import { useSelector, useDispatch } from "react-redux";
import { searchTodoApiAsync } from "../../redux/taskReducer";
import { toast } from "react-toastify";




export default function Navbar(){
    const [searchText, setSearchText] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 540);
    const [isShowSearchDiv, setSearchDiv] = useState(false);
    const {isLoggedIn, user} = useSelector(authSelector); 
    const [isShowSideBar, setShowSidebar] = useState(false);
    const searchRef = useRef();
    const dispatch = useDispatch();
 

     // Focus the search input when the search div is shown
     useEffect(() => {
        if (isShowSearchDiv && isMobile) {
            searchRef.current.focus();
        }
    }, [isShowSearchDiv, isMobile]);


    //====== search task =========//
    useEffect(() => {
        let delayDebounceFn;
        if (isLoggedIn && user) {
           
            delayDebounceFn = setTimeout(() => {
                if (searchText) {
                    dispatch(searchTodoApiAsync({ searchText: searchText }));
                }
            }, 300);

            // Cleanup function to clear the timeout if dependencies change
            return () => clearTimeout(delayDebounceFn);
        }
    }, [isLoggedIn, user, searchText, dispatch]);



     // Handle responsiveness for search bar
     const handleResize = () => {
        setIsMobile(window.innerWidth < 540);
        if (window.innerWidth >= 540) {
            // setShowSearch(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    //======= function toggle responsive search div ======//
    function toggleResponsiveSearchBox(){
        setSearchDiv((prev)=>!prev);
    
    }

    function toggleSideBar(){
        if(!isLoggedIn){
            toast.error("please login to interact!");
            return;
        }
        setShowSidebar((prev)=>!prev)
    }


    return(
        <>
        <div className={styles.navContainer}>

            { isMobile && isShowSearchDiv?
                <div className={styles.responsiveSearchDiv} >
                    <IoIosArrowRoundBack onClick={()=>toggleResponsiveSearchBox()} className={styles.backIcon} />
                    <input ref={searchRef} type="text" value={searchText} placeholder="Search..."
                    onChange={(e)=>setSearchText(e.target.value)} />
                    <IoSearchSharp className={styles.searchIcon} />

                </div>:(

                <>
                 <h2>TODO APP</h2>

                    <div className={styles.searchContainer}>
                        <input type="text" placeholder="Search..." value={searchText}
                        onChange={(e)=>setSearchText(e.target.value)} />
                        <IoSearchSharp className={styles.searchIcon} />
                    </div>

                    <div className={styles.rightNavbar}>

                    {isMobile &&    <IoSearchSharp  onClick={()=>toggleResponsiveSearchBox()}
                     className={styles.searchControllerIcon} />}

                     {!isLoggedIn &&  <p className={styles.loginIcon}>
                        <Link to={"/login"}>
                        Login
                        </Link> </p>}

                       
                        <IoMenu onClick={()=>toggleSideBar()} className={styles.menuIcon} />
                    </div>
                </>)}

                <SideBar toggleSideBar={toggleSideBar} isShowSideBar={isShowSideBar} />

        
        </div>

        <Outlet />

    </>
    )}