import styles from "../styles/memberpage.module.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2"
import hiking from "../assets/sport/hiking.png";
import heart from "../assets/heart2.png"
import search from "../assets/search4.png";
import me from "../assets/me2.jpg"
import eka from "../assets/eka.jpg"
import bookmark from "../assets/bookmark-gray.png"
import spread from "../assets/spread1.png"
import like from "../assets/like.png"
import comment from "../assets/comment.png"
import member1 from "../assets/member1.jpg"
import snow from "../assets/snow.jpg"
import message from "../assets/message7.png"
import cat from "../assets/cat.jpg"
import head from "../assets/head.jpg"

function Home() {
    let navigate = useNavigate()
    return <div className={styles.homepage}>
        <div className={styles.middle}>
            <div className={styles.middle_head}>
                <div className={styles.head}>
                    <div className={styles.head_content}>
                        <img className={styles.head_content_hiking} src={member1}></img>
                        <div className={styles.head_content_text1}>我是喬八喬八是我   </div>
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
                <Scrollbars style={{ width: "100%", height: "100vh", backgroundColor: "#edf0ee", }} >
                    <div className={styles.under}>
                        <div className={styles.under_left}>
                            <div className={styles.under_left_content}>
                                <div className={styles.under_left_content_inside}>
                                    <div className={styles.under_left_title}>
                                        <div className={styles.under_left_selfie}>
                                            <img src={member1}></img>
                                            <div className={styles.under_left_name_outside}>
                                                <div className={styles.under_left_name}>我是喬八喬八是我</div>
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
                                    <div className={styles.under_left_image}><img src={snow}></img></div>
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

                            <div className={styles.under_left_content}>
                                <div className={styles.under_left_content_inside}>
                                    <div className={styles.under_left_title}>
                                        <div className={styles.under_left_selfie}>
                                            <img src={member1}></img>
                                            <div className={styles.under_left_name_outside}>
                                                <div className={styles.under_left_name}>我是喬八喬八是我</div>
                                                {/* <div className={styles.under_left_date}>2023/01/28</div> */}
                                            </div>
                                        </div>
                                        <div className={styles.under_left_top}>
                                            <div className={styles.under_left_date}>2023/01/29</div>
                                            <div><img className={styles.under_left_bookmark} src={bookmark}></img></div>
                                        </div>
                                    </div>
                                    <div className={styles.under_left_text_all}>
                                        <div className={styles.under_left_text_top}>
                                            <div className={styles.under_left_text}>分享一下陽明山東西大縱走的心得，這次走的路線是十連峰，全長約28K，爬升17xxm，很不幸天公不作美，爬到一半就下起大雷雨，安全起見，只走完2/3就先撤退了，沿途滿多撤退點，還有五星級廁所和商店，滿</div>
                                        </div>
                                        <div >
                                            <img className={styles.under_left_text_image} src={spread}></img>
                                        </div>
                                    </div>

                                    <div className={styles.under_left_message}>
                                        <div className={styles.under_left_icons}>
                                            <div className={styles.under_left_icons_like}>
                                                <img src={like}></img>
                                                <div className={styles.under_left_icons_text1}>168</div>
                                            </div>
                                            <div className={styles.under_left_icons_comment}>
                                                <img src={comment}></img>
                                                <div className={styles.under_left_icons_text2}>8</div>
                                            </div>
                                        </div>

                                        <div className={styles.under_left_comment_all}>
                                            <div className={styles.under_left_comment}>
                                                <div className={styles.under_left_comment_member}>
                                                    <div className={styles.under_left_comment_image}><img src={cat}></img></div>
                                                    <div className={styles.under_left_comment_member_title}>
                                                        <div className={styles.under_left_comment_name}>奔奔</div>
                                                        <div className={styles.under_left_comment_message}>這真的老少咸宜的路線!沿路風景又很美，想去惹~~</div>
                                                    </div>
                                                </div>

                                                <div className={styles.under_left_comment_line}>
                                                    <div className={styles.under_left_comment_line_inside}></div>
                                                </div>
                                                <div className={styles.under_left_comment_member}>
                                                    <div className={styles.under_left_comment_image}><img src={head}></img></div>
                                                    <div className={styles.under_left_comment_member_title}>
                                                        <div className={styles.under_left_comment_name}>超人不會飛</div>
                                                        <div className={styles.under_left_comment_message}>請問慢腳的話大概要走多久?</div>
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
                                <div>關於我</div>
                                <div className={styles.under_right_rules_line}></div>
                                <div>興趣: 水肺潛水、爬山、野營、跑步、武術</div>
                                <div>自我介紹: 身為一個為了旅遊而活的女紙...2017年從澳洲打工度假回台灣，平常喜歡運動、上山下海～爬山、野營、露營、游泳、跑步、潛水，然後再大吃美食~運動是為了吃的更多，爬山野營進度-加里山/五寮尖/東卯山/五指山/四稜溫泉/栗松溫泉/陽明山縱走/雪山…</div>
                                <div>性別: 女</div>
                                <div>居住地: 台北</div>
                                <div>生日: 1992/08/29</div>


                            </div>
                        </div>


                    </div>

                </Scrollbars >
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

export default Home;

// window.addEventListener("load", () => {
//     const container = document.getElementById('root');
//     const root = createRoot(container);
//     root.render(<MyHead />);
// });