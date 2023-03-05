import styles from "../styles/mypage.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useState, useEffect } from "react";
import search from "../assets/search4.png";
import me from "../assets/me2.jpg"
import summit from "../assets/summit.jpg"
import spread from "../assets/spread1.png"
import like from "../assets/like.png"
import comment from "../assets/comment.png"
import member1 from "../assets/member1.jpg"
import message from "../assets/message7.png"
import cat from "../assets/cat.jpg"
import head from "../assets/head.jpg"
import book from "../assets/book.png"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import { collection, getDoc, get, collectionGroup, setDoc, updateDoc, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot, getDocFromCache } from "firebase/firestore";
import DateObject from "react-date-object";
import { useContext } from "react"
import { AuthContext } from "../context/Authcontext"
import { imageContext } from "../context/imageContext"
import { NameContext } from "../context/NameContext"
import bookmark from "../assets/bookmark5.png"
import { v4 } from "uuid";
function MyPage() {
    const getUser = localStorage.getItem("user")
    const postCollectionRef = collection(db, "users", getUser, "post")
    const CollectionRef = collection(db, "users", getUser, "Collect")
    const [mytype, setMytype] = useState("post");
    const [order, setOrder] = useState(postCollectionRef);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const { url, setUrl } = useContext(imageContext);
    const { userName, setUserName } = useContext(NameContext);
    const [displayComment, setDisplayComment] = useState(false);
    const [Comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentInfo, setCommentInfo] = useState([]);
    // const userCollectionRef = collection(db, "users", "B260otfvbfQ6GfR5zFViRzIfmEr1", "post")
    // const [docs, loading, error] = useCollectionData(userCollectionRef);

    function collect() {
        setOrder(CollectionRef)
        setMytype("Collect")
    }

    function mypost() {
        setOrder(postCollectionRef)
        setMytype("post")
    }


    function ThumbUp(e) {
        const collectionRef = doc(db, "users", e.uid, "post", e.id, "like", getUser)
        getDoc(collectionRef)
            .then(response => {
                if (response) {
                    if (response.data().name) {
                        updateDoc(collectionRef, { "name": null })

                        const Collect_all = collectionGroup(db, "Collect")
                        const q = query(Collect_all, where("post", "==", e.post))
                        getDocs(q)
                            .then(response => {
                                const userInfo = response.docs.map(doc => ({
                                    uid: doc.data().uid,
                                    id: doc.id,
                                }))
                                for (let i = 0; i <= userInfo.length - 1; i++) {
                                    const userCollectionRef = doc(db, "users", userInfo[i].uid, "Collect", userInfo[i].id)
                                    updateDoc(userCollectionRef, { "like": e.like - 1 })
                                }
                            });
                    }

                    if (!response.data().name) {
                        updateDoc(collectionRef, { "name": getUser })

                        const Collect_all = collectionGroup(db, "Collect")
                        const q = query(Collect_all, where("post", "==", e.post))
                        getDocs(q)
                            .then(response => {
                                const userInfo = response.docs.map(doc => ({
                                    uid: doc.data().uid,
                                    id: doc.id,
                                }))
                                for (let i = 0; i <= userInfo.length - 1; i++) {
                                    const userCollectionRef = doc(db, "users", userInfo[i].uid, "Collect", userInfo[i].id)
                                    updateDoc(userCollectionRef, { "like": e.like + 1 })
                                }
                            });
                    }
                }
            }).catch((error) => {
                if (error.message === "Cannot read properties of undefined (reading 'name')") {
                    const postCollectionRef3 = doc(db, `users/${e.uid}/${mytype}/${e.id}/like`, getUser);
                    setDoc(postCollectionRef3, { name: getUser })

                    const Collect_all = collectionGroup(db, "Collect")
                    const q = query(Collect_all, where("post", "==", e.post))
                    getDocs(q)
                        .then(response => {
                            const userInfo = response.docs.map(doc => ({
                                uid: doc.data().uid,
                                id: doc.id,
                            }))
                            for (let i = 0; i <= userInfo.length - 1; i++) {
                                const userCollectionRef = doc(db, "users", userInfo[i].uid, "Collect", userInfo[i].id)
                                updateDoc(userCollectionRef, { "like": e.like + 1 })
                            }
                        });
                }
            });

        const postRef = doc(db, "users", e.uid, "post", e.id, "like", getUser)
        getDoc(postRef)
            .then(response => {
                const userPostRef = doc(db, "users", e.uid, "post", e.id)
                if (response) {
                    if (response.data().name) {
                        updateDoc(userPostRef, { "like": e.like - 1 })
                        updateDoc(postRef, { "name": null })
                    }
                    if (!response.data().name) {
                        updateDoc(userPostRef, { "like": e.like + 1 })
                        updateDoc(postRef, { "name": getUser })
                    }
                }
            }).catch((error) => {
                const userPostRef = doc(db, "users", e.uid, "post", e.id)
                if (error.message === "Cannot read properties of undefined (reading 'name')") {
                    const postRef3 = doc(db, `users/${e.uid}/post/${e.id}/like`, getUser);
                    updateDoc(userPostRef, { "like": e.like + 1 })
                    setDoc(postRef3, { name: getUser })
                }
            });
    }

    function closeComment() {
        setDisplayComment(false)
        // localStorage.setItem("type", group)
        // window.location.reload();
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
            // console.log(commentInfo)
            // console.log(commentInfo.id)
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

        if (mytype === "post") {
            const commentPostRef = collection(db, "users", e.uid, "post", e.id, "comment")
            const queryPost = query(commentPostRef, orderBy("createAt", "desc"))
            getDocs(queryPost)
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
        if (mytype === "Collect") {
            const commentPostRef = collection(db, "users", e.postUser, "post", e.id, "comment")
            const queryPost = query(commentPostRef, orderBy("createAt", "desc"))
            getDocs(queryPost)
                .then(response => {
                    const userInfo = response.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }))
                    setComments(userInfo)
                });
        }
        // getDocs(queryPost)
        //     .then(response => {
        //         const userInfo2 = response.docs.map(doc => ({
        //             ...doc.data(),
        //             id: doc.id,
        //         }))
        //         setComments(userInfo2)
        //     });

    }

    function Collect(e) {
        const getCollectName = doc(db, "users", e.uid, "post", e.id, "collectName", getUser)
        getDoc(getCollectName)
            .then(response => {
                if (response) {
                    const getCollectName2 = doc(db, "users", getUser, "Collect", e.id)
                    if (response.data().name) {
                        deleteDoc(getCollectName2);
                        const getLike = collection(db, "users", getUser, "post", e.id, "like")
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

                        const getComment = collection(db, "users", getUser, "post", e.id, "comment")
                        getDocs(getComment)
                            .then(response => {
                                const deleteInfo = response.docs.map(doc => ({
                                    id: doc.id,
                                }))
                                for (let i = 0; i <= deleteInfo.length - 1; i++) {
                                    const deleteComment = doc(db, `users/${getUser}/Collect/${e.id}/comment`, deleteInfo[i].id);
                                    deleteDoc(deleteComment, {
                                        avatar: deleteInfo[i].avatar, name: deleteInfo[i].name, createAt: deleteInfo[i].createAt, post: deleteInfo[i].post, postUser: deleteInfo[i].postUser, uid: deleteInfo[i].uid, content: deleteInfo[i].content
                                    })
                                }
                            });

                        updateDoc(getCollectName, { "name": null })
                    }
                    if (!response.data().name) {
                        updateDoc(getCollectName, { "name": getUser })

                        const addCollect = doc(db, `users/${getUser}/Collect`, e.id);
                        setDoc(addCollect, { post: e.id, Name: e.Name, avatar: e.avatar, content: e.content, like: e.like, type: e.type, createAt: e.createAt, picture: e.picture, pictureName: e.pictureName, uid: e.uid, commentNumber: e.commentNumber })
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
                    setDoc(addCollect, { post: e.id, Name: e.Name, avatar: e.avatar, content: e.content, like: e.like, type: e.type, createAt: e.createAt, picture: e.picture, pictureName: e.pictureName, uid: e.uid, commentNumber: e.commentNumber })
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
    useEffect(() => {
        const userDoc = doc(db, "users", getUser);
        const snapshot = onSnapshot(userDoc, (snapshot) => {
            getDoc(
                setUsers({ ...snapshot.data(), day: new Date(snapshot.data().BirthDay.seconds * 1000).toLocaleDateString("zh-TW") }),
            );
        });

        const q2 = query(order, orderBy("createAt", "desc"))
        const unsubscribe = onSnapshot(q2, (snapshot) => {
            const postInfo = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }))
            setPosts(postInfo)
        })

        // const q2 = query(order, orderBy("createAt", "desc"))
        // const unsubscribe = onSnapshot(q2, (snapshot) => {
        //     const postInfo = snapshot.docs.map(doc => ({
        //         ...doc.data(),
        //         id: doc.id,
        //     }))
        //     setPosts(postInfo);
        // })

        // return onSnapshot(query(
        //     collection(db, "users", getUser, "post")
        // ),
        //     (snapshot2) => {
        //         setPost(snapshot2.docs)
        //     })

        // getDocs(userCollectionRef)
        //     .then(response => {
        //         const userInfo = response.docs.map(doc => ({
        //             // message: doc.data().message,
        //             ...doc.data(),
        //             id: doc.id
        //         }))
        //         setPosts(userInfo);
        //     });

        // snapshot.map(async (elem) => {
        //     const workQ = query(collection(db, `users/B260otfvbfQ6GfR5zFViRzIfmEr1/post`))
        //     const workDetails = await getDocs(workQ)
        //     const workInfo = workDetails.docs.map((doc) => ({
        //         ...doc.data(), id: doc.id
        //     }))
        //     setPost(workInfo)
        // })
        //     const unsubscribe = onSnapshot(userDoc, (snapshot) =>
        //     getDoc(setUsers(snapshot.data()))
        // );

        // getDocs(userCollectionRef)
        //     .then(response => {
        //         const userInfo = response.docs.map(doc => ({
        //             // message: doc.data().message,
        //             ...doc.data(),
        //             id: doc.id
        //         }))
        //         setPost(userInfo);
        //     });

        // getDoc(userDoc)
        //         .then((response) => {
        //             const data = response.data()
        //             setUsers(data)
        //         });


    }, [order]);

    const [myNavbar, setMyNavbar] = useState(false);
    const changeNavbar = () => {
        if (window.scrollY >= 101) {
            setMyNavbar(true);
        } else {
            setMyNavbar(false)
        }
    };

    window.addEventListener("scroll", changeNavbar);
    let navigate = useNavigate()
    return <div>
        <div className={displayComment ? styles.comment_background : ""} onClick={closeComment}></div>
        <div className={displayComment ? styles.comment_outside : ""}>
            <Scrollbars>
                <div className={displayComment ? styles.comment_all : ""}>
                    <div className={displayComment ? styles.comment_middle : ""}>
                        <div className={displayComment ? styles.comment_middle_inside : ""}>
                            <div className={displayComment ? "comment_title active" : "comment_title"}>所有留言</div>

                            <div className={displayComment ? styles.comment : ""}>
                                <div className={displayComment ? styles.comment_member : ""}>
                                    <div className={displayComment ? "comment_image active" : "comment_image"} >
                                        <img className={displayComment ? "comment_image_img active" : "comment_image_img"} src={url}></img>
                                    </div>
                                    <div className={displayComment ? styles.comment_member_title : ""}>
                                        <div className={displayComment ? "comment_name active" : "comment_name"}>{userName}</div>
                                        <form className={displayComment ? styles.comment_input : ""} onSubmit={handleSubmit}>
                                            <textarea className={displayComment ? "comment_textarea active" : "comment_textarea"} placeholder="我的留言..." value={Comment} onChange={inputComment}></textarea>
                                            <div>
                                                <button className={displayComment ? "comment_button active" : "comment_button"} type="submit">送出</button>
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
            </Scrollbars>
        </div>
        <div className={styles.homepage}>
            <div className={styles.homepage_inside}>
                <div className={styles.middle}>
                    <div className={myNavbar ? "middle_head active" : "middle_head"}>
                        <div className={styles.head}>
                            <div className={styles.head_content}>
                                <img className={styles.head_content_hiking} src={url}></img>
                                <div className={styles.head_content_text1}>{userName}</div>
                                <button className={styles.head_content_text2} onClick={mypost}>我的貼文</button>
                                <button className={styles.head_content_text3} onClick={collect}>收藏貼文</button>
                                <div className={styles.form_search}>
                                    <div className={styles.form_search_button_outside}>
                                        <button className={styles.form_search_button} type="submit"><img src={search} /></button>
                                    </div>
                                    <div className={styles.form_search_input_outside}>
                                        <input className={styles.form_search_input} placeholder="搜尋 我的貼文~" type="text" />
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
                                <div className={styles.all_title}>
                                    <div className={styles.title}>
                                        <div className={styles.title_content}>
                                            <div className={styles.title_content_img}><img src={url}></img></div>
                                            <div className={styles.title_content_profile}>
                                                <div className={styles.title_content_name}>{userName}</div>
                                                <div className={styles.title_content_line}></div>
                                                <div className={styles.title_content_intro}>{users.About}</div>
                                            </div>

                                            <div className={styles.title_content_right}>
                                                <div className={styles.title_content_post} onClick={mypost}>我的貼文</div>
                                                <div className={styles.title_content_collection} onClick={collect}>收藏貼文</div>
                                                {/* <div className={styles.title_content_search}>
                                                    <div className={styles.title_content_search_button_outside}>
                                                        <button className={styles.title_content_search_button} type="submit"><img src={search} /></button>
                                                    </div>
                                                    <div className={styles.title_content_search_input_outside}>
                                                        <input className={styles.title_content_search_input} placeholder="搜尋 我的貼文~" type="text" />
                                                    </div>
                                                </div> */}
                                            </div>

                                        </div>
                                    </div>
                                </div>
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
                                                        <div className={styles.under_left_top}>
                                                            <div className={styles.under_left_date}>{new Date(post.createAt.seconds * 1000).toLocaleDateString("zh-TW")}</div>

                                                        </div>
                                                    </div>
                                                    <div className={styles.under_left_text_all}>
                                                        <div className={styles.under_left_text_top}>
                                                            <div className={styles.under_left_text}>{post.content}</div>
                                                        </div>
                                                        {/* <div >
                                                    <img className={styles.under_left_text_image} src={spread}></img>
                                                </div> */}
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
                                                                <div className={styles.under_icons_bookmark_text}>收藏</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* <div className={styles.under_left_comment_all}>
                                                    <div className={styles.under_left_comment}>
                                                        <div className={styles.under_left_comment_member}>
                                                            <div className={styles.under_left_comment_image} onClick={() => { navigate("/Member") }}><img src={member1}></img></div>
                                                            <div className={styles.under_left_comment_member_title}>
                                                                <div className={styles.under_left_comment_name}>我是喬八喬八是我</div>
                                                                <div className={styles.under_left_comment_message}>請問沿路水源夠嗎?有需要多背幾瓶水上去嗎?</div>
                                                            </div>
                                                        </div>

                                                        <div className={styles.under_left_comment_line}>
                                                            <div className={styles.under_left_comment_line_inside}></div>
                                                        </div>
                                                        <div className={styles.under_left_comment_member}>
                                                            <div className={styles.under_left_comment_image}><img src={me}></img></div>
                                                            <div className={styles.under_left_comment_member_title}>
                                                                <div className={styles.under_left_comment_name}>Zora Wu</div>
                                                                <div className={styles.under_left_comment_message}>@我是喬八喬八是我 基本上只要帶路上行走需要用的水，山屋水源很充足，只差不能洗澡而已</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                    {/* <div className={styles.under_left_button}><img src={message}></img></div> */}
                                                </div>
                                            </div>

                                        )}

                                    </div>

                                    <div className={styles.under_right_outside}>
                                        <div className={styles.under_right}>
                                            <div className={styles.under_right_rules}>
                                                <div className={styles.under_right_rules_about}>
                                                    <div className={styles.under_right_rules_about_text}>關於我</div>
                                                    <div className={styles.under_right_rules_about_img}><img src={book}></img></div>
                                                </div>
                                                <div className={styles.under_right_rules_line}></div>
                                                <div className={styles.under_right_rules_info}>

                                                    {/* <div className={styles.under_right_rules_info_content_intro}>
                                                        <div className={styles.under_right_rules_info_content_intro_left}>
                                                            <div className={styles.under_right_rules_info_content_intro_left_text}>興趣</div>
                                                        </div>
                                                        <div className={styles.under_right_rules_info_content_intro_right}>水肺潛水、爬山、野營、跑步、武術</div>
                                                    </div> */}

                                                    <div className={styles.under_right_rules_info_content_intro}>
                                                        <div className={styles.under_right_rules_info_content_intro_left}>
                                                            <div className={styles.under_right_rules_info_content_intro_left_text}>自我</div>
                                                            <div className={styles.under_right_rules_info_content_intro_left_text}>介紹</div>
                                                        </div>
                                                        <div className={styles.under_right_rules_info_content_intro_right}>{users.Intro}</div>
                                                    </div>
                                                    <div className={styles.under_right_rules_info_content}>
                                                        <div className={styles.under_right_rules_info_content_left}>性別</div>
                                                        <div className={styles.under_right_rules_info_content_right}>{users.Gender}</div>
                                                    </div>

                                                    <div className={styles.under_right_rules_info_content}>
                                                        <div className={styles.under_right_rules_info_content_left}>居住地</div>
                                                        <div className={styles.under_right_rules_info_content_right}>{users.City}</div>
                                                    </div>

                                                    <div className={styles.under_right_rules_info_content}>
                                                        <div className={styles.under_right_rules_info_content_left}>生日</div>
                                                        <div className={styles.under_right_rules_info_content_right}>{users.BirthDay}</div>
                                                    </div>
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
            </div>
        </div >
    </div>


    {/* 
        <div className={styles.head}>
            <div className={styles.title1}>React專案練習</div>
            <div className={styles.title2}>歡迎光臨我的頁面</div>
            <div className={styles.title3} ><button className={styles.button} onClick={() => { navigate("/ListPage") }}>點此開始</button></div>
        </div> */}
}

export default MyPage;

// window.addEventListener("load", () => {
//     const container = document.getElementById('root');
//     const root = createRoot(container);
//     root.render(<MyHead />);
// });