import React from "react";
import styles from "../styles/navbar.css";
import logo from "../assets/logo.png"
import search from "../assets/search4.png";
import bell from "../assets/notification2.png";
import mail from "../assets/mail4.png"
import add from "../assets/add3.png"
import bookmark from "../assets/bookmark.png"
import settings from "../assets/settings3.png"
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/Authcontext"
import { imageContext } from "../context/imageContext"
import { useState, useEffect } from "react";
import { storage, db } from "../firebase-config";
import { collection, getDoc, get, collectionGroup, getDocs, setDoc, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot, getDocFromCache } from "firebase/firestore";
import { NameContext } from "../context/NameContext"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from "uuid";
function Navbar() {
    const getUser = localStorage.getItem("user")
    const [displayPost, setDisplayPost] = useState(false);
    const [post, setPost] = useState("");
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { url, setUrl } = useContext(imageContext);
    const { userName, setUserName } = useContext(NameContext);
    const [image, setImage] = useState("")
    const [imageName, setImageName] = useState("")
    async function logOUt(e) {
        const auth = getAuth();
        signOut(auth).then(() => {
            localStorage.clear();
            setCurrentUser(null);
            navigate("/")
            window.location.reload();
        }).catch((error) => {
            // An error happened.
        });
    }

    function inputPost(e) {
        setPost(e.target.value);
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if ((post !== "") && (image !== "")) {
            console.log(2)
            const imageName = v4()
            const imageRef = ref(storage, `posts/${imageName}`);
            uploadBytes(imageRef, image)
                .then(() => {
                    getDownloadURL(imageRef)
                        .then((URL) => {
                            const PostId = v4();
                            const postCollectionRef = doc(db, `users/${getUser}/post`, PostId);
                            setDoc(postCollectionRef, { Name: userName, avatar: url, content: post, like: 0, commentNumber: 0, type: "爬山", createAt: serverTimestamp(), picture: URL, pictureName: imageName, uid: getUser });
                            const postCollectionRef2 = doc(db, `users/${getUser}/post/${PostId}/like`, getUser);
                            setDoc(postCollectionRef2, { Name: null })
                            setPost("")
                        }
                        ).catch((error) => { console.log(error.message, "error getting the URL") })
                    setImage("");
                })
                .catch((error) => { console.log(error.message) })
            e.preventDefault();
        }

        if ((post !== "") && (image === "")) {
            const postCollectionRef = collection(db, "users", getUser, "post");
            addDoc(postCollectionRef, { Name: userName, avatar: url, content: post, like: 0, type: "爬山", createAt: serverTimestamp(), picture: null, pictureName: null, uid: getUser });
            setPost("")
            // window.location.reload()
        }
    }




    function showPost() {
        setDisplayPost(true)
    }

    function closePost() {
        setDisplayPost(false)
    }

    let navigate = useNavigate()
    return <div className="navbar_outside">
        <div className={displayPost ? "post_background" : ""} onClick={closePost} ></div>
        <div className={displayPost ? "post_outside" : ""}>
            <div className={displayPost ? "post" : ""}>
                <form onSubmit={handleSubmit} >
                    <div className={displayPost ? "post_text active" : "post_text"} >新增貼文</div>
                    <div className={displayPost ? "comment" : ""}>
                        <div className={displayPost ? "post_member" : ""}>
                            <div className={displayPost ? "post_avatar active" : "post_avatar"} >
                                <img className={displayPost ? "post_avatar_img active" : "post_avatar_img"} src={url}></img>
                            </div>
                            <div className={displayPost ? "post_member_title" : ""}>
                                <div className={displayPost ? "post_name active" : "post_name"}>{userName}</div>
                            </div>
                        </div>
                    </div>
                    <textarea className={displayPost ? "post_textarea active" : "post_textarea"} placeholder="我想說的是..." value={post} onChange={inputPost}></textarea>
                    <label className={displayPost ? "post_image active" : "post_image"} onChange={handleImageChange}>
                        <input type="file" />
                        選取照片
                    </label>
                    <button className={displayPost ? "post_button active" : "post_button"} type="submit">發文</button>
                </form>
            </div>
        </div>
        <div className="navbar">
            <button className="logo"><img src={logo} /></button>
            <div className="form_space">
                <form className="form" >
                    <div className="form_search">
                        <input className="form_search_input" placeholder="搜尋 你最喜歡的運動吧！" type="text" />
                        <button className="form_search_button" type="submit"><img src={search} /></button>
                    </div>
                </form>
                <div className="top_button">
                    <button className="notification" ><img className="notification_add" src={add} onClick={showPost} /></button>
                    <button className="notification"><img className="notification_bell" src={bell} /></button>
                    <button className="notification"><img className="notification_mail" src={mail} /></button>
                    <button className="notification"><img className="notification_settings" src={settings} onClick={() => { navigate("/Setting") }} /></button>
                    <button className="log_out" onClick={logOUt}>登出</button>
                </div>
            </div>
        </div>
    </div >

    // return <div className={styles.navbar_outside}>
    // <div className={styles.post}></div>
    // <div className={styles.navbar}>
    //     <button className={styles.logo}><img src={logo} /></button>
    //     <div className={styles.form_space}>
    //         <form className={styles.form} >
    //             <div className={styles.form_search}>
    //                 <input className={styles.form_search_input} placeholder="搜尋 你最喜歡的運動吧！" type="text" />
    //                 <button className={styles.form_search_button} type="submit"><img src={search} /></button>
    //             </div>
    //         </form>
    //         <div className={styles.top_button}>
    //             <button className={styles.notification} ><img className={styles.notification_add} src={add} /></button>
    //             <button className={styles.notification} ><img className={styles.notification_bell} src={bell} /></button>
    //             <button className={styles.notification}><img className={styles.notification_mail} src={mail} /></button>
    //             <button className={styles.notification}><img className={styles.notification_settings} src={settings} onClick={() => { navigate("/Setting") }} /></button>
    //             <button className={styles.log_out} onClick={handleSubmit}>登出</button>
    //         </div>
    //     </div>
    // </div>
    // </div>



}

export default Navbar;