import styles from "../styles/mypage.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useState, useEffect } from "react";
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
import book from "../assets/book.png"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import { collection, getDoc, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot, getDocFromCache } from "firebase/firestore";
function MyPage() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUser = localStorage.getItem("user")
        const userDoc = doc(db, "users", getUser);
        onSnapshot(userDoc, (snapshot) =>
            getDoc(setUsers(snapshot.data())))

        // getDoc(userDoc)
        //         .then((response) => {
        //             const data = response.data()
        //             setUsers(data)
        //         });
        return () => {
            console.log("unsubscribe");
            unsubscribe() //在react dom消失的時候也就取消onSnapshot了
        }


    }, []);

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
    return <div className={styles.homepage}>
        <div className={styles.middle}>
            <div className={myNavbar ? "middle_head active" : "middle_head"}>
                <div className={styles.head}>
                    <div className={styles.head_content}>
                        <img className={styles.head_content_hiking} src={me}></img>
                        <div className={styles.head_content_text1}>{users.Name}</div>
                        <button className={styles.head_content_text2}>我的貼文</button>
                        <button className={styles.head_content_text3}>收藏貼文</button>
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

            <div className={styles.scrollbars}>
                <div style={{ width: "100%", height: "100%", backgroundColor: "#edf0ee", }} >
                    {/* <Scrollbars style={{ width: "100%", height: "100vh", backgroundColor: "#edf0ee", }} > */}
                    <div className={styles.all}>
                        <div className={styles.all_title}>
                            <div className={styles.title}>
                                <div className={styles.title_content}>
                                    <div className={styles.title_content_img}><img src={me}></img></div>
                                    <div className={styles.title_content_profile}>
                                        <div className={styles.title_content_name}>{users.Name}</div>
                                        <div className={styles.title_content_line}></div>
                                        <div className={styles.title_content_intro}>{users.About}</div>
                                    </div>
                                    <div className={styles.title_content_right}>
                                        <button className={styles.title_content_post}>我的貼文</button>
                                        <button className={styles.title_content_collection}>收藏貼文</button>
                                        <div className={styles.title_content_search}>
                                            <div className={styles.title_content_search_button_outside}>
                                                <button className={styles.title_content_search_button} type="submit"><img src={search} /></button>
                                            </div>
                                            <div className={styles.title_content_search_input_outside}>
                                                <input className={styles.title_content_search_input} placeholder="搜尋 我的貼文~" type="text" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className={styles.under}>
                            <div className={styles.under_left}>


                                <div className={styles.under_left_content}>
                                    <div className={styles.under_left_content_inside}>
                                        <div className={styles.under_left_title}>
                                            <div className={styles.under_left_selfie}>
                                                <img src={me}></img>
                                                <div className={styles.under_left_name_outside}>
                                                    <div className={styles.under_left_name}>Zora Wu</div>
                                                    {/* <div className={styles.under_left_date}>2023/01/28</div> */}
                                                </div>
                                            </div>
                                            <div className={styles.under_left_top}>
                                                <div className={styles.under_left_date}>2023/01/28</div>
                                                <div><img className={styles.under_left_bookmark} src={bookmark}></img></div>
                                            </div>
                                        </div>
                                        <div className={styles.under_left_text_all}>
                                            <div className={styles.under_left_text_top}>
                                                <div className={styles.under_left_text}>台灣第二高峰，雪主東完攀!</div>
                                                <div className={styles.under_left_text}>很幸運這幾天山上都是好天氣，一路上都出大景，人品大爆發XD這次的路線是從:第一天晚上七卡山莊>隔天凌晨早起到東峰看日出>再到369山莊報</div>
                                            </div>
                                            <div >
                                                <img className={styles.under_left_text_image} src={spread}></img>
                                            </div>
                                        </div>
                                        <div className={styles.under_left_image}><img src={summit}></img></div>
                                        <div className={styles.under_left_message}>
                                            <div className={styles.under_left_icons}>
                                                <div className={styles.under_left_icons_like}>
                                                    <img src={like}></img>
                                                    <div className={styles.under_left_icons_text1}>666</div>
                                                </div>
                                                <div className={styles.under_left_icons_comment}>
                                                    <img src={comment}></img>
                                                    <div className={styles.under_left_icons_text2}>16</div>
                                                </div>
                                            </div>

                                            <div className={styles.under_left_comment_all}>
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
                                            </div>
                                            <div className={styles.under_left_button}><img src={message}></img></div>
                                        </div>
                                    </div>
                                </div>


                            </div>

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
                                                <div className={styles.under_right_rules_info_content_intro_left_text}>興趣</div>
                                            </div>
                                            <div className={styles.under_right_rules_info_content_intro_right}>水肺潛水、爬山、野營、跑步、武術</div>
                                        </div>

                                        <div className={styles.under_right_rules_info_content_intro}>
                                            <div className={styles.under_right_rules_info_content_intro_left}>
                                                <div className={styles.under_right_rules_info_content_intro_left_text}>自我</div>
                                                <div className={styles.under_right_rules_info_content_intro_left_text}>介紹</div>
                                            </div>
                                            <div className={styles.under_right_rules_info_content_intro_right}>{users.About}</div>
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
                                            <div className={styles.under_right_rules_info_content_right}>1010/10/10</div>
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

export default MyPage;

// window.addEventListener("load", () => {
//     const container = document.getElementById('root');
//     const root = createRoot(container);
//     root.render(<MyHead />);
// });