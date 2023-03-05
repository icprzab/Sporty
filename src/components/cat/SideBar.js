import scuba_diving from "../../assets/sport/water/scuba_diving.png"
import hiking from "../../assets/sport/hiking.png"
import bonfire from "../../assets/sport/bonfire.png"
import running from "../../assets/sport/running.png"
import kung_fu from "../../assets/sport/kung_fu.png"
import pull_ball_red from "../../assets/heart2.png"
import pull_ball_black from "../../assets/heart-gray.png"
import me from "../../assets/me2.jpg"
import "typeface-quicksand"
import balls from "../../data/data-ball"
import fitness_all from "../../data/data-fitness"
import outdoor_all from "../../data/data-outdoor"
import water_all from "../../data/data-water"
import styles from "../../styles/sidebar.module.css";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase-config";
import { collection, getDoc, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot, getDocFromCache } from "firebase/firestore";
import { async } from "@firebase/util";
import { useContext } from "react"
import { dataContext } from "../../context/dataContext"
import { AuthContext } from "../../context/Authcontext"
import { imageContext } from "../../context/imageContext"
import { NameContext } from "../../context/NameContext"
import { GroupContext } from "../../context/GroupContext"
function Category() {
    const { group, setGroup } = useContext(GroupContext);
    const { userName, setUserName } = useContext(NameContext);
    const [user, setUser] = useState([]);
    const [brown, setBrown] = useState([]);
    const [blue, setBlue] = useState(false);
    const [green, setGreen] = useState(false);
    const [purple, setPurple] = useState(false);
    const { value, setValue } = useContext(dataContext);
    const { url, setUrl } = useContext(imageContext);
    // let lists = []
    // for (let i = 0; i <= value.length - 1; i++) {
    //     //記得在JSX中使用JS變數要用花括號包著
    //     lists.push(<div className={styles.category_content_group_outside} key={value[i].name} onClick={groupName(i)}>
    //         <div className={styles.category_content_group}>
    //             <div className={styles.category_content_group_image}>
    //                 <img src={value[i].images} />
    //             </div>
    //             <div className={styles.category_content_group_text}>
    //                 <div className={styles.category_content_group_sport} >{value[i].name}</div>
    //                 <div className={styles.category_content_group_type}>&emsp;/ {value[i].type} &emsp;</div>
    //             </div>
    //         </div>
    //         <div className={styles.category_content_pullBall}><img src={pull_ball_black} /></div>
    //     </div>)
    // }
    let navigate = useNavigate()
    // useEffect(() => {

    //     const getUser = localStorage.getItem("user")
    //     const userDoc = doc(db, "users", getUser);
    //     getDoc(userDoc)
    //         .then((response) => {
    //             const data = response.data()
    //             setUser(data)
    //         });

    // }, []);

    function groupName(data) {
        localStorage.setItem("type", data)
        setGroup(data)
        navigate("/Hiking")
    }

    function ball() {
        setValue(balls)
    }

    function fitness() {
        setValue(fitness_all)
    }

    function outdoor() {
        setValue(outdoor_all)
    }

    function water() {
        setValue(water_all)
    }


    return <div className={styles.category_shadow}>

        <div className={styles.category_outside}>
            <Scrollbars style={{ width: "100%", height: "100vh" }}>
                <div className={styles.category}>
                    <div className={styles.category_member} onClick={() => { navigate("/Mypage") }}>
                        <div className={styles.category_member_selfie}>
                            <img src={url}></img>
                        </div>
                        <div className={styles.category_member_name}>{userName}</div>
                    </div>

                    {/* <div className={styles.category_content}>我的最愛</div>
                    <div className={styles.category_content_line_outside}>
                        <div className={styles.category_content_line}></div>
                    </div>

                    <div className={styles.category_content_group_outside} onClick={() => groupName("水肺潛水")}>
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_image}>
                                <img src={scuba_diving} />
                            </div>
                            <div className={styles.category_content_group_text}>
                                <div className={styles.category_content_group_sport}>水肺潛水</div>
                                <div className={styles.category_content_group_type}>&emsp;/ 水上 &emsp;</div>
                            </div>
                        </div>
                        <div className={styles.category_content_pullBall}><img src={pull_ball_red} /></div>
                    </div>

                    <div className={styles.category_content_group_outside} onClick={() => groupName("爬山")}>
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_image}>
                                <img src={hiking} />
                            </div>
                            <div className={styles.category_content_group_text} >
                                <div className={styles.category_content_group_sport} >爬山</div>
                                <div className={styles.category_content_group_type}>&emsp;/ 戶外 &emsp;</div>
                            </div>
                        </div>
                        <div className={styles.category_content_pullBall}><img src={pull_ball_red} /></div>
                    </div>

                    <div className={styles.category_content_group_outside} onClick={() => groupName("野營")}>
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_image}>
                                <img src={bonfire} />
                            </div>
                            <div className={styles.category_content_group_text}>
                                <div className={styles.category_content_group_sport}>野營</div>
                                <div className={styles.category_content_group_type}>&emsp;/ 戶外 &emsp;</div>
                            </div>
                        </div>
                        <div className={styles.category_content_pullBall}><img src={pull_ball_red} /></div>
                    </div>


                    <div className={styles.category_content_group_outside} onClick={() => groupName("跑步")}>
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_image}>
                                <img src={running} />
                            </div>
                            <div className={styles.category_content_group_text}>
                                <div className={styles.category_content_group_sport}>跑步</div>
                                <div className={styles.category_content_group_type}>&emsp;/ 戶外 &emsp;</div>
                            </div>
                        </div>
                        <div className={styles.category_content_pullBall}><img src={pull_ball_red} /></div>
                    </div>

                    <div className={styles.category_content_group_outside} onClick={() => groupName("武術")}>
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_image}>
                                <img src={kung_fu} />
                            </div>
                            <div className={styles.category_content_group_text}>
                                <div className={styles.category_content_group_sport}>武術</div>
                                <div className={styles.category_content_group_type}>&emsp;/ 健身 &emsp;</div>
                            </div>
                        </div>
                        <div className={styles.category_content_pullBall}><img src={pull_ball_red} /></div>
                    </div>
 */}

                    <div className={styles.category_content}>所有社群</div>
                    <div className={styles.category_content_line_outside}>
                        <div className={styles.category_content_line}></div>
                    </div>
                    <div className={styles.category_content_all}>
                        <button className={styles.category_content_all_ball} onClick={ball}>球類</button>
                        <button className={styles.category_content_all_water} onClick={water}>水上</button>
                        <button className={styles.category_content_all_outdoor} onClick={outdoor}>戶外</button>
                        <button className={styles.category_content_all_fitness} onClick={fitness}>健身</button>
                    </div>
                    {/* 
                    {lists} */}

                    {value.map(type => <div className={styles.category_content_group_outside} key={type.name} onClick={() => groupName(type.name)} >
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_image}>
                                <img src={type.images} />
                            </div>
                            <div className={styles.category_content_group_text}>
                                <div className={styles.category_content_group_sport} >{type.name}</div>
                                <div className={styles.category_content_group_type}>&emsp;/ {type.type} &emsp;</div>
                            </div>
                        </div>
                        <div className={styles.category_content_pullBall}><img src={pull_ball_black} /></div>
                    </div>)}
                </div>
            </Scrollbars >
        </div >
    </div >
}

export default Category;