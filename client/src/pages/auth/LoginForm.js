import { useState, useEffect } from "react";
import styles from "./LoginForm.module.css";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { errorSelector, clearError } from "../../redux/errorReducer";
import { loadingSelector } from "../../redux/loadingReducer";
import { signinApiAsync, authSelector } from "../../redux/authReducer";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginForm(){
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const { isLoggedIn, user } = useSelector(authSelector);
    const { loading} = useSelector(loadingSelector);
    const { errorMessage} = useSelector(errorSelector);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

     //====== if any error show toast error then clean this error =====//
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);

    }
  }, [errorMessage, dispatch]);

   //====== Redirect user to tasks/userId if login is successful =====//
   useEffect(() => {
    if (isLoggedIn && user) {
     
        const userId = user._id; 
        navigate(location.state?.from || `/tasks/${userId}`);
    }
}, [isLoggedIn, user, navigate, location.state?.from]);



    //===== function handle login form submit =====//
    async function handleLoginFormSubmit(e){
        e.preventDefault();
        if(!email || !password){
            toast.error("please fill all fields!");
            return;
        }

        const result = await dispatch(signinApiAsync({email:email, password:password}));
        if(result.type === "auth/signinApi/fulfilled"){
            toast.success("login sucessfully");
           
    }}
    

    return(
        <div className={styles.loginPageContainer}>
            <form onSubmit={handleLoginFormSubmit}>
                <h3>Login Form</h3>

                <div className={styles.formControle}>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" placeholder="email..." value={email}
                    onChange={(e)=>setEmail(e.target.value)} />
                </div>

                <div className={styles.formControle}>
                    <label htmlFor="passoword">Password</label>
                    <input type="password" id="password" placeholder="password..." value={password}
                    onChange={(e)=>setPassword(e.target.value)} />
                </div>


                <button disabled={loading} className={styles.authFormBtn}>
                    {loading ? <ClipLoader size={15} color={"#fff"} /> : "Login" }
                </button>

                <p className={styles.formRedirect}>
                    Don't have account..? <span> <Link to={"/signup"}>SignUp</Link></span>
                </p>

            </form>
        </div>
    )


}