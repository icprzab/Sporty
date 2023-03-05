import React from "react";
import "../styles/login.css";
import background from "../assets/sportybackground.png"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Authcontext"
import { onAuthStateChanged } from "firebase/auth";
function Login() {
    // const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [noticeEmail, setNoticeEmail] = useState(["帳號輸入錯誤"]);
    const [noticePassword, setNoticePassword] = useState(["密碼輸入錯誤"]);
    const [displayEmail, setDisplayEmail] = useState(false);
    const [displayPassword, setDisplayPassword] = useState(false);
    function inputEmail(e) {
        setDisplayEmail(false)
        setEmail(e.target.value);
    }

    function inputPassword(e) {
        setDisplayPassword(false)
        setPassword(e.target.value);
    }


    async function handleSubmit(e) {
        setDisplayPassword(false)
        setDisplayEmail(false)
        e.preventDefault();
        if (email === "") {
            setNoticeEmail("帳號不得為空")
            setDisplayEmail(true)
        }

        if (password === "") {
            setNoticePassword("密碼不得為空")
            setDisplayPassword(true)
        }


        if ((password !== "") && (email !== "")) {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user
                    if (user) {
                        navigate("/Mypage")
                    }

                })
                .catch((error) => {
                    // setDisplayNotice(true)
                    console.log(error)
                });
            setEmail("");
            setPassword("");
        }

    }

    let navigate = useNavigate()
    return <div className="login_outside" >
        <div className="background">
            <img src={background}></img>
        </div>
        <div className="login">
            <div className="middle">
                <div className="middle_content">
                    <div className="middle_content_logo"><img src={logo}></img></div>
                    <div className="middle_content_title">
                        <div className="middle_content_title_inside">登入會員帳號</div>
                    </div>
                    <div className="middle_content_form_outside">
                        <form className="middle_content_form" onSubmit={handleSubmit}>
                            <input className="middle_content_form_input" type="text" placeholder="請輸入Email帳號" value={email} onChange={inputEmail}></input>
                            <div>
                                <div className={displayEmail ? "middle_content_form_input_text active" : "middle_content_form_input_text"}>{noticeEmail}</div>
                            </div>

                            <input className="middle_content_form_input" type="text" placeholder="請輸入密碼" value={password} onChange={inputPassword}></input>
                            <div>
                                <div className={displayPassword ? "middle_content_form_input_text active" : "middle_content_form_input_text"}>{noticePassword}</div>
                            </div>

                            <button className="middle_content_form_button" type="submit" >登入帳號</button>
                            <div className="middle_content_form_change">
                                <div className="middle_content_form_change_text" onClick={() => { navigate("/Register") }}>還沒有帳號? 請點此註冊</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div >

}

export default Login;
