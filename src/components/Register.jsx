import React, { useState } from "react";
import "./style.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate , Link } from "react-router-dom";


const Register = () => {
    const [err,setErr] = useState(false)
    const navigate = useNavigate()

    const handleSubmit= async (e) => {
        e.preventDefault()
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            if (res && res.user && res.user.uid) {
                await updateProfile(res.user,{displayName});            
                await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    displayName,
                    email,
                });

                navigate("/");
            } else {
                setErr(true);
            }
        } catch (error) {
            setErr(true);
            console.error("Error creating user:", error);
        }
    };


    return(
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">스마트버스</span>
                <span className="title">회원가입</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" className="input" placeholder="닉네임"/>
                    <input type="email" className="input" placeholder="email" />
                    <input type="password" className="input" placeholder="password" />
                    <button className="button">가입하기</button>
                    {err && <span>무슨 문제가 있습니다.</span>}
                </form>
                <h1><Link to= '/Login'>로그인</Link></h1>
                
            </div>
        </div>
    );
};

export default Register;