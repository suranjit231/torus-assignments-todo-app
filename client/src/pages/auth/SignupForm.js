import { useState, useEffect } from "react";
import styles from "./LoginForm.module.css";
import { Link } from "react-router-dom";
import { authSelector, signupApiAsync } from "../../redux/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { loadingSelector } from "../../redux/loadingReducer";
import { toast } from "react-toastify";
import { errorSelector, clearError } from "../../redux/errorReducer";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("users");
  const {isSignup} = useSelector(authSelector);
  const { loading } = useSelector(loadingSelector);
  const {errorMessage} = useSelector(errorSelector);


  const dispatch = useDispatch();
  const navigate = useNavigate();

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


  //====== if signup then navigate to login page ====//
  useEffect(()=>{
    if(isSignup){
      navigate("/login");
    }

  },[isSignup])

  //===== function handle signup form submit =====//
 async function handleSignupFormSubmit(e) {

    try{
      e.preventDefault();
      if(!name.trim() || !email.trim() || !password.trim() || !role){
        toast.error("Fill all required fields")
        return;
      }
      const result = await dispatch(signupApiAsync({name:name, email:email, password:password, role:role}));

      if(result.type === "auth/signupApi/fulfilled"){
          toast.success("Signup sucessfully!");
      }
    }catch(error){
        console.log("error in signup form: ", error);
    }
  
  }

  return (
    <div className={`${styles.loginPageContainer} ${styles.signupFormContainer}`}>
      <form onSubmit={handleSignupFormSubmit}>

            <h3>Signup Form</h3>

        <div className={styles.formControle}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formControle}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formControle}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.formControle}>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.roleSelect}
          >
            <option value="users">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

    
        <button disabled={loading} className={styles.authFormBtn}>
              {loading ? <ClipLoader size={15} color={"#fff"} /> : "Sign Up" }
        </button>

        <p className={styles.formRedirect}>
          Already have an account? <span><Link to={"/login"}>Login</Link></span>
        </p>
      </form>
    </div>
  );
}
