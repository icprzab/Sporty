import styles from "../styles/homepage.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useState, useEffect } from "react";
import hiking from "../assets/sport/hiking.png";
import search from "../assets/search4.png";
import me from "../assets/me2.jpg"
import bookmark from "../assets/bookmark5.png"
import summit from "../assets/summit.jpg"
import spread from "../assets/spread1.png"
import like from "../assets/like.png"
import comment from "../assets/comment.png"
import member1 from "../assets/member1.jpg"
import message from "../assets/message7.png"
import cat from "../assets/cat.jpg"
import head from "../assets/head.jpg"
import heart from "../assets/heart2.png"
import speaker from "../assets/speaker.png"
import { storage, db } from "../firebase-config";
import { useContext } from "react"
import { GroupContext } from "../context/GroupContext"
import { collection, getDoc, get, setDoc, updateDoc, collectionGroup, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot, getDocFromCache } from "firebase/firestore";
import { v4 } from "uuid";
import { NameContext } from "../context/NameContext"
import { imageContext } from "../context/imageContext"
import { ref, getDownloadURL } from "firebase/storage"

function Home() {
    const { userName, setUserName } = useContext(NameContext);
    const { url, setUrl } = useContext(imageContext);
    const { group, setGroup } = useContext(GroupContext);
    const [posts, setPosts] = useState([]);
    const [Comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentInfo, setCommentInfo] = useState([]);
    const hot = orderBy("like", "desc")
    const lastest = orderBy("createAt", "desc")
    const [order, setOrder] = useState(hot);
    const getType = localStorage.getItem("type")
    const getUser = localStorage.getItem("user")
    const [displayComment, setDisplayComment] = useState(false);
    function hotPost() {
        setOrder(hot)
    };

    function Collect(e) {
        const getCollectName = doc(db, "users", e.uid, "post", e.id, "collectName", getUser)
        getDoc(getCollectName)
            .then(response => {
                if (response) {
                    const getCollectName2 = doc(db, "users", getUser, "Collect", e.id)
                    if (response.data().name) {
                        const getCollectName2 = doc(db, "users", getUser, "Collect", e.id)
                        deleteDoc(getCollectName2);
                        const getLike = collection(db, "users", getUser, "Collect", e.id, "like")
                        getDocs(getLike)
                            .then(response => {
                                const userInfo = response.docs.map(doc => ({
                                    id: doc.id,
                                }))
                                for (let i = 0; i <= userInfo.length - 1; i++) {
                                    const deleteLike = doc(db, `users/${getUser}/Collect/${e.id}/like`, userInfo[i].id);
                                    deleteDoc(deleteLike, { name: userInfo[i].id })
                                }
                            });

                        const getComment = collection(db, "users", getUser, "Collect", e.id, "comment")
                        getDocs(getComment)
                            .then(response => {
                                const deleteInfo = response.docs.map(doc => ({
                                    id: doc.id,
                                }))
                                for (let i = 0; i <= deleteInfo.length - 1; i++) {
                                    const deleteComment = doc(db, `users/${getUser}/Collect/${e.id}/comment`, deleteInfo[i].id);
                                    deleteDoc(deleteComment, { avatar: deleteInfo[i].avatar, name: deleteInfo[i].name, createAt: deleteInfo[i].createAt, post: deleteInfo[i].post, postUser: deleteInfo[i].postUser, uid: deleteInfo[i].uid, content: deleteInfo[i].content })
                                }
                            });

                        updateDoc(getCollectName, { "name": null })
                    }
                    if (!response.data().name) {
                        updateDoc(getCollectName, { "name": getUser })

                        const addCollect = doc(db, `users/${getUser}/Collect`, e.id);
                        setDoc(addCollect, { post: e.id, Name: e.Name, avatar: e.avatar, content: e.content, like: e.like, type: e.type, createAt: e.createAt, picture: e.picture, pictureName: e.pictureName, postUser: e.uid, uid: getUser, commentNumber: e.commentNumber })
                        const getLike = collection(db, "users", e.uid, "post", e.id, "like")
                        getDocs(getLike)
                            .then(response => {
                                const userInfo = response.docs.map(doc => ({
                                    id: doc.id,
                                }))
                                for (let i = 0; i <= userInfo.length - 1; i++) {
                                    const addLike = doc(db, `users/${getUser}/Collect/${e.id}/like`, userInfo[i].id);
                                    setDoc(addLike, { name: userInfo[i].id })
                                }
                            });

                        const getComment = collection(db, "users", e.uid, "post", e.id, "comment")
                        getDocs(getComment)
                            .then(response => {
                                const commentInfo = response.docs.map(doc => ({
                                    ...doc.data(),
                                    id: doc.id,
                                }))
                                for (let i = 0; i <= commentInfo.length - 1; i++) {
                                    const addComment = doc(db, `users/${getUser}/Collect/${e.id}/comment`, commentInfo[i].id);
                                    setDoc(addComment, { avatar: commentInfo[i].avatar, name: commentInfo[i].name, createAt: commentInfo[i].createAt, post: commentInfo[i].post, postUser: commentInfo[i].postUser, uid: commentInfo[i].uid, content: commentInfo[i].content })
                                }
                            });
                    }
                }
            }).catch((error) => {
                if (error.message === "Cannot read properties of undefined (reading 'name')") {
                    const addCollectName = doc(db, `users/${e.uid}/post/${e.id}/collectName`, getUser);
                    setDoc(addCollectName, { name: getUser })

                    const addCollect = doc(db, `users/${getUser}/Collect`, e.id);
                    setDoc(addCollect, { post: e.id, Name: e.Name, avatar: e.avatar, content: e.content, like: e.like, type: e.type, createAt: e.createAt, picture: e.picture, pictureName: e.pictureName, postUser: e.uid, uid: getUser, commentNumber: e.commentNumber })
                    const getLike = collection(db, "users", e.uid, "post", e.id, "like")
                    getDocs(getLike)
                        .then(response => {
                            const userInfo = response.docs.map(doc => ({
                                id: doc.id,
                            }))
                            for (let i = 0; i <= userInfo.length - 1; i++) {
                                const addLike = doc(db, `users/${getUser}/Collect/${e.id}/like`, userInfo[i].id);
                                setDoc(addLike, { name: userInfo[i].id })
                            }
                        });
                    const getComment = collection(db, "users", e.uid, "post", e.id, "comment")
                    getDocs(getComment)
                        .then(response => {
                            const commentInfo = response.docs.map(doc => ({
                                ...doc.data(),
                                id: doc.id,
                            }))
                            for (let i = 0; i <= commentInfo.length - 1; i++) {
                                const addComment = doc(db, `users/${getUser}/Collect/${e.id}/comment`, commentInfo[i].id);
                                setDoc(addComment, { avatar: commentInfo[i].avatar, name: commentInfo[i].name, createAt: commentInfo[i].createAt, post: commentInfo[i].post, postUser: commentInfo[i].postUser, uid: commentInfo[i].uid, content: commentInfo[i].content })
                            }
                        });
                }
            });
    }

    function LastestPost() {
        setOrder(lastest)
    };

    function ThumbUp(e) {
        const userCollectionRef2 = doc(db, "users", e.uid, "post", e.id, "like", getUser)
        getDoc(userCollectionRef2)
            .then(response => {
                const userCollectionRef = doc(db, "users", e.uid, "post", e.id)
                if (response) {
                    if (response.data().name) {
                        updateDoc(userCollectionRef, { "like": e.like - 1 })
                        updateDoc(userCollectionRef2, { "name": null })
                    }
                    if (!response.data().name) {
                        updateDoc(userCollectionRef, { "like": e.like + 1 })
                        updateDoc(userCollectionRef2, { "name": getUser })
                    }
                }
            }).catch((error) => {
                console.log(error.message)
                const userCollectionRef = doc(db, "users", e.uid, "post", e.id)
                if (error.message === "Cannot read properties of undefined (reading 'name')") {
                    const postCollectionRef3 = doc(db, `users/${e.uid}/post/${e.id}/like`, getUser);
                    updateDoc(userCollectionRef, { "like": e.like + 1 })
                    setDoc(postCollectionRef3, { name: getUser })
                }
            });
    }

    function inputComment(e) {
        setComment(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (comment) {
            const addComment = doc(db, `users/${commentInfo.uid}/post/${commentInfo.id}/comment`, v4());
            setDoc(addComment, { avatar: url, name: userName, createAt: serverTimestamp(), post: commentInfo.id, postUser: commentInfo.uid, uid: getUser, content: Comment })
            const addCommentNumber = doc(db, "users", commentInfo.uid, "post", commentInfo.id)
            updateDoc(addCommentNumber, { "commentNumber": commentInfo.commentNumber + 1 })
            const commentNumberRef = collectionGroup(db, "Collect")
            const q2 = query(commentNumberRef, where("post", "==", commentInfo.id))
            getDocs(q2)
                .then(response => {
                    const commentNumberInfo = response.docs.map(doc => ({
                        uid: doc.data().uid,
                        id: doc.id,
                    }))
                    for (let i = 0; i <= commentNumberInfo.length - 1; i++) {
                        const commentNumberInfoRef = doc(db, "users", commentNumberInfo[i].uid, "Collect", commentNumberInfo[i].id)
                        updateDoc(commentNumberInfoRef, { "commentNumber": commentInfo.commentNumber + 1 })
                    }
                });

            const commentRef = collection(db, "users", commentInfo.uid, "post", commentInfo.id, "comment")
            const q = query(commentRef, orderBy("createAt", "desc"))
            getDocs(q)
                .then(response => {
                    const userInfo = response.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }))
                    setComments(userInfo)
                });
            setComment("");
        }
    }

    function showComment(e) {
        const commentInfo_all = { ...e, id: e.id }
        setCommentInfo(commentInfo_all)
        setDisplayComment(true)

        const commentRef = collection(db, "users", e.uid, "post", e.id, "comment")
        const q = query(commentRef, orderBy("createAt", "desc"))
        getDocs(q)
            .then(response => {
                const userInfo = response.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                setComments(userInfo)

                // const comment_all = []
                // for (let i = 0; i <= userInfo.length - 1; i++) {
                //     const imageRef = ref(storage, `users/${userInfo[i].uid}`);
                //     getDownloadURL(imageRef)
                //         .then((URL) => {
                //             const commentInfo = { name: userInfo[i].name, URL: URL, content: userInfo[i].content }
                //             comment_all.push(commentInfo)
                //             setComments(comment_all)
                //         }
                //         ).catch((error) => { console.log(error.message, "error getting the URL") })
                //     const docRef = doc(db, "users", getUser, "post", userInfo[i].id)
                //     updateDoc(docRef, { "avatar": URL })
                // }
            });

    }

    function closeComment() {
        setDisplayComment(false)
        // localStorage.setItem("type", group)
        // window.location.reload();
    }


    useEffect(() => {
        const postCollectionRef = collectionGroup(db, "post")
        const q = query(postCollectionRef, where("type", "==", getType), order)
        const unsubscribe = onSnapshot(q, (snapshot) =>
            setPosts(snapshot.docs.map(
                doc => ({
                    ...doc.data(),
                    id: doc.id,
                    // createAt: new Date(doc.data().createAt.seconds * 1000).toLocaleDateString("en-ca"),
                })
            ))
        )
        return () => {
            unsubscribe();
        }
    }, [order]);


    let navigate = useNavigate()
    return <div>
        <div className={displayComment ? styles.comment_background : ""} onClick={closeComment}></div>
        <div className={displayComment ? styles.comment_outside : ""}>
            <Scrollbars>
                <div className={displayComment ? styles.comment_all : ""}>
                    <div className={displayComment ? styles.comment_middle : ""}>

                        <div className={displayComment ? styles.comment_middle_inside : ""}>
                            <div className={displayComment ? "comment_title active" : "comment_title"}>????????????</div>
                            <div className={displayComment ? styles.comment : ""}>
                                <div className={displayComment ? styles.comment_member : ""}>
                                    <div className={displayComment ? "comment_image active" : "comment_image"} >
                                        <img className={displayComment ? "comment_image_img active" : "comment_image_img"} src={url}></img>
                                    </div>
                                    <div className={displayComment ? styles.comment_member_title : ""}>
                                        <div className={displayComment ? "comment_name active" : "comment_name"}>{userName}</div>
                                        <form className={displayComment ? styles.comment_input : ""} onSubmit={handleSubmit}>
                                            <textarea className={displayComment ? "comment_textarea active" : "comment_textarea"} placeholder="????????????..." value={Comment} onChange={inputComment}></textarea>
                                            <div>
                                                <button className={displayComment ? "comment_button active" : "comment_button"} type="submit">??????</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            {comments.map(comment =>
                                <div className={displayComment ? styles.comment : ""}>
                                    <div className={displayComment ? styles.comment_line : ""}>
                                        <div className={displayComment ? styles.comment_line_inside : ""}></div>
                                    </div>
                                    <div className={displayComment ? styles.comment_member : ""}>
                                        <div className={displayComment ? "comment_image active" : "comment_image"} >
                                            <img className={displayComment ? "comment_image_img active" : "comment_image_img"} src={comment.avatar}></img>
                                        </div>
                                        <div className={displayComment ? styles.comment_member_title : ""}>
                                            <div className={displayComment ? "comment_name active" : "comment_name"}>{comment.name}</div>
                                            <div className={displayComment ? "comment_message active" : "comment_message"}>{comment.content}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* <div className={styles.under_left_button}><img src={message}></img></div> */}

            </Scrollbars>
        </div>
        <div className={styles.homepage}>
            <div className={styles.middle}>
                <div className={styles.middle_head}>
                    <div className={styles.head}>
                        <div className={styles.head_content}>
                            <div className={styles.head_content_img}><img src={hiking}></img></div>
                            <div className={styles.head_content_text1}>{getType}</div>
                            <button className={styles.head_content_text2} onClick={hotPost}>????????????</button>
                            <button className={styles.head_content_text3} onClick={LastestPost}>????????????</button>
                            <div className={styles.head_content_heart}><img src={heart}></img></div>
                            <div className={styles.form_search}>
                                <div className={styles.form_search_button_outside}>
                                    <button className={styles.form_search_button} type="submit"><img src={search} /></button>
                                </div>
                                <div className={styles.form_search_input_outside}>
                                    <input className={styles.form_search_input} placeholder="?????? ????????????~" type="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.middle_content}></div>
                </div>
                <div className={styles.background}></div>
                <div className={styles.scrollbars}>
                    <div style={{ width: "100%", height: "100%", backgroundColor: "#edf0ee", }} >
                        {/* <Scrollbars style={{ width: "100%", height: "100vh", backgroundColor: "#edf0ee", }} > */}
                        <div className={styles.all}>
                            <div className={styles.under}>
                                <div className={styles.under_left}>

                                    {posts.map(post =>
                                        <div className={styles.under_left_content} key={post.id}>
                                            <div className={styles.under_left_content_inside}>
                                                <div className={styles.under_left_title}>
                                                    <div className={styles.under_left_selfie}>
                                                        <img src={post.avatar}></img>
                                                        <div className={styles.under_left_name_outside}>
                                                            <div className={styles.under_left_name}>{post.Name}</div>
                                                            {/* <div className={styles.under_left_date}>2023/01/28</div> */}
                                                        </div>
                                                    </div>
                                                    <div className={styles.under_left_top} >
                                                        <div className={styles.under_left_date}>{new Date(post.createAt.seconds * 1000).toLocaleDateString("zh-TW")}</div>
                                                    </div>
                                                </div>
                                                <div className={styles.under_left_text_all}>
                                                    <div className={styles.under_left_text_top}>
                                                        <div className={styles.under_left_text}>{post.content}</div>
                                                    </div>
                                                </div>
                                                <div className={styles.under_left_image}><img src={post.picture}></img></div>

                                                <div className={styles.under_left_message}>
                                                    <div className={styles.under_left_icons}>
                                                        <div className={styles.under_left_icons_like} onClick={() => ThumbUp(post)}>
                                                            <img src={like}></img>
                                                            <div className={styles.under_left_icons_text}>{post.like}</div>
                                                        </div>
                                                        <div className={styles.under_left_icons_comment} onClick={() => showComment(post)}>
                                                            <img src={comment}></img>
                                                            <div className={styles.under_left_icons_text}>{post.commentNumber}</div>
                                                        </div>
                                                        <div className={styles.under_icons_bookmark} onClick={() => Collect(post)}>
                                                            <img src={bookmark}></img>
                                                            <div className={styles.under_icons_bookmark_text}>??????</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.under_right_outside}>
                                    <div className={styles.under_right}>
                                        <div className={styles.under_right_rules}>
                                            <div className={styles.under_right_rules_about}>
                                                <div className={styles.under_right_rules_about_text}>??????</div>
                                                <div className={styles.under_right_rules_about_img}><img src={speaker}></img></div>
                                            </div>
                                            <div className={styles.under_right_rules_line}></div>
                                            <div className={styles.under_right_rules_info}>
                                                <div className={styles.under_right_rules_info_content_intro}>

                                                    <div className={styles.under_right_rules_info_content_intro_up}>???????????????????????????????????????????????????:</div>
                                                </div>

                                                <div className={styles.under_right_rules_info_content_intro}>
                                                    <div className={styles.under_right_rules_info_content_intro_left}>
                                                        <div className={styles.under_right_rules_info_content_intro_left_text}>1.</div>
                                                    </div>
                                                    <div className={styles.under_right_rules_info_content_intro_right}>??????PO??????????????????????????????????????????</div>
                                                </div>

                                                <div className={styles.under_right_rules_info_content_intro}>
                                                    <div className={styles.under_right_rules_info_content_intro_left}>
                                                        <div className={styles.under_right_rules_info_content_intro_left_text}>2.</div>
                                                    </div>
                                                    <div className={styles.under_right_rules_info_content_intro_right}>????????????????????????????????????????????????</div>
                                                </div>

                                                <div className={styles.under_right_rules_info_content_intro}>
                                                    <div className={styles.under_right_rules_info_content_intro_left}>
                                                        <div className={styles.under_right_rules_info_content_intro_left_text}>3.</div>
                                                    </div>
                                                    <div className={styles.under_right_rules_info_content_intro_right}>????????????????????????????????????????????????????????????????????????????????????????????????</div>
                                                </div>

                                                <div className={styles.under_right_rules_info_content_intro}>
                                                    <div className={styles.under_right_rules_info_content_intro_left}>
                                                        <div className={styles.under_right_rules_info_content_intro_left_text}>4.</div>
                                                    </div>
                                                    <div className={styles.under_right_rules_info_content_intro_right}>?????????????????????????????????????????????????????????</div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className={styles.under_right}>
                                <div className={styles.under_right_rules}>
                                    <div>??????</div>
                                    <div className={styles.under_right_rules_line}></div>
                                    <div>???????????????????????????????????????????????????:</div>
                                    <div>1. ??????PO??????????????????????????????????????????</div>
                                    <div>2. ????????????????????????????????????????????????</div>
                                    <div>3. ????????????????????????????????????????????????????????????????????????????????????????????????</div>
                                    <div>4. ?????????????????????????????????????????????????????????</div>
                                </div>
                            </div> */}
                            </div>
                        </div>
                        {/* </Scrollbars > */}
                    </div >
                </div>
            </div >

        </div >
    </div >

    {/* 
        <div className={styles.head}>
            <div className={styles.title1}>React????????????</div>
            <div className={styles.title2}>????????????????????????</div>
            <div className={styles.title3} ><button className={styles.button} onClick={() => { navigate("/ListPage") }}>????????????</button></div>
        </div> */}
}

export default Home;

// window.addEventListener("load", () => {
//     const container = document.getElementById('root');
//     const root = createRoot(container);
//     root.render(<MyHead />);
// });