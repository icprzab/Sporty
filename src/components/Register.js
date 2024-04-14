import React from "react";
import "../styles/Register.css";
import background from "../assets/background.jpg"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase-config"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase-config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
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
    const [displaySuccess, setDisplaySuccess] = useState(false);
    const [male, setMale] = useState(true)
    const [female, setFemale] = useState(null)

    function inputName(e) {
        if (e.target.value.length <= 13) {
            setDisplayName(false)
            setName(e.target.value);
        }
    }

    function inputEmail(e) {
        setDisplayEmail(false)
        setEmail(e.target.value);
    }

    function inputPassword(e) {
        setDisplayPassword(false)
        if (e.target.value.length >= 6) {
            setPassword(e.target.value);
            setDisplayPassword(false)
        }
        if (e.target.value.length < 6) {
            setNoticePassword("密碼長度需大於6個字元")
            setPassword(e.target.value);
            setDisplayPassword(true)
        }
    }

    const createUserDocument = (user, username, userPassword, gender) => {
        if (!user) return;

        const userDoc = doc(db, "users", user.uid);
        if (!userDoc.exists) {
            const { email } = user;
            const { name } = username;
            const { password } = userPassword;
            setDoc(userDoc, { Name: name, Email: email, Password: password, createAt: serverTimestamp(), About: "哈囉，這是我的封面簡介", BirthDay: null, City: "地球村", Gender: gender, Intro: "哈囉，這是我的自我介紹", avatar: null }).then((data) => { setDisplaySuccess(true) })
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setDisplayName(false)
        setDisplayPassword(false)
        setDisplayEmail(false)

        if (!name) {
            setNoticeName("姓名不得為空")
            setDisplayName(true)
        }
        if (!email) {
            setNoticeEmail("帳號不得為空")
            setDisplayEmail(true)
        }

        if (!password) {
            setNoticePassword("密碼不得為空")
            setDisplayPassword(true)
        }

        if ((name) && (password) && (email)) {
            if (password.length >= 6) {
                if (male) {
                    const { user } = await createUserWithEmailAndPassword(auth, email, password).then().catch(function (error) {
                        if (error.code == "auth/email-already-in-use") {
                            setNoticeEmail("此帳號已註冊，請輸入新的帳號")
                            setDisplayEmail(true)
                        }
                    });
                    await createUserDocument(user, { name }, { password }, "男生")
                    setName("");
                    setEmail("");
                    setPassword("");
                }

                if (female) {
                    const { user } = await createUserWithEmailAndPassword(auth, email, password, "女生").then().catch(function (error) {
                        if (error.code == "auth/email-already-in-use") {
                            setNoticeEmail("此帳號已註冊，請輸入新的帳號")
                            setDisplayEmail(true)
                        }
                    });
                    await createUserDocument(user, { name }, { password }, "女生")
                    setName("");
                    setEmail("");
                    setPassword("");
                }
            }
            if (password.length < 6) {
                return
            }
        }
    }

    function inputMale(e) {
        setMale(e.target.value);
        setFemale(!e.target.value);
    }

    function inputFemale(e) {
        setMale(!e.target.value);
        setFemale(e.target.value);
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
                            <div>
                                <div className="middle_content_form_radio">
                                    <div className="middle_content_form_radio_text">性別:</div>
                                    <div>
                                        <input className="middle_content_form_radio_gender" type="radio" name="gender" value="true" checked={male ? "checked" : ""} onChange={inputMale} />男生&emsp;
                                    </div>
                                    <div>
                                        <input className="middle_content_form_radio_gender" type="radio" name="gender" value="true" checked={female ? "checked" : ""} onChange={inputFemale} />女生&emsp;
                                    </div>
                                </div>
                            </div>
                            <button className="middle_content_form_button" type="submit" >註冊帳號</button>
                            <div className="middle_content_form_success_center">
                                <div className={displaySuccess ? "middle_content_form_success active" : "middle_content_form_success"}>註冊成功，請登入會員帳號</div>
                            </div>
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
