import React from "react";
import styles from "../styles/navbar.css";
import logo from "../assets/logo.png"
import search from "../assets/search4.png";
import bell from "../assets/notification2.png";
import mail from "../assets/mail4.png"
import add from "../assets/add3.png"
import cancel from "../assets/cancel.png"
import avatar from "../assets/member.png"
import closeButton from "../assets/close.png"
import settings from "../assets/settings3.png"
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../context/Authcontext"
import { imageContext } from "../context/imageContext"
import { useState, useContext } from "react";
import { storage, db } from "../firebase-config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from "uuid";
import { FadeLoader } from 'react-spinners';
import { Scrollbars } from "react-custom-scrollbars-2"
import { NameContext } from "../context/NameContext"
import { PostContext } from "../context/PostContext"
import { SideBarContext } from "../context/SideBarContext"
import { displayPostContext } from "../context/displayPostContext"
function Navbar() {
    const { displaySidebar, setDisplaySidebar } = useContext(SideBarContext);
    const { displayPost, setDisplayPost } = useContext(displayPostContext);
    const [loading, setLoading] = useState(false);
    const { newPost, setNewPost } = useContext(PostContext);
    const { url, setUrl } = useContext(imageContext);
    const getUser = localStorage.getItem("user")
    const [post, setPost] = useState("");
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { userName, setUserName } = useContext(NameContext);
    const [image, setImage] = useState("")
    const [imageName, setImageName] = useState("")
    const [displayNotice, setDisplayNotice] = useState(false)
    const [type, setType] = useState("")
    const [previewUrl, setPreviewUrl] = useState("");
    function logOUt(e) {
        const auth = getAuth();
        signOut(auth).then(() => {
            localStorage.clear();
            setCurrentUser(null);
            navigate("/")
            setUrl(avatar)
            window.location.reload();
        })
    }

    function showSideBar() {
        setDisplaySidebar(true)
    }

    function inputPost(e) {
        if (type == "") {
            setDisplayNotice(true)
        }
        setPost(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    function setting() {
        setDisplaySidebar(false)
        navigate("/Setting")
    }

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

    function cancelImage() {
        setPreviewUrl("")
        setImage("")
    }

    function handleTypeChange(e) {
        if (e) {
            setDisplayNotice(false)
            setType(e.target.value);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if ((post == "") || (type == "")) {
            return
        }
        if ((post !== "") && (image !== "") && (type !== "")) {
            setNewPost("發文")
            e.preventDefault();
            setLoading(true)
            const imageName = v4()
            const imageRef = ref(storage, `posts/${imageName}`);
            uploadBytes(imageRef, image)
                .then(() => {
                    getDownloadURL(imageRef)
                        .then((URL) => {
                            const PostId = v4();
                            const postCollectionRef = doc(db, `users/${getUser}/post`, PostId);
                            setDoc(postCollectionRef, { Name: userName, avatar: url, content: post, like: 0, commentNumber: 0, likeName: [null], collectName: [null], type: type, createAt: serverTimestamp(), picture: URL, pictureName: imageName, uid: getUser })
                                .then((data) => {
                                    setPost("");
                                    setImage("");
                                    setType("");
                                    setNewPost("")
                                    setPreviewUrl("")
                                    closePost()
                                }).catch((error) => { window.location.reload() })
                        }).catch((error) => { window.location.reload() })
                })
                .catch((error) => { window.location.reload() })
        }

        if ((post !== "") && (image === "") && (type !== "")) {
            setNewPost("發文")
            e.preventDefault();
            setLoading(true)
            const PostId = v4();
            const postRef = doc(db, `users/${getUser}/post`, PostId);
            setDoc(postRef, { Name: userName, avatar: url, content: post, like: 0, commentNumber: 0, likeName: [null], collectName: [null], type: type, createAt: serverTimestamp(), picture: null, pictureName: null, uid: getUser })
                .then((data) => {
                    setPost("")
                    setType("")
                    setNewPost("")
                    closePost()
                }).catch((error) => {
                    window.location.reload()
                })
        }
    }

    function showPost() {
        setDisplayPost(true)
    }

    function closePost() {
        setNewPost("")
        setPost("")
        setType("");
        setDisplayPost(false)
        setDisplayNotice(false)
        setLoading(false)
    }

    let navigate = useNavigate()
    return <div>
        {loading ? <div className="loader" >
            <FadeLoader color={"#34eb8c"} loading={loading} size={100} />
        </div>
            :
            <div className="navbar_outside">
                <div className={displayPost ? "post_background" : ""} onClick={closePost} ></div>
                <div className={displayPost ? "post_outside" : ""}>
                    <Scrollbars>
                        <div className={displayPost ? "post_close active" : "post_close"} >
                            <img className={displayPost ? "post_close_img active" : "post_close_img"} src={closeButton} onClick={closePost}></img>
                        </div>
                        <div className={displayPost ? "post" : ""}>
                            <form onSubmit={handleSubmit} >
                                <div className={displayPost ? "post_text active" : "post_text"} >新增貼文</div>
                                <div className={displayPost ? "post_notice_outside" : ""} >
                                    <div className={displayNotice ? "post_notice active" : "post_notice"}>請選擇要發文的版面</div>
                                </div>
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
                                {previewUrl &&
                                    <div className={"post_preImage_outside"}>
                                        <div className={"post_preImage"}>
                                            <img src={previewUrl} alt="Preview" />
                                        </div>
                                        <div className={"post_cancel"} onClick={cancelImage}>
                                            <img src={cancel} />
                                        </div>
                                    </div>
                                }
                            </form>
                        </div>
                    </Scrollbars>
                </div>
                <div className="navbar">
                    <button className="logo" onClick={showSideBar}><img src={logo} /></button>
                    <div className="form_space">
                        <form className="form" >
                            <div className="form_search">
                                <input className="form_search_input" placeholder="搜尋 你最喜歡的運動吧！" type="text" />
                                <button className="form_search_button" type="submit"><img src={search} /></button>
                            </div>
                        </form>
                        <div className="top_button">
                            {/* <button className="notification"><img className="notification_home" src={home} onClick={ToHome} /></button> */}
                            <button className="notification_add"><img src={add} onClick={showPost} /></button>
                            <button className="notification_bell"><img src={bell} /></button>
                            <button className="notification_mail"><img src={mail} /></button>
                            <button className="notification_settings"><img src={settings} onClick={setting} /></button>
                            <button className="log_out" onClick={logOUt}>登出</button>
                        </div>
                    </div>
                </div>
            </div >
        }
    </div>
}

export default Navbar;