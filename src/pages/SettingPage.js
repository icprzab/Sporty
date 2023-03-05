import styles from "../styles/setting.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useState, useEffect } from "react";
import hiking from "../assets/sport/hiking.png";
import search from "../assets/search4.png";
import me from "../assets/me2.jpg"
import bookmark from "../assets/bookmark-gray.png"
import summit from "../assets/summit.jpg"
import spread from "../assets/spread1.png"
import like from "../assets/like.png"
import comment from "../assets/comment.png"
import member1 from "../assets/member1.jpg"
import message from "../assets/message7.png"
import cat from "../assets/cat.jpg"
import head from "../assets/head.jpg"
import setting from "../assets/setting.png"
import { storage, db } from "../firebase-config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useContext } from "react"
import { imageContext } from "../context/imageContext"
import { writeBatch, collection, setDoc, getDoc, get, collectionGroup, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot, getDocFromCache } from "firebase/firestore";
import { NameContext } from "../context/NameContext"
import { getAuth, updateEmail, updatePassword, onAuthStateChanged } from "firebase/auth";
function Setting() {
    const { userName, setUserName } = useContext(NameContext);
    const getUser = localStorage.getItem("user")
    const [image, setImage] = useState(null)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [oldPassword, setOldPassword] = useState(null)
    const [AuthPassword, setAuthPassword] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [intro, setIntro] = useState(null)
    const [About, setAbout] = useState(null)
    const [city, setCity] = useState(null)
    const [BirthDay, setBirthDay] = useState(null)
    const [male, setMale] = useState(null)
    const [female, setFemale] = useState(null)
    const [gender, setGender] = useState(null)
    const { url, setUrl } = useContext(imageContext);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            console.log(e.target.files[0])
        }
    }
    const imageRef = ref(storage, `users/${getUser}`);

    function handleNameChange(e) {
        e.preventDefault();
        if (name) {
            const userNameRef = doc(db, "users", getUser)
            updateDoc(userNameRef, { "Name": name })

            const nameRef = collectionGroup(db, "comment")
            const q = query(nameRef, where("uid", "==", getUser))
            getDocs(q)
                .then(response => {
                    const nameInfo = response.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }))
                    for (let i = 0; i <= nameInfo.length - 1; i++) {
                        const docRef = doc(db, "users", nameInfo[i].postUser, "post", nameInfo[i].post, "comment", nameInfo[i].id)
                        updateDoc(docRef, { "name": name })
                        setName("")
                    }
                });
        }
    }

    function handleInfoChange(e) {
        e.preventDefault();
        if (male) {
            const userNameRef = doc(db, "users", getUser)
            updateDoc(userNameRef, { "About": About, "Intro": intro, "City": city, "BirthDay": BirthDay, "Gender": "男生" })
        }
        if (female) {
            const userNameRef = doc(db, "users", getUser)
            updateDoc(userNameRef, { "About": About, "Intro": intro, "City": city, "BirthDay": BirthDay, "Gender": "女生" })
        }
    }

    const handleEmailChange = (e) => {
        e.preventDefault();
        if (email) {
            const auth = getAuth();
            updateEmail(auth.currentUser, email).then(() => {
                const update = doc(db, "users", getUser)
                updateDoc(update, { "Email": email })
                console.log("更新成功")
                e.preventDefault();
                // Email updated!
                // ...
            }).catch((error) => {
                console.log(error.message, "error getting the URL")
                // An error occurred
                // ...
            });
        }
        setEmail(null)

    }

    const passwordAuthentication = (e) => {
        e.preventDefault();
        if (oldPassword) {
            const getUsertPassword = doc(db, "users", getUser)
            getDoc(getUsertPassword)
                .then(response => {
                    if (oldPassword === response.data().Password) {
                        setAuthPassword(true)
                        e.preventDefault();
                        console.log("驗證成功")
                    }
                })
        }
        setOldPassword(null)
        e.preventDefault();
    }

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword && AuthPassword) {
            const auth = getAuth();
            const user = auth.currentUser;
            updatePassword(user, newPassword).then(() => {
                console.log("更新成功")

                const update = doc(db, "users", getUser)
                updateDoc(update, { "Password": newPassword })
                setAuthPassword(false)
                e.preventDefault();
            }).catch((error) => {
                // An error ocurred
                // ...
            });
        }
        setNewPassword(null)
        e.preventDefault();
    }

    const inputName = (e) => {
        setName(e.target.value);
    }

    const inputEmail = (e) => {
        setEmail(e.target.value);
    }

    const inputOldPassword = (e) => {
        setOldPassword(e.target.value);
    }

    const inputNewPassword = (e) => {
        setNewPassword(e.target.value);
    }

    const inputAbout = (e) => {
        if (e.target.value.length <= 80) { setAbout(e.target.value) }
    }

    const inputIntro = (e) => {
        setIntro(e.target.value);
    }

    const inputCity = (e) => {
        setCity(e.target.value);
    }

    const inputBirthDay = (e) => {
        setBirthDay(e.target.value);
    }

    const inputMale = (e) => {
        setMale(e.target.value);
        setFemale(!e.target.value);
    }

    const inputFemale = (e) => {
        setMale(!e.target.value);
        setFemale(e.target.value);
    }

    const handleSubmit = () => {
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
                                    post: doc.data().post,
                                    postUser: doc.data().postUser,
                                    id: doc.id,
                                }))
                                for (let i = 0; i <= userInfo2.length - 1; i++) {
                                    const docRef2 = doc(db, "users", userInfo2[i].postUser, "post", userInfo2[i].post, "comment", userInfo2[i].id)
                                    updateDoc(docRef2, { "avatar": URL })
                                }
                            });
                        // const batch = writeBatch(db);
                        // const batch = db.batch();
                        // const postCollectionRef = collection(db, "users", getUser, "post")
                        // batch.set(postCollectionRef, { URL: URL });

                        // const postCollectionRef = collectionGroup(db, "post")
                        // const q = query(postCollectionRef, where("Name", "==", "Zora Wu"))
                        // updateDoc(q, { URL: url })
                        // onSnapshot(q, (snapshot) =>
                        //     updateDoc(snapshot.docs.map(
                        //         doc => ({
                        //             url: { url }
                        //         })
                        //     ))
                        // )
                    }).catch((error) => { console.log(error.message, "error getting the URL") })
                setImage(null);
            })
            .catch((error) => { console.log(error.message) })
    }


    useEffect(() => {
        const userDoc = doc(db, "users", getUser);
        onSnapshot(userDoc, (snapshot) => {
            setName(snapshot.data().Name);
            setAbout(snapshot.data().About);
            setIntro(snapshot.data().Intro);
            setCity(snapshot.data().City);
            setEmail(snapshot.data().Email);
            setBirthDay(snapshot.data().BirthDay);
            // setBirthDay(new Date(snapshot.data().BirthDay.seconds * 1000).getFullYear() + "-" + String(new Date(snapshot.data().BirthDay.seconds * 1000).getMonth() + 1).padStart(2, '0') + "-" + String(new Date(snapshot.data().BirthDay.seconds * 1000).getDate()).padStart(2, '0'));
            setGender(snapshot.data().Gender);
            if (snapshot.data().Gender === "女生") { setFemale(true) };
            if (snapshot.data().Gender === "男生") { setMale(true) }
        })
    }, [])

    let navigate = useNavigate()
    return <div className={styles.homepage}>
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
            <div className={styles.scrollbars}>
                <div style={{ width: "100%", height: "100%", backgroundColor: "#edf0ee" }} >
                    {/* <Scrollbars style={{ width: "100%", height: "100vh", backgroundColor: "#edf0ee", }} > */}
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
                                            <div className={styles.under_inside_content_account_info_outside}>
                                                <div className={styles.under_inside_content_account_info}>
                                                    <div className={styles.under_inside_content_account_text}>姓名:</div>
                                                    <form className={styles.under_inside_content_account_form} onSubmit={handleNameChange}>
                                                        <input className={styles.under_inside_content_account_input} value={name} onChange={inputName}></input>
                                                        <button className={styles.under_inside_content_account_button} type="submit">更新</button>
                                                    </form>
                                                </div>
                                                <div className={styles.under_inside_content_account_info}>
                                                    <div className={styles.under_inside_content_account_text}>
                                                        <div className={styles.under_inside_content_account_text1}>帳號:</div>
                                                        <div className={styles.under_inside_content_account_text2}>( email )</div>
                                                    </div>
                                                    <form className={styles.under_inside_content_account_form} onSubmit={handleEmailChange}>
                                                        <input className={styles.under_inside_content_account_input} value={email} onChange={inputEmail}></input>
                                                        <button className={styles.under_inside_content_account_button} type="submit">更新</button>
                                                    </form>
                                                </div>
                                                <div className={styles.under_inside_content_account_info}>
                                                    <div className={styles.under_inside_content_account_text}>密碼驗證:</div>
                                                    <form className={styles.under_inside_content_account_form} onSubmit={passwordAuthentication}>
                                                        <input className={styles.under_inside_content_account_input_password} placeholder={"請輸入舊密碼驗證後，再更新密碼"} value={oldPassword} onChange={inputOldPassword}></input>
                                                        <button className={styles.under_inside_content_account_button} type="submit">驗證</button>
                                                    </form>
                                                </div>
                                                <div className={styles.under_inside_content_account_info}>
                                                    <div className={styles.under_inside_content_account_text}>更新密碼:</div>
                                                    <form className={styles.under_inside_content_account_form} onSubmit={handlePasswordChange}>
                                                        <input className={styles.under_inside_content_account_input_password} placeholder={"請輸入新密碼"} value={newPassword} onChange={inputNewPassword}></input>
                                                        <button className={styles.under_inside_content_account_button} type="submit">更新</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                        <form className={styles.under_inside_content_account_inside} onSubmit={handleInfoChange}>
                                            <div className={styles.under_inside_content_account_title}>
                                                <div className={styles.under_inside_content_account_title_text}>個人資訊</div>
                                                <button className={styles.under_inside_content_account_title_button} type="submit" >更新內容</button>
                                            </div>
                                            <div className={styles.under_inside_content_account_line_outside}>
                                                <div className={styles.under_inside_content_account_line}></div>
                                            </div>

                                            <div className={styles.under_inside_content_account_info_outside}>
                                                <div className={styles.under_inside_content_account_info}>
                                                    <div className={styles.under_inside_content_account_text}>
                                                        <div className={styles.under_inside_content_account_text3}>封面簡介:</div>
                                                        <div className={styles.under_inside_content_account_text4}>( 80字為限 )</div>
                                                    </div>
                                                    <div className={styles.under_inside_content_account_form}>
                                                        <textarea className={styles.under_inside_content_account_textarea1} value={About} onChange={inputAbout}></textarea>
                                                    </div>
                                                </div>
                                                <div className={styles.under_inside_content_account_intro}>
                                                    <div className={styles.under_inside_content_account_intro_text}>自我介紹:</div>
                                                    <div className={styles.under_inside_content_account_form}>
                                                        <textarea className={styles.under_inside_content_account_textarea2} value={intro} onChange={inputIntro}></textarea>
                                                    </div>
                                                </div>
                                                <div className={styles.under_inside_content_account_info}>
                                                    <div className={styles.under_inside_content_account_text}>居住地:</div>
                                                    <div className={styles.under_inside_content_account_address}>
                                                        <input className={styles.under_inside_content_account_home} value={city} onChange={inputCity}></input>
                                                    </div>
                                                </div>

                                                <div className={styles.under_inside_content_account_info}>
                                                    <div className={styles.under_inside_content_account_text}>生日:</div>
                                                    <div className={styles.under_inside_content_account_form}>
                                                        <input className={styles.under_inside_content_account_birth} type="date" value={BirthDay} onChange={inputBirthDay}></input>
                                                        <button className={styles.under_inside_content_account_button_none}>變更</button>
                                                    </div>
                                                </div>

                                                <div className={styles.under_inside_content_account_info}>
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
                                        <div className={styles.under_inside_content_selfie_img}><img src={url}></img></div>
                                        <div className={styles.under_inside_content_selfie_change}>
                                            <label className={styles.under_inside_content_selfie_input} onChange={handleImageChange}>
                                                <input type="file" />
                                                選取照片
                                            </label>
                                            <button className={styles.under_inside_content_selfie_button} onClick={handleSubmit}>更換照片</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* </Scrollbars > */}
                </div >
            </div>
        </div >
    </div >


    {/* 
        <div className={styles.head}>
            <div className={styles.title1}>React專案練習</div>
            <div className={styles.title2}>歡迎光臨我的頁面</div>
            <div className={styles.title3} ><button className={styles.button} onClick={() => { navigate("/ListPage") }}>點此開始</button></div>
        </div> */}
}

export default Setting;

// window.addEventListener("load", () => {
//     const container = document.getElementById('root');
//     const root = createRoot(container);
//     root.render(<MyHead />);
// });