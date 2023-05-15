import styles from "../styles/setting.module.css";
import React from "react";
import SideBar from "../components/SideBar"
import camera from "../assets/camera.png"
import setting from "../assets/setting.png"
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { storage, db } from "../firebase-config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, getDoc, collectionGroup, getDocs, updateDoc, doc, query, where, onSnapshot } from "firebase/firestore";
import { getAuth, updateEmail, updatePassword, signInWithEmailAndPassword } from "firebase/auth";
import { FadeLoader } from 'react-spinners';
import { SideBarContext } from "../context/SideBarContext"
import { imageContext } from "../context/imageContext"

function Setting() {
    const { displaySidebar, setDisplaySidebar } = useContext(SideBarContext);
    const getUser = localStorage.getItem("user")
    const [image, setImage] = useState(null)
    const [name, setName] = useState(null)
    const [displayName, setDisplayName] = useState(false)
    const [email, setEmail] = useState(null)
    const [displayEmail, setDisplayEmail] = useState(false)
    const [noticeEmail, setNoticeEmail] = useState("Email不得為空")
    const [oldPassword, setOldPassword] = useState(null)
    const [displayOldPassword, setDisplayOldPassword] = useState(false)
    const [noticeOldPassword, setNoticeOldPassword] = useState("密碼不得為空")
    const [AuthPassword, setAuthPassword] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [displayNewPassword, setDisplayNewPassword] = useState(false)
    const [noticeNewPassword, setNoticeNewPassword] = useState("密碼不得為空")
    const [displayUpdate, setDisplayUpdate] = useState(false)
    const [noticeUpdate, setNoticeUpdate] = useState("更新成功")
    const [displaySuccess, setDisplaySuccess] = useState(false)
    const [intro, setIntro] = useState(null)
    const [displayIntro, setDisplayIntro] = useState(false)
    const [About, setAbout] = useState(null)
    const [displayAbout, setDisplayAbout] = useState(false)
    const [city, setCity] = useState(null)
    const [displayCity, setDisplayCity] = useState(false)
    const [BirthDay, setBirthDay] = useState(null)
    const [male, setMale] = useState(null)
    const [female, setFemale] = useState(null)
    const [gender, setGender] = useState(null)
    const { url, setUrl } = useContext(imageContext);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const imageRef = ref(storage, `users/${getUser}`);

    function handleImageChange(e) {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            const reader = new FileReader();

            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function handleNameChange(e) {
        e.preventDefault();
        if (!name) { setDisplayName(true) }
        if (name) {
            const userNameRef = doc(db, "users", getUser)
            updateDoc(userNameRef, { Name: name })

            const postRef = collectionGroup(db, "post")
            const q1 = query(postRef, where("uid", "==", getUser))
            getDocs(q1)
                .then(response => {
                    const postInfo = response.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }))
                    for (let i = 0; i <= postInfo.length - 1; i++) {
                        const docRef = doc(db, "users", postInfo[i].uid, "post", postInfo[i].id,)
                        updateDoc(docRef, { "Name": name })
                    }
                    const nameRef = collectionGroup(db, "comment")
                    const q2 = query(nameRef, where("uid", "==", getUser))
                    getDocs(q2)
                        .then(response => {
                            const nameInfo = response.docs.map(doc => ({
                                ...doc.data(),
                                id: doc.id,
                            }))
                            for (let i = 0; i <= nameInfo.length - 1; i++) {
                                const docRef = doc(db, "users", nameInfo[i].postUser, "post", nameInfo[i].post, "comment", nameInfo[i].id)
                                updateDoc(docRef, { "Name": name })
                            }
                        });
                    showSuccess()
                })

        }
    }

    function handleEmailChange(e) {
        e.preventDefault();
        if (!email) {
            setNoticeEmail("帳號不得為空")
            setDisplayEmail(true)
        }
        if (email) {
            const auth = getAuth();
            updateEmail(auth.currentUser, email).then(() => {
                const update = doc(db, "users", getUser)
                updateDoc(update, { "Email": email })
                setNoticeUpdate("帳號更新成功")
                setDisplayUpdate(true)
            }).catch((error) => {
                setNoticeEmail("Email更新失敗，請重新登入")
                setDisplayEmail(true)
            });
        }
    }

    function passwordAuthentication(e) {
        e.preventDefault();
        if (!oldPassword) {
            setNoticeOldPassword("密碼不得為空")
            setDisplayOldPassword(true)
        }
        if (oldPassword) {
            const getUsertPassword = doc(db, "users", getUser)
            getDoc(getUsertPassword)
                .then(response => {
                    if (oldPassword === response.data().Password) {
                        setNoticeOldPassword("驗證成功，請再下面輸入新密碼")
                        setDisplayOldPassword(true)
                        setAuthPassword(true)
                        setOldPassword("")
                        const auth = getAuth();
                        signInWithEmailAndPassword(auth, auth.currentUser.email, oldPassword)
                            .then((userCredential) => {
                                return
                            })
                        e.preventDefault();
                    }
                    if (oldPassword !== response.data().Password) {
                        setNoticeOldPassword("驗證失敗，請重新輸入")
                        setDisplayOldPassword(true)
                        setOldPassword("")
                    }
                }).catch((error) => {
                });
        }
        setOldPassword(null)
        e.preventDefault();
    }

    function handlePasswordChange(e) {
        e.preventDefault();
        if (!newPassword) {
            setNoticeNewPassword("密碼不得為空")
            setDisplayNewPassword(true)
        }
        if (newPassword && !AuthPassword) {
            setNoticeNewPassword("請先驗證密碼")
            setDisplayNewPassword(true)
        }
        if (newPassword && AuthPassword) {
            if (newPassword.length < 6) {
                return
            }
            if (newPassword.length >= 6) {
                const auth = getAuth();
                updatePassword(auth.currentUser, newPassword).then(() => {
                    const update = doc(db, "users", getUser)
                    updateDoc(update, { "Password": newPassword })
                    setNoticeUpdate("密碼更新成功")
                    setDisplayUpdate(true)
                    setAuthPassword(false)
                    setNewPassword("")
                    e.preventDefault();
                }).catch((error) => {
                    setNoticeNewPassword("密碼更新失敗，請重新登入")
                    setDisplayNewPassword(true)
                    setNewPassword("")
                });
            }
        }
        setNewPassword("")
        e.preventDefault();
    }
    function handleInfoChange(e) {
        e.preventDefault();
        if (male) {
            if (!About) { setDisplayAbout(true) }
            if (!intro) { setDisplayIntro(true) }
            if (!city) { setDisplayCity(true) }
            if (About && intro && city && BirthDay) {
                const userNameRef = doc(db, "users", getUser)
                updateDoc(userNameRef, { "About": About, "Intro": intro, "City": city, "BirthDay": BirthDay, "Gender": "男生" })
                    .then(() => {
                        setDisplaySuccess(true)
                    })

            }
            if (About && intro && city && !BirthDay) {
                const userNameRef = doc(db, "users", getUser)
                updateDoc(userNameRef, { "About": About, "Intro": intro, "City": city, "BirthDay": null, "Gender": "男生" })
                    .then(() => {
                        setDisplaySuccess(true)
                    })
            }

        }
        if (female) {
            if (!About) { setDisplayAbout(true) }
            if (!intro) { setDisplayIntro(true) }
            if (!city) { setDisplayCity(true) }
            if (About && intro && city && BirthDay) {
                const userNameRef = doc(db, "users", getUser)
                updateDoc(userNameRef, { "About": About, "Intro": intro, "City": city, "BirthDay": BirthDay, "Gender": "女生" })
                    .then(() => {
                        setNoticeUpdate("更新成功!")
                        setDisplaySuccess(true)
                    })
            }
            if (About && intro && city && !BirthDay) {
                const userNameRef = doc(db, "users", getUser)
                updateDoc(userNameRef, { "About": About, "Intro": intro, "City": city, "BirthDay": null, "Gender": "女生" })
                    .then(() => {
                        setNoticeUpdate("更新成功!")
                        setDisplaySuccess(true)
                    })
            }
        }
    }

    function showSuccess() {
        setNoticeUpdate("姓名更新成功")
        setDisplayUpdate(true)
    }


    function inputName(e) {
        setDisplaySuccess(false)
        setDisplayName(false)
        if (e.target.value.length <= 13) {
            setName(e.target.value);
        }
    }

    function inputEmail(e) {
        setDisplayUpdate(false)
        setDisplaySuccess(false)
        setDisplayEmail(false)
        setEmail(e.target.value);
    }

    function inputOldPassword(e) {
        setDisplayUpdate(false)
        setDisplaySuccess(false)
        setDisplayOldPassword(false)
        setOldPassword(e.target.value);
    }

    function inputNewPassword(e) {
        setDisplayUpdate(false)
        setDisplayOldPassword(false)
        setDisplaySuccess(false)
        if (e.target.value.length < 6) {
            setNoticeNewPassword("新密碼長度需大於6個字元")
            setDisplayNewPassword(true)
            setNewPassword(e.target.value);
        }
        if (e.target.value.length >= 6) {
            setDisplayNewPassword(false)
            setNewPassword(e.target.value);
        }
    }

    function inputAbout(e) {
        setDisplayUpdate(false)
        setDisplaySuccess(false)
        setDisplayAbout(false)
        if (e.target.value.length <= 80) {
            setAbout(e.target.value)
        }
    }

    function inputIntro(e) {
        setDisplayUpdate(false)
        setDisplaySuccess(false)
        setDisplayIntro(false)
        setIntro(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    function inputCity(e) {
        if (e.target.value.length <= 30) {
            setDisplayUpdate(false)
            setDisplaySuccess(false)
            setDisplayCity(false)
            setCity(e.target.value);
        }
    }

    function inputBirthDay(e) {
        setDisplayUpdate(false)
        setDisplaySuccess(false)
        setBirthDay(e.target.value);
    }

    function inputMale(e) {
        setDisplayUpdate(false)
        setDisplaySuccess(false)
        setMale(e.target.value);
        setFemale(!e.target.value);
    }

    function inputFemale(e) {
        setDisplayUpdate(false)
        setDisplaySuccess(false)
        setMale(!e.target.value);
        setFemale(e.target.value);
    }

    function handleSubmit() {
        if (image != null) {
            setLoading(true)
            uploadBytes(imageRef, image)
                .then(() => {
                    getDownloadURL(imageRef)
                        .then((URL) => {
                            setUrl(URL);
                            const imageRef1 = doc(db, "users", getUser)
                            updateDoc(imageRef1, { "avatar": URL })
                            const imageRef2 = collection(db, "users", getUser, "post")
                            getDocs(imageRef2)
                                .then(response => {
                                    const userInfo = response.docs.map(doc => ({
                                        id: doc.id,
                                    }))
                                    for (let i = 0; i <= userInfo.length - 1; i++) {
                                        const docRef = doc(db, "users", getUser, "post", userInfo[i].id)
                                        updateDoc(docRef, { "avatar": URL })
                                    }
                                });

                            const imageRef3 = collectionGroup(db, "comment")
                            const q = query(imageRef3, where("uid", "==", getUser))
                            getDocs(q)
                                .then(response => {
                                    const userInfo2 = response.docs.map(doc => ({
                                        ...doc.data(),
                                        id: doc.id,
                                    }))
                                    for (let i = 0; i <= userInfo2.length - 1; i++) {
                                        const docRef2 = doc(db, "users", userInfo2[i].postUser, "post", userInfo2[i].post, "comment", userInfo2[i].id)
                                        updateDoc(docRef2, { "avatar": URL })
                                    }
                                });
                        }).catch((error) => {
                            setPreviewUrl("");
                            setImage(null);
                            setLoading(false)
                        })
                    setPreviewUrl("");
                    setImage(null);
                    setLoading(false)
                })
                .catch((error) => {
                    setPreviewUrl("");
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        const container = containerRef.current;
        container.scrollTop = container.scrollHeight;
    }, [About]);


    useEffect(() => {
        setLoading(true)
        const userDoc = doc(db, "users", getUser);
        onSnapshot(userDoc, (snapshot) => {
            setLoading(false)
            setName(snapshot.data().Name);
            setAbout(snapshot.data().About)
            setIntro(snapshot.data().Intro);
            setCity(snapshot.data().City);
            setEmail(snapshot.data().Email);
            setBirthDay(snapshot.data().BirthDay);
            setGender(snapshot.data().Gender);
            if (snapshot.data().Gender === "女生") { setFemale(true) };
            if (snapshot.data().Gender === "男生") { setMale(true) }
        })
    }, [])

    let navigate = useNavigate()
    return <div>
        {loading ? <div className={styles.loader} >
            <FadeLoader color={"#34eb8c"} loading={loading} size={100} />
        </div>
            :
            <div>
                <SideBar />
                <div className={displaySidebar ? "settingPage active" : "settingPage"}>
                    <div className={styles.homepage}>
                        < div className={styles.middle}>
                            <div className={styles.middle_head}>
                                <div className={styles.head}>
                                    <div className={styles.head_content}>
                                        <div className={styles.head_content_img}><img src={setting}></img></div>
                                        <div className={styles.head_content_text1}>設定</div>
                                        <button className={styles.head_content_text2}>編輯個人檔案</button>

                                    </div>
                                </div>
                                <div className={styles.middle_content}></div>
                            </div>
                            <div className={styles.background}></div>
                            <div className={styles.scrollbars}>
                                <div style={{ width: "100%", height: "100%", backgroundColor: "#edf0ee" }} >
                                    <div className={styles.all}>
                                        <div className={styles.under}>
                                            <div className={styles.under_inside}>
                                                <div className={styles.under_inside_content}>
                                                    <div className={styles.under_inside_content_account}>
                                                        <div className={styles.under_inside_content_account_inside}>
                                                            <div className={styles.under_inside_content_account_title}>
                                                                <div className={styles.under_inside_content_account_title_text}>帳戶資訊</div>
                                                            </div>
                                                            <div className={styles.under_inside_content_account_line_outside}>
                                                                <div className={styles.under_inside_content_account_line}></div>
                                                            </div>
                                                            <div className={styles.under_inside_content_account_notice_outside}>
                                                                <div className={displayUpdate ? styles.under_inside_content_account_notice3 : styles.under_inside_content_account_notice3_none}>{noticeUpdate}</div>
                                                            </div>
                                                            <div className={styles.under_inside_content_account_info_outside}>
                                                                <div className={styles.under_inside_content_account_info}>
                                                                    <div className={styles.under_inside_content_account_text}>更新姓名:</div>
                                                                    <div>
                                                                        <form className={styles.under_inside_content_account_form} onSubmit={handleNameChange}>
                                                                            <input className={styles.under_inside_content_account_input} value={name} onChange={inputName}></input>
                                                                            <button className={styles.under_inside_content_account_button} type="submit">更新</button>
                                                                        </form>
                                                                        <div className={displayName ? styles.under_inside_content_account_notice2 : styles.under_inside_content_account_notice2_none}>姓名不得為空</div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.under_inside_content_account_info}>
                                                                    <div className={styles.under_inside_content_account_text}>
                                                                        <div className={styles.under_inside_content_account_text1}>更新帳號:</div>
                                                                        <div className={styles.under_inside_content_account_text1}>( email )</div>
                                                                    </div>
                                                                    <div>
                                                                        <form className={styles.under_inside_content_account_form} onSubmit={handleEmailChange}>
                                                                            <input className={styles.under_inside_content_account_input} value={email} onChange={inputEmail}></input>
                                                                            <button className={styles.under_inside_content_account_button} type="submit">更新</button>
                                                                        </form>
                                                                        <div className={displayEmail ? styles.under_inside_content_account_notice2 : styles.under_inside_content_account_notice2_none}>{noticeEmail}</div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.under_inside_content_account_info}>
                                                                    <div className={styles.under_inside_content_account_text}>驗證密碼:</div>
                                                                    <div>
                                                                        <form className={styles.under_inside_content_account_form} onSubmit={passwordAuthentication}>
                                                                            <input className={styles.under_inside_content_account_input_password} placeholder={"請先驗證密碼後，再更新密碼"} value={oldPassword} onChange={inputOldPassword}></input>
                                                                            <button className={styles.under_inside_content_account_button} type="submit">驗證</button>
                                                                        </form>
                                                                        <div className={displayOldPassword ? styles.under_inside_content_account_notice2 : styles.under_inside_content_account_notice2_none}>{noticeOldPassword}</div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.under_inside_content_account_info}>
                                                                    <div className={styles.under_inside_content_account_text}>更新密碼:</div>
                                                                    <div>
                                                                        <form className={styles.under_inside_content_account_form} onSubmit={handlePasswordChange}>
                                                                            <input className={styles.under_inside_content_account_input_password} placeholder={"請輸入新密碼"} value={newPassword} onChange={inputNewPassword}></input>
                                                                            <button className={styles.under_inside_content_account_button} type="submit">更新</button>
                                                                        </form>
                                                                        <div className={displayNewPassword ? styles.under_inside_content_account_notice2 : styles.under_inside_content_account_notice2_none}>{noticeNewPassword}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <form className={styles.under_inside_content_account_inside2} onSubmit={handleInfoChange}>
                                                            <div className={styles.under_inside_content_account_title}>
                                                                <div className={styles.under_inside_content_account_title_text}>個人資訊</div>
                                                                <button className={styles.under_inside_content_account_title_button} type="submit" >更新內容</button>
                                                            </div>
                                                            <div className={styles.under_inside_content_account_line_outside}>
                                                                <div className={styles.under_inside_content_account_line}></div>
                                                            </div>
                                                            <div className={styles.under_inside_content_account_notice_outside}>
                                                                <div className={displaySuccess ? styles.under_inside_content_account_notice3 : styles.under_inside_content_account_notice3_none}>更新成功!</div>
                                                            </div>
                                                            <div className={styles.under_inside_content_account_info_outside}>
                                                                <div className={styles.under_inside_content_account_info}>
                                                                    <div className={styles.under_inside_content_account_text}>
                                                                        <div className={styles.under_inside_content_account_text3}>封面簡介:</div>
                                                                        <div className={styles.under_inside_content_account_text4}>( 80字為限 )</div>
                                                                    </div>
                                                                    <div className={styles.under_inside_content_account_form2}>
                                                                        <textarea className={styles.under_inside_content_account_textarea1} value={About} onChange={inputAbout}></textarea>
                                                                        <div className={displayAbout ? styles.under_inside_content_account_notice : styles.under_inside_content_account_notice_none}>封面簡介不得為空</div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.under_inside_content_account_intro}>
                                                                    <div className={styles.under_inside_content_account_intro_text}>自我介紹:</div>
                                                                    <div className={styles.under_inside_content_account_form2}>
                                                                        <textarea className={styles.under_inside_content_account_textarea2} style={{ height: "auto", minHeight: "200px" }} value={intro} ref={containerRef} onChange={inputIntro}></textarea>
                                                                        <div className={displayIntro ? styles.under_inside_content_account_notice : styles.under_inside_content_account_notice_none}>自我介紹不得為空</div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.under_inside_content_account_info}>
                                                                    <div className={styles.under_inside_content_account_text1}>居住地:</div>
                                                                    <div className={styles.under_inside_content_account_form2}>
                                                                        <input className={styles.under_inside_content_account_address} value={city} onChange={inputCity}></input>
                                                                        <div className={displayCity ? styles.under_inside_content_account_notice2 : styles.under_inside_content_account_notice2_none}>居住地不得為空</div>
                                                                    </div>
                                                                </div>

                                                                <div className={styles.under_inside_content_account_info}>
                                                                    <div className={styles.under_inside_content_account_text1}>生日:</div>
                                                                    <div className={styles.under_inside_content_account_form}>
                                                                        <input className={styles.under_inside_content_account_birth} type="date" value={BirthDay} onChange={inputBirthDay}></input>
                                                                    </div>
                                                                </div>

                                                                <div className={styles.under_inside_content_account_info2}>
                                                                    <div className={styles.under_inside_content_account_text}>性別:</div>
                                                                    <div className={styles.under_inside_content_account_radio}>
                                                                        <input className={styles.under_inside_content_account_radio_gender} type="radio" name="gender" value="true" checked={male ? "checked" : ""} onChange={inputMale} />男生&emsp;
                                                                        <input className={styles.under_inside_content_account_radio_gender} type="radio" name="gender" value="true" checked={female ? "checked" : ""} onChange={inputFemale} />女生&emsp;
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className={styles.under_inside_content_selfie}>
                                                        <div className={styles.under_inside_content_selfie_text}>更換大頭貼</div>
                                                        <div className={styles.under_inside_content_selfie_line_outside}>
                                                            <div className={styles.under_inside_content_selfie_line}></div>
                                                        </div>
                                                        <div>
                                                            <div className={styles.under_inside_content_selfie_img_content}>
                                                                <div className={styles.under_inside_content_selfie_img_outside}>
                                                                    <div className={styles.under_inside_content_selfie_preview_outside}>
                                                                        <div className={styles.under_inside_content_selfie_preview_text}>
                                                                            <div className={styles.under_inside_content_selfie_preview_text_button_outside}>
                                                                                <label className={styles.under_inside_content_selfie_preview_text_button} htmlFor="fileInput">
                                                                                    <img src={camera} alt="Selected File" />
                                                                                </label>
                                                                                <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleImageChange} />
                                                                            </div>
                                                                        </div>
                                                                        <div className={styles.under_inside_content_selfie_preview}>
                                                                            <div className={styles.under_inside_content_selfie_preview_img_outside}>
                                                                                {previewUrl ? <img className={styles.under_inside_content_selfie_preview_img} src={previewUrl} alt="Preview" ></img> :
                                                                                    <img className={styles.under_inside_content_selfie_img} src={url}></img>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.under_inside_content_selfie_change_outside}>
                                                                    <div className={styles.under_inside_content_selfie_change}>
                                                                        <button className={styles.under_inside_content_selfie_button} onClick={handleSubmit}>更換照片</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div>
                        </div >
                    </div >
                </div >
            </div >
        }
    </div >
}

export default Setting;
