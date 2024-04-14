import styles from "../styles/homepage.module.css";
import React from "react";
import search from "../assets/search4.png";
import collected from "../assets/collect.png";
import uncollected from "../assets/uncollect.png";
import closeButton from "../assets/close.png";
import like from "../assets/like.png";
import unlike from "../assets/unlike.png";
import comment from "../assets/comment.png";
import heart from "../assets/heart2.png";
import speaker from "../assets/speaker.png";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";
import { FadeLoader } from "react-spinners";
import { v4 } from "uuid";
import { useRef, useState, useEffect, useContext } from "react";
import { storage, db } from "../firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDoc,
  limit,
  startAfter,
  setDoc,
  updateDoc,
  collectionGroup,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { NameContext } from "../context/NameContext";
import { imageContext } from "../context/imageContext";
import { PostContext } from "../context/PostContext";
import { SideBarContext } from "../context/SideBarContext";
import { displayPostContext } from "../context/displayPostContext";
import { memberContext } from "../context/memberContext";

function Home() {
  const { getMember, setGetMember } = useContext(memberContext);
  const [showLess, setShowLess] = useState([]);
  const [showText, setShowText] = useState([]);
  const { displayPost, setDisplayPost } = useContext(displayPostContext);
  const [lastVisible, setLastVisible] = useState("");
  const [lastComment, setLastComment] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [collectedPosts, setCollectedPosts] = useState([]);
  const [typeIcon, setTypeIcon] = useState("");
  const { newPost, setNewPost } = useContext(PostContext);
  const { userName, setUserName } = useContext(NameContext);
  const { url, setUrl } = useContext(imageContext);
  const [posts, setPosts] = useState([]);
  const [Comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentInfo, setCommentInfo] = useState([]);
  const hot = orderBy("like", "desc");
  const latest = orderBy("createAt", "desc");
  const [order, setOrder] = useState(hot);
  const [hotType, setHotType] = useState(true);
  const [LatestType, setLatestType] = useState(null);
  const getType = localStorage.getItem("type");
  const getUser = localStorage.getItem("user");
  const [displayComment, setDisplayComment] = useState(false);
  const elementRef = useRef(null);
  const commentRef = useRef(null);
  const [page, setPage] = useState(0);
  const [addObserver, setAddObserver] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { displaySidebar, setDisplaySidebar } = useContext(SideBarContext);
  const [commentPage, setCommentPage] = useState(0);
  const [commentObserver, setCommentObserver] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const textareaRef = useRef(null);
  const options = {
    rootMargin: "0px 0px 0px 0px",
    threshold: 0,
  };

  const [loading, setLoading] = useState(false);
  const observer = new IntersectionObserver(handleIntersect, options);
  const observerComment = new IntersectionObserver(
    handleCommentIntersect,
    options
  );
  const [disableScroll, setDisableScroll] = useState(false);

  function ToMember(e) {
    setGetMember(e);
    sessionStorage.setItem("bottom", "");
    if (e !== getUser) {
      navigate("/Member");
    }
    if (e == getUser) {
      navigate("/Mypage");
    }
  }

  function hotPost() {
    setShowLess([]);
    setShowText([]);
    setPosts([]);
    setAddObserver((data) => !data);
    sessionStorage.setItem("bottom", "");
    setLastVisible("");
    setOrder(hot);
    setPage(0);
    setHotType(true);
    setLatestType(null);
  }
  function LatestPost() {
    setShowLess([]);
    setShowText([]);
    setPosts([]);
    setAddObserver((data) => !data);
    sessionStorage.setItem("bottom", "");
    setLastVisible("");
    setOrder(latest);
    setPage(0);
    setLatestType(true);
    setHotType(null);
  }

  function showContent(e) {
    if (!showLess.includes(e)) {
      setShowText([...showText, e]);
      setShowLess([...showLess, e]);
    }
    if (showLess.includes(e)) {
      const deleteShowText = showText.filter((ID) => ID !== e);
      const deleteShowLess = showLess.filter((ID2) => ID2 !== e);
      setShowText(deleteShowText);
      setShowLess(deleteShowLess);
    }
  }

  function Collect(e) {
    const getCollectName = doc(db, "users", e.uid, "post", e.id);
    getDoc(getCollectName).then((response) => {
      if (response.data()) {
        const getCollectName2 = doc(db, "users", getUser, "Collect", e.id);
        if (response.data().collectName.includes(getUser)) {
          deleteDoc(getCollectName2);
          const getComment = collection(
            db,
            "users",
            getUser,
            "Collect",
            e.id,
            "comment"
          );
          getDocs(getComment).then((response) => {
            const deleteInfo = response.docs.map((doc) => ({
              id: doc.id,
            }));
            for (let i = 0; i <= deleteInfo.length - 1; i++) {
              const deleteComment = doc(
                db,
                `users/${getUser}/Collect/${e.id}/comment`,
                deleteInfo[i].id
              );
              deleteDoc(deleteComment, {
                avatar: deleteInfo[i].avatar,
                Name: deleteInfo[i].Name,
                createAt: deleteInfo[i].createAt,
                post: deleteInfo[i].post,
                postUser: deleteInfo[i].postUser,
                uid: deleteInfo[i].uid,
                content: deleteInfo[i].content,
              });
            }
          });
          const deleteCollectName = response
            .data()
            .collectName.filter((name) => name !== getUser);
          updateDoc(getCollectName, { collectName: deleteCollectName });
          const deleteCollectName2 = collectedPosts.filter((id) => id !== e.id);
          setCollectedPosts(deleteCollectName2);
        }
        if (!response.data().collectName.includes(getUser)) {
          updateDoc(getCollectName, {
            collectName: [...response.data().collectName, getUser],
          });
          setCollectedPosts([...collectedPosts, e.id]);
        }
      }
    });
  }

  function ThumbUp(e) {
    const collectionRef = doc(db, "users", e.uid, "post", e.id);
    getDoc(collectionRef).then((response) => {
      if (response) {
        if (response.data().likeName.includes(getUser)) {
          const deleteName = response
            .data()
            .likeName.filter((name) => name !== getUser);
          updateDoc(collectionRef, {
            likeName: deleteName,
            like: response.data().like - 1,
          });
          const deleteName2 = likedPosts.filter((id) => id !== e.id);
          setLikedPosts(deleteName2);
          setPosts(
            posts.map((post) => {
              if (post.id === e.id) {
                return { ...post, like: e.like - 1 };
              }
              return post;
            })
          );
        }

        if (!response.data().likeName.includes(getUser)) {
          updateDoc(collectionRef, {
            likeName: [...response.data().likeName, getUser],
            like: response.data().like + 1,
          });
          setLikedPosts([...likedPosts, e.id]);
          setPosts(
            posts.map((post) => {
              if (post.id === e.id) {
                return { ...post, like: e.like + 1 };
              }
              return post;
            })
          );
        }
      }
    });
  }

  function inputComment(e) {
    setComment(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (comment) {
      if (comments.length < 41) {
        sessionStorage.setItem("comment", "");
      }
      setCommentLoading(true);
      const addComment = doc(
        db,
        `users/${commentInfo.uid}/post/${commentInfo.id}/comment`,
        v4()
      );
      setComments("");
      setLastComment("");
      setDoc(addComment, {
        avatar: url,
        Name: userName,
        createAt: serverTimestamp(),
        post: commentInfo.id,
        postUser: commentInfo.uid,
        uid: getUser,
        content: Comment,
      }).then((response) => {
        setComment("");
        const addCommentNumber = doc(
          db,
          "users",
          commentInfo.uid,
          "post",
          commentInfo.id
        );
        getDoc(addCommentNumber).then((response) => {
          updateDoc(addCommentNumber, {
            commentNumber: response.data().commentNumber + 1,
          });
          setPosts(
            posts.map((post) => {
              if (post.id === commentInfo.id) {
                return {
                  ...post,
                  commentNumber: response.data().commentNumber + 1,
                };
              }
              return post;
            })
          );
        });
      });
    }
  }

  function showComment(e) {
    setDisableScroll(true);
    sessionStorage.setItem("comment", "");
    setDisplayComment(true);
    const commentInfo_all = { ...e, id: e.id };
    setCommentInfo(commentInfo_all);
    setCommentObserver(!commentObserver);
  }

  useEffect(() => {
    observerComment.observe(commentRef.current);
    return () => {
      observerComment.disconnect();
    };
  }, [commentObserver]);

  function handleCommentIntersect(entries) {
    const getBottomComment = sessionStorage.getItem("comment");
    if (entries[0].isIntersecting) {
      if (getBottomComment !== "沒有下一頁") {
        setCommentPage((prePage) => prePage + 1);
      }
    }
  }

  useEffect(() => {
    if (displayPost || disableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [disableScroll, displayPost]);

  useEffect(() => {
    if (displayComment) {
      const dataNumber = 40;
      const commentRef = collection(
        db,
        "users",
        commentInfo.uid,
        "post",
        commentInfo.id,
        "comment"
      );
      const q = query(
        commentRef,
        orderBy("createAt", "desc"),
        startAfter(lastComment),
        limit(dataNumber)
      );
      const q2 = query(
        commentRef,
        orderBy("createAt", "desc"),
        startAfter(lastComment),
        limit(dataNumber + 1)
      );

      getDocs(q2).then((dataNext) => {
        if (dataNext.docs.length <= dataNumber) {
          onSnapshot(q, (snapshot) => {
            const userInfo = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              day: new Date(
                doc.data().createAt.seconds * 1000
              ).toLocaleDateString("zh-TW"),
              time:
                String(
                  new Date(doc.data().createAt.seconds * 1000).getHours()
                ).padStart(2, "0") +
                ":" +
                String(
                  new Date(doc.data().createAt.seconds * 1000).getMinutes()
                ).padStart(2, "0"),
            }));
            setCommentLoading(false);
            setComments([...comments, ...userInfo]);
            setLastComment("");
            sessionStorage.setItem("comment", "沒有下一頁");
          });
        }
        if (dataNext.docs.length > dataNumber) {
          onSnapshot(q, (snapshot) => {
            const userInfo = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              day: new Date(
                doc.data().createAt.seconds * 1000
              ).toLocaleDateString("zh-TW"),
              time:
                String(
                  new Date(doc.data().createAt.seconds * 1000).getHours()
                ).padStart(2, "0") +
                ":" +
                String(
                  new Date(doc.data().createAt.seconds * 1000).getMinutes()
                ).padStart(2, "0"),
            }));
            const getBottomComment = sessionStorage.getItem("comment");
            if (getBottomComment == "沒有下一頁") {
              sessionStorage.setItem("comment", "");
              setCommentLoading(false);
              setComments([...comments, ...userInfo]);
              const lastData = snapshot.docs[snapshot.docs.length - 1];
              setLastComment(lastData);
            } else {
              setCommentLoading(false);
              setComments([...comments, ...userInfo]);
              const lastData = snapshot.docs[snapshot.docs.length - 1];
              setLastComment(lastData);
            }
          });
        }
      });

      const getCommentNumber = doc(
        db,
        "users",
        commentInfo.uid,
        "post",
        commentInfo.id
      );
      getDoc(getCommentNumber).then((response) => {
        if (response.data().commentNumber !== commentInfo.commentNumber) {
          setPosts(
            posts.map((post) => {
              if (post.id === commentInfo.id) {
                return {
                  ...post,
                  commentNumber: response.data().commentNumber,
                };
              }
              return post;
            })
          );
        }

        if (response.data().content !== commentInfo.content) {
          setPosts(
            posts.map((post) => {
              if (post.id === commentInfo.id) {
                if (response.data().content.length > 100) {
                  const Edit =
                    response.data().content.substring(0, 100) + "...";
                  return {
                    ...post,
                    postLess: Edit,
                    content: response.data().content,
                  };
                } else {
                  return {
                    ...post,
                    postLess: response.data().content,
                    content: response.data().content,
                  };
                }
              }
              return post;
            })
          );
        }

        if (response.data().like !== commentInfo.like) {
          setPosts(
            posts.map((post) => {
              if (post.id === commentInfo.id) {
                return { ...post, like: response.data().like };
              }
              return post;
            })
          );
        }
      });

      if (showLess.includes(commentInfo.id)) {
        const deleteShowText = showText.filter((ID) => ID !== commentInfo.id);
        const deleteShowLess = showLess.filter((ID2) => ID2 !== commentInfo.id);
        setShowText(deleteShowText);
        setShowLess(deleteShowLess);
      }
    }
  }, [commentPage]);

  function closeComment() {
    setDisableScroll(false);
    setLastComment("");
    setComment("");
    setComments([]);
    setCommentInfo("");
    setDisplayComment(false);
    sessionStorage.setItem("comment", "");
    setCommentPage(0);
    textareaRef.current.style.height = 40 + "px";
    const deleteShowText = showText.filter((ID) => !showLess.includes(ID));
    setShowText(deleteShowText);
    setShowLess([]);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleIntersect(entries) {
    const getBottom = sessionStorage.getItem("bottom");
    if (newPost !== "發文") {
      if (getBottom !== "沒有下一頁") {
        if (entries[0].isIntersecting) {
          setPage((prePage) => prePage + 1);
          setScrollPosition(window.scrollY);
          setLoading(true);
        }
      }
    }
  }

  useEffect(() => {
    window.scrollTo({ top: scrollPosition, behavior: "instant" });
    observer.observe(elementRef.current);
    if (page < 1) {
      sessionStorage.setItem("bottom", "");
    }
    return () => {
      observer.disconnect();
    };
  }, [addObserver]);

  useEffect(() => {
    const dataNumber = 30;
    if (newPost !== "發文") {
      if (page < 1) {
        const imageRef = ref(storage, `sports/${getType + ".png"}`);
        getDownloadURL(imageRef)
          .then((link) => {
            setTypeIcon(link);
          })
          .catch((error) => {});
      }

      if (page > 0) {
        const postCollectionRef = collectionGroup(db, "post");
        const q = query(
          postCollectionRef,
          where("type", "==", getType),
          order,
          startAfter(lastVisible),
          limit(dataNumber)
        );
        const q2 = query(
          postCollectionRef,
          where("type", "==", getType),
          order,
          startAfter(lastVisible),
          limit(dataNumber + 1)
        );
        getDocs(q2).then((dataNext) => {
          if (dataNext.docs.length <= dataNumber) {
            getDocs(q).then((response) => {
              const postInfo = response.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              const contentArray = [];
              const showTextID = [];
              for (let i = 0; i <= postInfo.length - 1; i++) {
                if (postInfo[i].content.length > 100) {
                  contentArray.push(
                    postInfo[i].content.substring(0, 100) + "..."
                  );
                } else {
                  contentArray.push(postInfo[i].content);
                  showTextID.push(postInfo[i].id);
                }
              }
              setShowText([...showText, ...showTextID]);

              const postArray = [];
              for (let i = 0; i <= postInfo.length - 1; i++) {
                postArray.push({ ...postInfo[i], postLess: contentArray[i] });
              }
              setPosts([...posts, ...postArray]);
              const postlikeArray = postInfo.filter((postLike) =>
                postLike.likeName.includes(getUser)
              );
              const postlikeID = postlikeArray.map((postID) => postID.id);
              setLikedPosts([...likedPosts, ...postlikeID]);
              const collectedArray = postInfo.filter((collected) =>
                collected.collectName.includes(getUser)
              );
              const collectsID = collectedArray.map(
                (collectID) => collectID.id
              );
              setCollectedPosts([...collectedPosts, ...collectsID]);
              setLastVisible("");
              sessionStorage.setItem("bottom", "沒有下一頁");
              setLoading(false);
              setAddObserver((data) => !data);
            });
          }

          if (dataNext.docs.length > dataNumber) {
            getDocs(q).then((response) => {
              const postInfo = response.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));

              const contentArray = [];
              const showTextID = [];
              for (let i = 0; i <= postInfo.length - 1; i++) {
                if (postInfo[i].content.length > 100) {
                  contentArray.push(
                    postInfo[i].content.substring(0, 100) + "..."
                  );
                } else {
                  contentArray.push(postInfo[i].content);
                  showTextID.push(postInfo[i].id);
                }
              }
              setShowText([...showText, ...showTextID]);
              const postArray = [];
              for (let i = 0; i <= postInfo.length - 1; i++) {
                postArray.push({ ...postInfo[i], postLess: contentArray[i] });
              }
              setPosts([...posts, ...postArray]);
              const postlikeArray = postInfo.filter((postLike) =>
                postLike.likeName.includes(getUser)
              );
              const postlikeID = postlikeArray.map((postID) => postID.id);
              setLikedPosts([...likedPosts, ...postlikeID]);
              const collectedArray = postInfo.filter((collected) =>
                collected.collectName.includes(getUser)
              );
              const collectsID = collectedArray.map(
                (collectID) => collectID.id
              );
              setCollectedPosts([...collectedPosts, ...collectsID]);
              const lastData = response.docs[response.docs.length - 1];
              setLastVisible(lastData);
              setLoading(false);
              setAddObserver((data) => !data);
            });
          }
        });
      }
    }
    if (newPost == "發文") {
      sessionStorage.setItem("bottom", "");
      setScrollPosition(0);
      setPosts(false);
      setLoading(true);
    }
  }, [order, page]);

  let navigate = useNavigate();
  return (
    <div>
      <div>
        {loading ? (
          <div className={styles.loader}>
            <FadeLoader color={"#34eb8c"} loading={loading} size={100} />
          </div>
        ) : (
          <div>
            <SideBar />
            <div
              className={displayComment ? styles.comment_background : ""}
              onClick={closeComment}
            ></div>
            <div className={displayComment ? styles.comment_outside : ""}>
              <Scrollbars>
                <div className={displayComment ? styles.comment_all : ""}>
                  <div className={displayComment ? styles.comment_middle : ""}>
                    <div
                      className={
                        displayComment ? styles.comment_middle_inside : ""
                      }
                    >
                      <div
                        className={
                          displayComment
                            ? "comment_close active"
                            : "comment_close"
                        }
                      >
                        <img
                          className={
                            displayComment
                              ? "comment_close_img active"
                              : "comment_close_img"
                          }
                          src={closeButton}
                          onClick={closeComment}
                        ></img>
                      </div>
                      <div
                        className={
                          displayComment
                            ? "comment_title active"
                            : "comment_title"
                        }
                      >
                        所有留言
                      </div>
                      <div className={displayComment ? styles.comment : ""}>
                        <div
                          className={
                            displayComment ? styles.comment_member : ""
                          }
                        >
                          <div
                            className={
                              displayComment
                                ? "comment_image active"
                                : "comment_image"
                            }
                          >
                            <img
                              className={
                                displayComment
                                  ? "comment_image_img active"
                                  : "comment_image_img"
                              }
                              src={url}
                              onClick={() => navigate("/MyPage")}
                            ></img>
                          </div>
                          <div
                            className={
                              displayComment ? styles.comment_member_title : ""
                            }
                          >
                            <div
                              className={
                                displayComment
                                  ? "comment_name active"
                                  : "comment_name"
                              }
                            >
                              {userName}
                            </div>
                            <form
                              className={
                                displayComment ? styles.comment_input : ""
                              }
                              onSubmit={handleSubmit}
                            >
                              <textarea
                                className={
                                  displayComment
                                    ? "comment_textarea active"
                                    : "comment_textarea"
                                }
                                placeholder="我的留言..."
                                value={Comment}
                                onChange={inputComment}
                                ref={textareaRef}
                              ></textarea>
                              <div>
                                <button
                                  className={
                                    displayComment
                                      ? "comment_button active"
                                      : "comment_button"
                                  }
                                  type="submit"
                                >
                                  送出
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      {comments && !commentLoading ? (
                        <div>
                          {comments.map((comment) => (
                            <div
                              className={displayComment ? styles.comment : ""}
                            >
                              <div
                                className={
                                  displayComment ? styles.comment_line : ""
                                }
                              >
                                <div
                                  className={
                                    displayComment
                                      ? styles.comment_line_inside
                                      : ""
                                  }
                                ></div>
                              </div>
                              <div
                                className={
                                  displayComment ? styles.comment_member : ""
                                }
                              >
                                <div
                                  className={
                                    displayComment
                                      ? "comment_image active"
                                      : "comment_image"
                                  }
                                  onClick={() => ToMember(comment.uid)}
                                >
                                  <img
                                    className={
                                      displayComment
                                        ? "comment_image_img active"
                                        : "comment_image_img"
                                    }
                                    src={comment.avatar}
                                  ></img>
                                </div>
                                <div
                                  className={
                                    displayComment
                                      ? styles.comment_member_title
                                      : ""
                                  }
                                >
                                  <div
                                    className={
                                      displayComment
                                        ? styles.comment_name_top
                                        : ""
                                    }
                                  >
                                    <div
                                      className={
                                        displayComment
                                          ? "comment_name active"
                                          : "comment_name"
                                      }
                                    >
                                      {comment.Name}
                                    </div>
                                    <div
                                      className={
                                        displayComment
                                          ? "comment_date active"
                                          : "comment_date"
                                      }
                                    >
                                      {comment.day}
                                    </div>
                                    <div
                                      className={
                                        displayComment
                                          ? "comment_date active"
                                          : "comment_date"
                                      }
                                    >
                                      {comment.time}
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      displayComment
                                        ? "comment_message active"
                                        : "comment_message"
                                    }
                                  >
                                    {comment.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.loader_comment}>
                          <FadeLoader
                            color={"#34eb8c"}
                            loading={commentLoading}
                            size={100}
                          />
                        </div>
                      )}
                      <div
                        ref={commentRef}
                        className={displayComment ? styles.comment_bottom : ""}
                      ></div>
                    </div>
                  </div>
                </div>
              </Scrollbars>
            </div>

            <div className={displaySidebar ? "homePage active" : "homePage"}>
              <div className={styles.homepage}>
                <div className={styles.middle}>
                  <div className={styles.middle_head}>
                    <div className={styles.head}>
                      <div className={styles.head_content}>
                        <div className={styles.head_content_img}>
                          <img src={typeIcon} onClick={closeComment}></img>
                        </div>
                        <div className={styles.head_content_text1}>
                          {getType}
                        </div>
                        <div className={styles.head_content_text}>
                          <button
                            className={
                              hotType
                                ? styles.head_content_text2
                                : styles.head_content_text3
                            }
                            onClick={hotPost}
                          >
                            熱門貼文
                          </button>
                          <button
                            className={
                              LatestType
                                ? styles.head_content_text2
                                : styles.head_content_text3
                            }
                            onClick={LatestPost}
                          >
                            最新貼文
                          </button>
                        </div>
                        <div className={styles.head_content_heart}>
                          <img src={heart}></img>
                        </div>
                        <div className={styles.form_search}>
                          <div className={styles.form_search_button_outside}>
                            <button
                              className={styles.form_search_button}
                              type="submit"
                            >
                              <img src={search} />
                            </button>
                          </div>
                          <div className={styles.form_search_input_outside}>
                            <input
                              className={styles.form_search_input}
                              placeholder="搜尋 我愛爬山~"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.middle_content}></div>
                  </div>
                  <div className={styles.background}></div>
                  <div className={styles.scrollbars}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#edf0ee",
                      }}
                    >
                      <div className={styles.all}>
                        <div className={styles.under}>
                          <div className={styles.under_left}>
                            {posts ? (
                              <div>
                                {posts.map((post) => (
                                  <div
                                    className={styles.under_left_content}
                                    key={post.id}
                                  >
                                    <div
                                      className={
                                        styles.under_left_content_inside
                                      }
                                    >
                                      <div className={styles.under_left_title}>
                                        <div
                                          className={styles.under_left_selfie}
                                          onClick={() => ToMember(post.uid)}
                                        >
                                          <img src={post.avatar}></img>
                                          <div
                                            className={
                                              styles.under_left_name_outside
                                            }
                                          >
                                            <div
                                              className={styles.under_left_name}
                                            >
                                              {post.Name}
                                            </div>
                                          </div>
                                        </div>
                                        <div className={styles.under_left_top}>
                                          <div
                                            className={styles.under_left_date}
                                          >
                                            {new Date(
                                              post.createAt.seconds * 1000
                                            ).toLocaleDateString("zh-TW")}
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className={styles.under_left_text_div}
                                      >
                                        {showText.includes(post.id) ? (
                                          <div
                                            className={styles.under_left_text}
                                          >
                                            {post.content}
                                          </div>
                                        ) : (
                                          <div
                                            className={styles.under_left_text}
                                          >
                                            {post.postLess}
                                          </div>
                                        )}
                                        <div
                                          className={
                                            styles.under_left_text_showMore_outside
                                          }
                                        >
                                          <div
                                            className={
                                              post.postLess === post.content
                                                ? styles.under_left_text_showMore_none
                                                : styles.under_left_text_showMore
                                            }
                                            onClick={() => showContent(post.id)}
                                          >
                                            {showLess.includes(post.id)
                                              ? "顯示更少"
                                              : "顯示更多"}
                                          </div>
                                        </div>
                                      </div>

                                      {post.picture && (
                                        <div
                                          className={styles.under_left_image}
                                        >
                                          <img src={post.picture}></img>
                                        </div>
                                      )}

                                      <div
                                        className={styles.under_left_message}
                                      >
                                        <div
                                          className={styles.under_left_icons}
                                        >
                                          <div
                                            className={
                                              styles.under_left_icons_like
                                            }
                                            onClick={() => ThumbUp(post)}
                                          >
                                            <img
                                              src={
                                                likedPosts.includes(post.id)
                                                  ? like
                                                  : unlike
                                              }
                                            ></img>
                                            <div
                                              className={
                                                post.like === 0
                                                  ? styles.under_left_icons_text_hidden
                                                  : styles.under_left_icons_text
                                              }
                                            >
                                              {post.like}
                                            </div>
                                          </div>
                                          <div
                                            className={
                                              styles.under_left_icons_comment
                                            }
                                            onClick={() => showComment(post)}
                                          >
                                            <img src={comment}></img>
                                            <div
                                              className={
                                                post.commentNumber === 0
                                                  ? styles.under_left_icons_text_hidden
                                                  : styles.under_left_icons_text
                                              }
                                            >
                                              {post.commentNumber}
                                            </div>
                                          </div>
                                          <div
                                            className={
                                              styles.under_icons_bookmark
                                            }
                                            onClick={() => Collect(post)}
                                          >
                                            <img
                                              src={
                                                collectedPosts.includes(post.id)
                                                  ? collected
                                                  : uncollected
                                              }
                                            ></img>
                                            <div
                                              className={
                                                styles.under_icons_bookmark_text
                                              }
                                            >
                                              {collectedPosts.includes(post.id)
                                                ? "取消收藏"
                                                : "加入收藏"}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className={styles.under_right_outside}>
                            <div className={styles.under_right}>
                              <div className={styles.under_right_rules}>
                                <div className={styles.under_right_rules_about}>
                                  <div
                                    className={
                                      styles.under_right_rules_about_text
                                    }
                                  >
                                    公告
                                  </div>
                                  <div
                                    className={
                                      styles.under_right_rules_about_img
                                    }
                                  >
                                    <img src={speaker}></img>
                                  </div>
                                </div>
                                <div
                                  className={styles.under_right_rules_line}
                                ></div>
                                <div className={styles.under_right_rules_info}>
                                  <div
                                    className={
                                      styles.under_right_rules_info_content_intro
                                    }
                                  >
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_up
                                      }
                                    >
                                      請各位成員遵守以下須知，違者將刪文:
                                    </div>
                                  </div>

                                  <div
                                    className={
                                      styles.under_right_rules_info_content_intro
                                    }
                                  >
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_left
                                      }
                                    >
                                      <div
                                        className={
                                          styles.under_right_rules_info_content_intro_left_text
                                        }
                                      >
                                        1.
                                      </div>
                                    </div>
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_right
                                      }
                                    >
                                      不得PO與社群無關的廢文，違者將刪文
                                    </div>
                                  </div>

                                  <div
                                    className={
                                      styles.under_right_rules_info_content_intro
                                    }
                                  >
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_left
                                      }
                                    >
                                      <div
                                        className={
                                          styles.under_right_rules_info_content_intro_left_text
                                        }
                                      >
                                        2.
                                      </div>
                                    </div>
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_right
                                      }
                                    >
                                      請勿瘋狂洗版廣告貼文，違者將刪文
                                    </div>
                                  </div>

                                  <div
                                    className={
                                      styles.under_right_rules_info_content_intro
                                    }
                                  >
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_left
                                      }
                                    >
                                      <div
                                        className={
                                          styles.under_right_rules_info_content_intro_left_text
                                        }
                                      >
                                        3.
                                      </div>
                                    </div>
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_right
                                      }
                                    >
                                      請勿在留言區任意攻擊他人或是留下令人不舒服的留言，違者將刪除留言
                                    </div>
                                  </div>

                                  <div
                                    className={
                                      styles.under_right_rules_info_content_intro
                                    }
                                  >
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_left
                                      }
                                    >
                                      <div
                                        className={
                                          styles.under_right_rules_info_content_intro_left_text
                                        }
                                      >
                                        4.
                                      </div>
                                    </div>
                                    <div
                                      className={
                                        styles.under_right_rules_info_content_intro_right
                                      }
                                    >
                                      若經由檢舉詐騙行為屬實，帳號將停權處分
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div ref={elementRef} className={styles.footer}>
                          COPYRIGHT © 2023 Sporty
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
