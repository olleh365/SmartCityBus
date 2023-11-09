import React,{useState} from "react";
import "./style.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate , Link } from "react-router-dom";
import { auth } from "../firebase";



const Login = () => {

    const [err,setErr] = useState(false)
    const navigate = useNavigate()

    const handleSubmit= async (e) => {
        e.preventDefault()
        const email = e.target[0].value;
        const password = e.target[1].value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            setErr(true);
            console.error("Error creating user:", error);
        }
    };

    return(
        <div className="formContainer">
            <div className="formWrapper">
                <span className="loginLogo">스마트버스</span>
                <span className="loginTitle">로그인</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" className="input" placeholder="email" />
                    <input type="password" className="input" placeholder="password" />
                    <button className="button">로그인</button>
                    {err && <span>무슨 문제가 있습니다.</span>}
                </form>
                <h1><Link to='/Register'>회원가입</Link></h1>
            </div>
        </div>
    );
};

export default Login;