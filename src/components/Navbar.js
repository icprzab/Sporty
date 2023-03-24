import React from "react";
import styles from "../styles/navbar.css";
import home from "../assets/home.png"
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
import { Scrollbars } from "react-custom-scrollbars-2"
import { PageContext } from "../context/Pagecontext"
import closeButton from "../assets/close.png"
function Navbar() {
    const { page, setPage } = useContext(PageContext);
    const getUser = localStorage.getItem("user")
    const [displayPost, setDisplayPost] = useState(false);
    const [post, setPost] = useState("");
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { url, setUrl } = useContext(imageContext);
    const { userName, setUserName } = useContext(NameContext);
    const [image, setImage] = useState("")
    const [imageName, setImageName] = useState("")
    const [type, setType] = useState("")
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
    function ToHome() {
        setPage(false)
        setType("");
        navigate("/Hiking")
    }

    function inputPost(e) {
        setPost(e.target.value);
        console.log(post)
    }

    function setting() {
        setPage(true)
        navigate("/Setting")
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleTypeChange = (e) => {
        setType(e.target.value);
        console.log(type)
    }



    function handleSubmit(e) {
        e.preventDefault();
        if ((post !== "") && (image !== "") && (type !== "")) {
            const imageName = v4()
            const imageRef = ref(storage, `posts/${imageName}`);
            uploadBytes(imageRef, image)
                .then(() => {
                    getDownloadURL(imageRef)
                        .then((URL) => {
                            const PostId = v4();
                            const postCollectionRef = doc(db, `users/${getUser}/post`, PostId);
                            setDoc(postCollectionRef, { Name: userName, avatar: url, content: post, like: 0, commentNumber: 0, type: type, createAt: serverTimestamp(), picture: URL, pictureName: imageName, uid: getUser })
                                .then((data) => {
                                    const postCollectionRef2 = doc(db, `users/${getUser}/post/${PostId}/like`, getUser);
                                    setDoc(postCollectionRef2, { Name: null })
                                    setPost("");
                                    setImage("");
                                    setType("");
                                    window.location.reload()
                                }).catch((error) => { console.log(error.message, "error setting doc") })
                        }).catch((error) => { console.log(error.message, "error getting the URL") })
                    setType("");
                })
                .catch((error) => { console.log(error.message) })
            e.preventDefault();
        }

        if ((post !== "") && (image === "") && (type !== "")) {
            const PostId = v4();
            const postRef = doc(db, `users/${getUser}/post`, PostId);
            setDoc(postRef, { Name: userName, avatar: url, content: post, like: 0, commentNumber: 0, type: type, createAt: serverTimestamp(), picture: null, pictureName: null, uid: getUser })
                .then((data) => {
                    const postRef2 = doc(db, `users/${getUser}/post/${PostId}/like`, getUser);
                    setDoc(postRef2, { Name: null })
                    setPost("")
                    setType("");
                    window.location.reload()
                }).catch((error) => { console.log(error.message, "error setting doc") })
            e.preventDefault();
            // const postCollectionRef = collection(db, "users", getUser, "post");
            // addDoc(postCollectionRef, { Name: userName, avatar: url, content: post, like: 0, type: "高爾夫球", createAt: serverTimestamp(), picture: null, pictureName: null, uid: getUser });
        }

    }

    function showPost() {
        setDisplayPost(true)
    }

    function closePost() {
        setType("");
        setDisplayPost(false)
    }

    let navigate = useNavigate()
    return <div className="navbar_outside">
        <div className={displayPost ? "post_background" : ""} onClick={closePost} ></div>
        <div className={displayPost ? "post_outside" : ""}>
            <Scrollbars>

                <div className={displayPost ? "post_close active" : "post_close"} >
                    <img className={displayPost ? "post_close_img active" : "post_close_img"} src={closeButton} onClick={closePost}></img>
                </div>
                <div className={displayPost ? "post" : ""}>
                    <form onSubmit={handleSubmit} >
                        <div className={displayPost ? "post_text active" : "post_text"} >新增貼文</div>
                        <div className={displayPost ? "comment" : ""}>
                            <div className={displayPost ? "comment_inside" : ""}>
                                <div className={displayPost ? "post_member" : ""}>
                                    <div className={displayPost ? "post_avatar active" : "post_avatar"} >
                                        <img className={displayPost ? "post_avatar_img active" : "post_avatar_img"} src={url}></img>
                                    </div>
                                    <div className={displayPost ? "post_member_title" : ""}>
                                        <div className={displayPost ? "post_name active" : "post_name"}>{userName}</div>
                                    </div>
                                </div>

                                <select name="type" value={type} onChange={handleTypeChange} style={{ height: 35, width: 150 }}>
                                    <option value="">請選擇要發文的版面</option>
                                    <option value="高爾夫球">高爾夫球</option>
                                    <option value="保齡球" >保齡球</option>
                                    <option value="籃球">籃球</option>
                                    <option value="棒球">棒球</option>
                                    <option value="排球">排球</option>
                                    <option value="網球">網球</option>
                                    <option value="足球">足球</option>
                                    <option value="撞球">撞球</option>
                                    <option value="羽球">羽球</option>
                                    <option value="桌球">桌球</option>
                                    <option value="壁球">壁球</option>
                                    <option value="自由潛水">自由潛水</option>
                                    <option value="水肺潛水">水肺潛水</option>
                                    <option value="獨木舟">獨木舟</option>
                                    <option value="衝浪">衝浪</option>
                                    <option value="溯溪">溯溪</option>
                                    <option value="游泳">游泳</option>
                                    <option value="釣魚">釣魚</option>
                                    <option value="SUP">SUP</option>
                                    <option value="直排輪">直排輪</option>
                                    <option value="滑雪">滑雪</option>
                                    <option value="滑板">滑板</option>
                                    <option value="爬山">爬山</option>
                                    <option value="野營">野營</option>
                                    <option value="露營">露營</option>
                                    <option value="跑步">跑步</option>
                                    <option value="單車">單車</option>
                                    <option value="射箭">射箭</option>
                                    <option value="騎馬">騎馬</option>
                                    <option value="健身">健身</option>
                                    <option value="重訓">重訓</option>
                                    <option value="拳擊">拳擊</option>
                                    <option value="瑜珈">瑜珈</option>
                                    <option value="抱石">抱石</option>
                                    <option value="攀岩">攀岩</option>
                                    <option value="跳舞">跳舞</option>
                                    <option value="劍道">劍道</option>
                                    <option value="武術">武術</option>
                                    <option value="溜冰">溜冰</option>
                                </select>
                            </div>
                        </div>
                        <textarea className={displayPost ? "post_textarea active" : "post_textarea"} placeholder="我想說的是..." value={post} onChange={inputPost}></textarea>
                        <div className="post_select">

                            <label className={displayPost ? "post_image active" : "post_image"} onChange={handleImageChange}>
                                <input type="file" />
                                選取照片
                            </label>
                            <button className={displayPost ? "post_button active" : "post_button"} type="submit">發文</button>
                        </div>

                    </form>
                </div>
            </Scrollbars>
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
                    <button className="notification"><img className="notification_home" src={home} onClick={ToHome} /></button>
                    <button className="notification" ><img className="notification_add" src={add} onClick={showPost} /></button>
                    <button className="notification"><img className="notification_bell" src={bell} /></button>
                    <button className="notification"><img className="notification_mail" src={mail} /></button>
                    <button className="notification"><img className="notification_settings" src={settings} onClick={setting} /></button>
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