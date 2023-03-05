import scuba_diving from "../../assets/sport/water/scuba_diving.png"
import hiking from "../../assets/sport/hiking.png"
import bonfire from "../../assets/sport/bonfire.png"
import running from "../../assets/sport/running.png"
import kung_fu from "../../assets/sport/kung_fu.png"
import pull_ball_red from "../../assets/heart2.png"
import pull_ball_black from "../../assets/heart-gray.png"
import me from "../../assets/me2.jpg"
import "typeface-quicksand"
import water_all from "../../data/data-water"


import styles from "../../styles/water.module.css";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase-config";
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot } from "firebase/firestore";
import { async } from "@firebase/util";

function Category() {

    let navigate = useNavigate()
    return <div className={styles.category_shadow}>
        <div className={styles.category_outside}>
            <Scrollbars style={{ width: "100%", height: "100vh" }}>
                <div className={styles.category}>
                    <div className={styles.category_member} onClick={() => { navigate("/Mypage") }}>
                        <div className={styles.category_member_selfie}>
                            <img src={me}></img>
                        </div>
                        <div className={styles.category_member_name}>Zora Wu</div>
                    </div>
                    {/* <div className={styles.category_content_line}></div> */}
                    <div className={styles.category_content}>我的最愛</div>
                    <div className={styles.category_content_line_outside}>
                        <div className={styles.category_content_line}></div>
                    </div>

                    <div className={styles.category_content_group_outside}>
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

                    <div className={styles.category_content_group_outside} onClick={() => { navigate("/Hiking") }}>
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

                    <div className={styles.category_content_group_outside}>
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


                    <div className={styles.category_content_group_outside}>
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

                    <div className={styles.category_content_group_outside}>
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


                    <div className={styles.category_content}>所有社群</div>
                    <div className={styles.category_content_line_outside}>
                        <div className={styles.category_content_line}></div>
                    </div>
                    <div className={styles.category_content_all}>
                        <button className={styles.category_content_all_ball} onClick={() => { navigate("/Ball") }}>球類</button>
                        <button className={styles.category_content_all_water} onClick={() => { navigate("/Water") }}>水上</button>
                        <button className={styles.category_content_all_outdoor} onClick={() => { navigate("/Outdoor") }}>戶外</button>
                        <button className={styles.category_content_all_fitness} onClick={() => { navigate("/Fitness") }}>健身</button>
                    </div>


                    {water_all.map(water => <div className={styles.category_content_group_outside} key={water.name}>
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_image}>
                                <img src={water.images} />
                            </div>
                            <div className={styles.category_content_group_text}>
                                <div className={styles.category_content_group_sport}>{water.name}</div>
                                <div className={styles.category_content_group_type}>&emsp;/ {water.type} &emsp;</div>
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