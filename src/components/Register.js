import React from "react";
import "../styles/Register.css";
import background from "../assets/background.jpg"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, createUserDocument } from "../firebase-config"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, useAuth } from "../firebase-config"
// const { createUserDocument } = useAuth();
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [noticeName, setNoticeName] = useState(["姓名不得為空"]);
    const [noticeEmail, setNoticeEmail] = useState(["帳號已經註冊"]);
    const [noticePassword, setNoticePassword] = useState(["密碼輸入錯誤"]);
    const [displayName, setDisplayName] = useState(false);
    const [displayEmail, setDisplayEmail] = useState(false);
    const [displayPassword, setDisplayPassword] = useState(false);

    function inputName(e) {
        setDisplayName(false)
        setName(e.target.value);
    }

    function inputEmail(e) {
        setDisplayEmail(false)
        setEmail(e.target.value);
    }

    function inputPassword(e) {
        setDisplayPassword(false)
        setPassword(e.target.value);
    }


    async function handleSubmit(e) {
        e.preventDefault();
        setDisplayName(false)
        setDisplayPassword(false)
        setDisplayEmail(false)

        if (name === "") {
            setNoticeName("姓名不得為空")
            setDisplayName(true)
        }
        if (email === "") {
            setNoticeEmail("帳號不得為空")
            setDisplayEmail(true)
        }

        if (password === "") {
            setNoticePassword("密碼不得為空")
            setDisplayPassword(true)
        }

        if ((password !== "") && (email !== "")) {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await createUserDocument(user, { name }, { password });
            setName("");
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
                <div className="middle_content_inside">
                    <div className="middle_content_logo"><img src={logo}></img></div>
                    <div className="middle_content_title">
                        <div className="middle_content_title_inside">註冊會員帳號</div>
                    </div>
                    <div className="middle_content_form_outside">
                        <form className="middle_content_form" onSubmit={handleSubmit}>
                            <input className="middle_content_form_input" type="text" placeholder="請輸入姓名" value={name} onChange={inputName}></input>
                            <div>
                                <div className={displayName ? "middle_content_form_input_text active" : "middle_content_form_input_text"}>{noticeName}</div>
                            </div>

                            <input className="middle_content_form_input" type="text" placeholder="請輸入Email帳號" value={email} onChange={inputEmail}></input>
                            <div>
                                <div className={displayEmail ? "middle_content_form_input_text active" : "middle_content_form_input_text"}>{noticeEmail}</div>
                            </div>

                            <input className="middle_content_form_input" type="text" placeholder="請輸入密碼" value={password} onChange={inputPassword}></input>
                            <div>
                                <div className={displayPassword ? "middle_content_form_input_text active" : "middle_content_form_input_text"}>{noticePassword}</div>
                            </div>

                            <button className="middle_content_form_button" type="submit" >註冊帳號</button>
                            <div className="middle_content_form_change">
                                <div className="middle_content_form_change_text" onClick={() => { navigate("/") }}>已經有帳號? 請點此登入</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div >

}

export default Register;
