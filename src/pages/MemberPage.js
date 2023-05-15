import styles from "../styles/memberpage.module.css";
import React from "react";
import SideBar from "../components/SideBar"
import search from "../assets/search4.png";
import closeButton from "../assets/close.png"
import like from "../assets/like.png"
import unlike from "../assets/unlike.png"
import comment from "../assets/comment.png"
import book from "../assets/book.png"
import collected from "../assets/collect.png"
import uncollected from "../assets/uncollect.png"
import option from "../assets/option2.png"
import "firebase/storage";
import { v4 } from "uuid";
import { FadeLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useRef, useState, useEffect, useContext } from "react";
import { db, storage } from "../firebase-config";
import { collection, getDoc, limit, startAfter, setDoc, updateDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp, onSnapshot } from "firebase/firestore";
import { imageContext } from "../context/imageContext"
import { NameContext } from "../context/NameContext"
import { PostContext } from "../context/PostContext"
import { memberContext } from "../context/memberContext"
import { SideBarContext } from "../context/SideBarContext"
import { displayPostContext } from "../context/displayPostContext"
function Member() {
    const { getMember, setGetMember } = useContext(memberContext);
    const { displayPost, setDisplayPost } = useContext(displayPostContext);
    const [displayButton, setDisplayButton] = useState("");
    const [page, setPage] = useState(0);
    const [clickIndex, setClickIndex] = useState("");
    const [commentPage, setCommentPage] = useState(0);
    const [lastVisible, setLastVisible] = useState("");
    const [lastComment, setLastComment] = useState("");
    const [collectedPosts, setCollectedPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [EditPosts, setEditPosts] = useState([]);
    const getUser = localStorage.getItem("user")
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const { url, setUrl } = useContext(imageContext);
    const { userName, setUserName } = useContext(NameContext);
    const { newPost, setNewPost } = useContext(PostContext);
    const [displayComment, setDisplayComment] = useState(false);
    const { displaySidebar, setDisplaySidebar } = useContext(SideBarContext);
    const [addObserver, setAddObserver] = useState(false)
    const [commentObserver, setCommentObserver] = useState(false)
    const [Comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [commentInfo, setCommentInfo] = useState([]);
    const [myNavbar, setMyNavbar] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const textareaRef = useRef(null);
    const elementRef = useRef(null);
    const commentRef = useRef(null);
    const EditRefs = useRef(null);
    const options = {
        rootMargin: "0px 0px 0px 0px",
        threshold: 0
    };
    let observer = new IntersectionObserver(handleIntersect, options);
    let observerComment = new IntersectionObserver(handleCommentIntersect, options);
    const [loading, setLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const refs = useRef(null)
    const [showLess, setShowLess] = useState([]);
    const [showText, setShowText] = useState([]);
    const [disableScroll, setDisableScroll] = useState(false);

    function closeEdit() {
        setDisplayButton("")
    }

    useEffect(() => {
        if (getMember == getUser) { navigate("/MyPage") }
        refs.current = Array(posts.length)
            .fill()
            .map((_, i) => refs.current[i] || React.createRef());
        EditRefs.current = Array(posts.length)
            .fill()
            .map((_, i) => refs.current[i] || React.createRef());
    }, [posts.length]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (refs.current[clickIndex] && !refs.current[clickIndex].contains(event.target)) {
                if (displayButton) {
                    closeEdit()
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [refs, displayButton, clickIndex])

    function showContent(e) {
        if (!showLess.includes(e)) {
            setShowText([...showText, e])
            setShowLess([...showLess, e])
        }
        if (showLess.includes(e)) {
            const deleteShowText = showText.filter((ID) => ID !== e);
            const deleteShowLess = showLess.filter((ID2) => ID2 !== e);
            setShowText(deleteShowText)
            setShowLess(deleteShowLess)
        }
    }

    function ThumbUp(e) {
        const collectionRef = doc(db, "users", e.uid, "post", e.id)
        getDoc(collectionRef)
            .then(response => {
                if (response) {
                    if (response.data().likeName.includes(getUser)) {
                        const deleteName = response.data().likeName.filter((name) => name !== getUser);
                        updateDoc(collectionRef, { "likeName": deleteName, "like": response.data().like - 1 })
                        const deleteName2 = likedPosts.filter((id) => id !== e.id);
                        setLikedPosts(deleteName2)
                        setPosts(posts.map(post => {
                            if (post.id === e.id) {
                                return { ...post, like: e.like - 1 };
                            }
                            return post
                        }))

                    }
                    if (!response.data().likeName.includes(getUser)) {
                        updateDoc(collectionRef, { "likeName": [...response.data().likeName, getUser], "like": response.data().like + 1 })
                        setLikedPosts([...likedPosts, e.id])
                        setPosts(posts.map(post => {
                            if (post.id === e.id) {
                                return { ...post, like: e.like + 1 };
                            }
                            return post
                        }))
                    }
                }
            })
    }

    function Collect(e) {
        const getCollectName = doc(db, "users", e.uid, "post", e.id)
        getDoc(getCollectName)
            .then(response => {
                if (response.data()) {
                    if (response.data().collectName.includes(getUser)) {
                        const deleteCollectName = response.data().collectName.filter((name) => name !== getUser);
                        updateDoc(getCollectName, { "collectName": deleteCollectName })
                        const deleteCollectName2 = collectedPosts.filter((id) => id !== e.id);
                        setCollectedPosts(deleteCollectName2)
                    }
                    if (!response.data().collectName.includes(getUser)) {
                        updateDoc(getCollectName, {
                            "collectName": [...response.data().collectName, getUser]
                        })
                        setCollectedPosts([...collectedPosts, e.id])
                    }
                }
            })
    }
    function inputComment(e) {
        setComment(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (comment) {
            if (comments.length < 41) { sessionStorage.setItem("comment", "") }
            setCommentLoading(true)
            const addComment = doc(db, `users/${commentInfo.uid}/post/${commentInfo.id}/comment`, v4());
            setComments("")
            setLastComment("")
            setCommentLoading(true)
            setDoc(addComment, { avatar: url, Name: userName, createAt: serverTimestamp(), post: commentInfo.id, postUser: commentInfo.uid, uid: getUser, content: Comment })
                .then(
                    response => {
                        setComment("")
                        const addCommentNumber = doc(db, "users", commentInfo.uid, "post", commentInfo.id)
                        getDoc(addCommentNumber)
                            .then(response => {
                                updateDoc(addCommentNumber, { "commentNumber": response.data().commentNumber + 1 })
                                setPosts(posts.map(post => {
                                    if (post.id === commentInfo.id) {
                                        return { ...post, commentNumber: response.data().commentNumber + 1 };
                                    }
                                    return post
                                }))
                            })
                    }
                )
        }
    }

    function showComment(e) {
        setDisableScroll(true)
        sessionStorage.setItem("comment", "")
        setDisplayComment(true)
        const commentInfo_all = { ...e, id: e.id }
        setCommentInfo(commentInfo_all)
        setCommentObserver(!commentObserver)

    }

    useEffect(() => {
        observerComment.observe(commentRef.current)
        return () => {
            observerComment.disconnect();
        }
    }, [commentObserver]);

    function handleCommentIntersect(entries) {
        const getBottomComment = sessionStorage.getItem("comment");
        if (entries[0].isIntersecting) {
            if (getBottomComment !== "沒有下一頁") {
                setCommentPage((prePage) => prePage + 1)
            }
        }
    }

    useEffect(() => {
        if (displayComment) {
            const dataNumber = 40;
            const commentPostRef = collection(db, "users", commentInfo.uid, "post", commentInfo.id, "comment")
            const q = query(commentPostRef, orderBy("createAt", "desc"), startAfter(lastComment), limit(dataNumber))
            const q2 = query(commentPostRef, orderBy("createAt", "desc"), startAfter(lastComment), limit(dataNumber + 1))

            getDocs(q2)
                .then(dataNext => {
                    if (dataNext.docs.length <= dataNumber) {
                        onSnapshot(q, (snapshot) => {
                            const userInfo = snapshot.docs.map(doc => ({
                                ...doc.data(),
                                id: doc.id,
                                day: new Date(doc.data().createAt.seconds * 1000).toLocaleDateString("zh-TW"),
                                time: String(new Date(doc.data().createAt.seconds * 1000).getHours()).padStart(2, "0") + ":" + String(new Date(doc.data().createAt.seconds * 1000).getMinutes()).padStart(2, "0")
                            }))
                            setComments([...comments, ...userInfo])
                            sessionStorage.setItem("comment", "沒有下一頁")
                            setCommentObserver(!commentObserver)
                            setCommentLoading(false)
                        })
                    }
                    if (dataNext.docs.length > dataNumber) {
                        onSnapshot(q, (snapshot) => {
                            const userInfo = snapshot.docs.map(doc => ({
                                ...doc.data(),
                                id: doc.id,
                                day: new Date(doc.data().createAt.seconds * 1000).toLocaleDateString("zh-TW"),
                                time: String(new Date(doc.data().createAt.seconds * 1000).getHours()).padStart(2, "0") + ":" + String(new Date(doc.data().createAt.seconds * 1000).getMinutes()).padStart(2, "0")
                            }))
                            const getBottomComment = sessionStorage.getItem("comment");
                            if (getBottomComment == "沒有下一頁") {
                                sessionStorage.setItem("comment", "")
                                setComments([...comments, ...userInfo])
                                const lastData = snapshot.docs[snapshot.docs.length - 1]
                                setLastComment(lastData)
                                setCommentLoading(false)
                                setCommentObserver(!commentObserver)
                            }
                            else {
                                setComments([...comments, ...userInfo])
                                const lastData = snapshot.docs[snapshot.docs.length - 1]
                                setLastComment(lastData)
                                setCommentLoading(false)
                            }

                        })

                    }
                })

            const getCommentNumber = doc(db, "users", commentInfo.uid, "post", commentInfo.id)
            getDoc(getCommentNumber)
                .then(response => {
                    if (response.data().commentNumber !== commentInfo.commentNumber) {
                        setPosts(posts.map(post => {
                            if (post.id === commentInfo.id) {
                                return { ...post, commentNumber: response.data().commentNumber };
                            }
                            return post
                        }))
                    }

                    if (response.data().content !== commentInfo.content) {
                        setPosts(posts.map(post => {
                            if (post.id === commentInfo.id) {
                                if (response.data().content.length > 100) {
                                    const Edit = response.data().content.substring(0, 100) + "..."
                                    return { ...post, postLess: Edit, content: response.data().content };
                                }
                                else {
                                    return { ...post, postLess: response.data().content, content: response.data().content };
                                }
                            }
                            return post
                        }))
                    }

                    if (response.data().like !== commentInfo.like) {
                        setPosts(posts.map(post => {
                            if (post.id === commentInfo.id) {
                                return { ...post, like: response.data().like };
                            }
                            return post
                        }))
                    }
                })
            if (showLess.includes(commentInfo.id)) {
                const deleteShowText = showText.filter((ID) => ID !== commentInfo.id);
                const deleteShowLess = showLess.filter((ID2) => ID2 !== commentInfo.id);
                setShowText(deleteShowText)
                setShowLess(deleteShowLess)
            }
        }
    }, [commentPage])

    function closeComment(e) {
        setLastComment("")
        setComment("")
        setComments([])
        setCommentInfo("")
        setDisplayComment(false)
        sessionStorage.setItem("comment", "")
        setCommentPage(0)
        setDisableScroll(false)
        textareaRef.current.style.height = 40 + "px";
        if (e == "clickAvatar") {
            window.scrollTo({ top: 0, behavior: "instant" });
            const deleteShowText = showText.filter((ID) => !showLess.includes(ID));
            setShowText(deleteShowText)
            setShowLess([])
        }
    }

    useEffect(() => {
        sessionStorage.setItem("bottom", "")
        const userDoc = doc(db, "users", getMember);
        getDoc(userDoc).then(
            doc => {
                if (doc.data().BirthDay == null) { setUsers({ ...doc.data(), day: "不能說的秘密" }) }
                if (doc.data().BirthDay !== null) { setUsers({ ...doc.data(), day: doc.data().BirthDay }) }
            });
        window.addEventListener("scroll", changeNavbar);
        return () => {
            window.removeEventListener("scroll", changeNavbar);
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ top: scrollPosition, behavior: "instant" });
        observer.observe(elementRef.current)
        if (page < 1) {
            sessionStorage.setItem("bottom", "")
        }
        return () => {
            observer.disconnect();
        }
    }, [addObserver]);

    function handleIntersect(entries) {
        const getBottom = sessionStorage.getItem("bottom");
        if (newPost !== "發文") {
            if (getBottom !== "沒有下一頁") {
                if (entries[0].isIntersecting) {
                    setPage((prePage) => prePage + 1)
                    setScrollPosition(window.scrollY)
                    setLoading(true)
                }
            }
        }
    }

    useEffect(() => {
        if (displayPost || disableScroll) {
            document.body.style.overflow = "hidden"
        }
        else { document.body.style.overflow = "auto" }
    }, [disableScroll, displayPost]);

    useEffect(() => {
        const dataNumber = 30;
        if (page > 0) {
            if (newPost !== "發文") {
                const myPage_all = collection(db, "users", getMember, "post")
                const q = query(myPage_all, orderBy("createAt", "desc"), startAfter(lastVisible), limit(dataNumber))
                const q2 = query(myPage_all, orderBy("createAt", "desc"), startAfter(lastVisible), limit(dataNumber + 1))
                getDocs(q2).then(dataNext => {
                    if (dataNext.docs.length <= dataNumber) {
                        getDocs(q)
                            .then(response => {
                                const postInfo = response.docs.map(doc =>
                                ({
                                    ...doc.data(),
                                    id: doc.id,
                                }))
                                const contentArray = []
                                const showTextID = []
                                for (let i = 0; i <= postInfo.length - 1; i++) {
                                    if (postInfo[i].content.length > 100) {
                                        contentArray.push(postInfo[i].content.substring(0, 100) + "...");
                                    } else {
                                        contentArray.push(postInfo[i].content)
                                        showTextID.push(postInfo[i].id)
                                    }
                                }
                                setShowText([...showText, ...showTextID]);
                                const postArray = []
                                for (let i = 0; i <= postInfo.length - 1; i++) {
                                    postArray.push({ ...postInfo[i], postLess: contentArray[i] })
                                }
                                setPosts([...posts, ...postArray])
                                const EditPostID = postInfo.map((ID) => ID.id);
                                setEditPosts([...EditPosts, ...EditPostID])
                                const postlikeArray = postInfo.filter((postLike) => postLike.likeName.includes(getUser));
                                const postlikeID = postlikeArray.map((postID) => postID.id);
                                setLikedPosts([...likedPosts, ...postlikeID])
                                const collectedArray = postInfo.filter((collected) => collected.collectName.includes(getUser));
                                const collectsID = collectedArray.map((collectID) => collectID.id);
                                setCollectedPosts([...collectedPosts, ...collectsID])
                                setLastVisible("")
                                sessionStorage.setItem("bottom", "沒有下一頁")
                                setLoading(false)
                                setAddObserver((data) => !data)

                            })
                    }

                    if (dataNext.docs.length > dataNumber) {
                        getDocs(q)
                            .then(response => {
                                const postInfo = response.docs.map(doc =>
                                ({
                                    ...doc.data(),
                                    id: doc.id,
                                }))
                                const contentArray = []
                                const showTextID = []
                                for (let i = 0; i <= postInfo.length - 1; i++) {
                                    if (postInfo[i].content.length > 100) {
                                        contentArray.push(postInfo[i].content.substring(0, 100) + "...");
                                    } else {
                                        contentArray.push(postInfo[i].content)
                                        showTextID.push(postInfo[i].id)
                                    }
                                }
                                setShowText([...showText, ...showTextID]);

                                const postArray = []
                                for (let i = 0; i <= postInfo.length - 1; i++) {
                                    postArray.push({ ...postInfo[i], postLess: contentArray[i] })
                                }
                                setPosts([...posts, ...postArray])
                                const EditPostID = postInfo.map((ID) => ID.id);
                                setEditPosts([...EditPosts, ...EditPostID])
                                const postlikeArray = postInfo.filter((postLike) => postLike.likeName.includes(getUser));
                                const postlikeID = postlikeArray.map((postID) => postID.id);
                                setLikedPosts([...likedPosts, ...postlikeID])
                                const collectedArray = postInfo.filter((collected) => collected.collectName.includes(getUser));
                                const collectsID = collectedArray.map((collectID) => collectID.id);
                                setCollectedPosts([...collectedPosts, ...collectsID])
                                const lastData = response.docs[response.docs.length - 1]
                                setLastVisible(lastData)
                                setLoading(false)
                                setAddObserver((data) => !data)
                            })
                    }
                })
            }
        }
        if (newPost == "發文") {
            sessionStorage.setItem("bottom", "")
            setScrollPosition(0)
            setPosts(false)
            setLoading(true)
        }

    }, [page]);

    function changeNavbar() {
        if (window.scrollY >= 101) {
            setMyNavbar(true);
        } else {
            setMyNavbar(false)
        }
    };

    let navigate = useNavigate()
    return <div>
        {loading ? <div className={styles.loader} >
            <FadeLoader color={"#34eb8c"} loading={loading} size={100} />
        </div>
            :
            <div>
                <SideBar />
                <div className={displayComment ? styles.comment_background : ""} onClick={() => closeComment()}></div>
                <div className={displayComment ? styles.comment_outside : ""}>
                    <Scrollbars>
                        <div className={displayComment ? styles.comment_all : ""}>
                            <div className={displayComment ? styles.comment_middle : ""}>
                                <div className={displayComment ? styles.comment_middle_inside : ""}>
                                    <div className={displayComment ? "comment_close active" : "comment_close"} >
                                        <img className={displayComment ? "comment_close_img active" : "comment_close_img"} src={closeButton} onClick={() => closeComment()}></img>
                                    </div>
                                    <div className={displayComment ? "comment_title active" : "comment_title"}>所有留言</div>

                                    <div className={displayComment ? styles.comment : ""}>
                                        <div className={displayComment ? styles.comment_member : ""}>
                                            <div className={displayComment ? "comment_image active" : "comment_image"} >
                                                <img className={displayComment ? "comment_image_img active" : "comment_image_img"} src={url} onClick={() => navigate("/MyPage")}></img>
                                            </div>
                                            <div className={displayComment ? styles.comment_member_title : ""}>
                                                <div className={displayComment ? "comment_name active" : "comment_name"}>{userName}</div>
                                                <form className={displayComment ? styles.comment_input : ""} onSubmit={handleSubmit}>
                                                    <textarea className={displayComment ? "comment_textarea active" : "comment_textarea"} placeholder="我的留言..." value={Comment} onChange={inputComment} ref={textareaRef}></textarea>
                                                    <div>
                                                        <button className={displayComment ? "comment_button active" : "comment_button"} type="submit">送出</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    {comments && (!commentLoading) ?
                                        <div>
                                            {
                                                comments.map(comment =>
                                                    <div className={displayComment ? styles.comment : ""}>
                                                        <div className={displayComment ? styles.comment_line : ""}>
                                                            <div className={displayComment ? styles.comment_line_inside : ""}></div>
                                                        </div>
                                                        <div className={displayComment ? styles.comment_member : ""}>
                                                            <div className={displayComment ? "comment_image active" : "comment_image"} >
                                                                <img className={displayComment ? "comment_image_img active" : "comment_image_img"} src={comment.avatar}></img>
                                                            </div>
                                                            <div className={displayComment ? styles.comment_member_title : ""}>

                                                                <div className={displayComment ? styles.comment_name_top : ""}>
                                                                    <div className={displayComment ? "comment_name active" : "comment_name"}>{comment.Name}</div>
                                                                    <div className={displayComment ? "comment_date active" : "comment_date"}>
                                                                        {comment.day}
                                                                    </div>
                                                                    <div className={displayComment ? "comment_date active" : "comment_date"}>
                                                                        {comment.time}
                                                                    </div>
                                                                </div>
                                                                <div className={displayComment ? "comment_message active" : "comment_message"}>{comment.content}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div> :
                                        <div className={styles.loader_comment}>
                                            <FadeLoader color={"#34eb8c"} loading={commentLoading} size={100} />
                                        </div>
                                    }
                                    <div ref={commentRef} className={displayComment ? styles.comment_bottom : ""}></div>
                                </div>
                            </div>
                        </div>
                    </Scrollbars>
                </div>
                <div className={displaySidebar ? "myPage active" : "myPage"}>
                    <div className={styles.homepage}>
                        <div className={styles.homepage_inside}>
                            <div className={styles.middle}>
                                <div className={myNavbar ? "middle_head_member active" : "middle_head_member"}>
                                    <div className={styles.head}>
                                        <div className={styles.head_content}>
                                            <div className={styles.head_content_img}>
                                                <img src={users.avatar} onClick={() => closeComment("clickAvatar")}></img>
                                            </div>
                                            <div className={styles.head_content_text1}>{users.Name}</div>
                                            <div className={styles.head_content_text}>
                                                <div className={styles.head_content_text2}>{users.Name}</div>
                                                <div className={styles.head_content_text2}>的貼文</div>
                                            </div>
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
                                    <div style={{ width: "100%", height: "100%", backgroundColor: "#edf0ee" }} >
                                        <div className={styles.all}>
                                            <div className={styles.all_title}>
                                                <div className={styles.title}>
                                                    <div className={styles.title_content}>
                                                        <div className={styles.title_content_img}><img src={users.avatar}></img></div>
                                                        <div className={styles.title_content_profile}>
                                                            <div className={styles.title_content_name}>{users.Name}</div>
                                                            <div className={styles.title_content_line}></div>
                                                            <div className={styles.title_content_intro}>{users.About}</div>
                                                        </div>

                                                        <div className={styles.title_content_right}>
                                                            <div className={styles.title_content_post} >
                                                                <div className={styles.title_content_post_inside}>{users.Name}</div>
                                                                <div className={styles.title_content_post_inside}>的貼文</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.under}>
                                                <div className={styles.under_left}>
                                                    {posts.length !== 0 ?
                                                        <div>
                                                            {posts.map((post, index) =>
                                                                <div className={styles.under_left_content} key={index} >
                                                                    <div ref={el => refs.current[index] = el} className={styles.under_left_content_edit_outside_none}>
                                                                        <button>編輯</button>
                                                                        <button>刪除</button>
                                                                    </div>
                                                                    <div className={styles.under_left_content_middle}>
                                                                        <div className={styles.under_left_content_inside}>
                                                                            <div className={styles.under_left_title}>
                                                                                <div className={styles.under_left_selfie}>
                                                                                    <img src={post.avatar}></img>
                                                                                    <div className={styles.under_left_name_outside}>
                                                                                        <div className={styles.under_left_name}>{post.Name}</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className={styles.under_left_top}>
                                                                                    <div className={styles.under_left_date}>{post.type}</div>
                                                                                    <div className={styles.under_left_date}>{new Date(post.createAt.seconds * 1000).toLocaleDateString("zh-TW")}</div>
                                                                                    <img className={styles.under_left_top_img_none} src={option} ></img>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div className={styles.under_left_text_div}>
                                                                                    {showText.includes(post.id) ? <div className={styles.under_left_text}>{post.content}</div> : <div className={styles.under_left_text}>{post.postLess}</div>}
                                                                                    <div className={styles.under_left_text_showMore_outside}>
                                                                                        <div className={post.postLess === post.content ? styles.under_left_text_showMore_none : styles.under_left_text_showMore} onClick={() => showContent(post.id)}>{showLess.includes(post.id) ? "顯示更少" : "顯示更多"}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {post.picture && <div className={styles.under_left_image}><img src={post.picture}></img></div>}
                                                                            <div className={styles.under_left_message}>
                                                                                <div className={styles.under_left_icons}>
                                                                                    <div className={styles.under_left_icons_like} onClick={() => ThumbUp(post)}>
                                                                                        <img src={likedPosts.includes(post.id) ? like : unlike}></img>
                                                                                        <div className={post.like === 0 ? styles.under_left_icons_text_hidden : styles.under_left_icons_text}>{post.like}</div>
                                                                                    </div>
                                                                                    <div className={styles.under_left_icons_comment} onClick={() => showComment(post)}>
                                                                                        <img src={comment}></img>
                                                                                        <div className={post.commentNumber === 0 ? styles.under_left_icons_text_hidden : styles.under_left_icons_text}>{post.commentNumber}</div>
                                                                                    </div>
                                                                                    <div className={styles.under_icons_bookmark} onClick={() => Collect(post)}>
                                                                                        <img src={collectedPosts.includes(post.id) ? collected : uncollected}></img>
                                                                                        <div className={styles.under_icons_bookmark_text}>{collectedPosts.includes(post.id) ? "取消收藏" : "加入收藏"}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div> :
                                                        <div>
                                                            <div className={styles.under_left_content_none}>
                                                                沒有貼文!
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div>
                                                    <div className={styles.under_right}>
                                                        <div className={styles.under_right_rules}>
                                                            <div className={styles.under_right_rules_about}>
                                                                <div className={styles.under_right_rules_about_text}>關於我</div>
                                                                <div className={styles.under_right_rules_about_img}><img src={book}></img></div>
                                                            </div>
                                                            <div className={styles.under_right_rules_line}></div>
                                                            <div className={styles.under_right_rules_info}>
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
                                                                    <div className={styles.under_right_rules_info_content_right}>{users.day}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div ref={elementRef} className={styles.footer}>COPYRIGHT © 2023 Sporty</div>
                                        </div>
                                    </div >
                                </div>
                            </div >
                        </div>
                    </div >
                </div >
            </div>
        }
    </div >
}

export default Member;

