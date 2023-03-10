import scuba_diving from "../assets/sport/scubadiving.png";
import hiking from "../assets/sport/hiking.png";
import bonfire from "../assets/sport/bonfire.png";
import running from "../assets/sport/running.png";
import kung_fu from "../assets/sport/kung_fu.png";
import pull_ball_red from "../assets/heart2.png"
import pull_ball_black from "../assets/heart-gray.png"
import basketball from "../assets/sport/basketball.png"
import baseball from "../assets/sport/baseball.png"
import badminton from "../assets/sport/badminton2.png"
import table_tennis from "../assets/sport/table_tennis.png"
import volley_ball from "../assets/sport/volleyball.png"
import tennis from "../assets/sport/tennis.png"
import soccer from "../assets/sport/soccer.png"
import pool_ball from "../assets/sport/pool_ball.png"
import squash from "../assets/sport/squash.png"
import bowling from "../assets/sport/bowling.png"
import golf from "../assets/sport/golf.png"
import free_dive from "../assets/sport/free_dive.png"
import surfing from "../assets/sport/surfing.png"
import life_jacket from "../assets/sport/life_jacket.png"
import swim from "../assets/sport/swim.png"
import fishing from "../assets/sport/fishing.png"
import kayak from "../assets/sport/kayak.png"
import SUP from "../assets/sport/SUP.png"

import styles from "../styles/category.module.css";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { db } from "../firebase-config";
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot } from "firebase/firestore";
import { async } from "@firebase/util";


function Category() {
    const [balls, setBalls] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [test, setTest] = useState([]);
    const [list, setList] = useState([]);

    const userCollectionRef = collection(db, "sports");
    const imageListRef = ref(storage, "balls/")

    let lists = []

    useEffect(() => {
        getDocs(userCollectionRef)
            .then(response => {
                const ballsInfo = response.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                setBalls(ballsInfo);
                listAll(imageListRef).then((response) => {
                    async function getDownLoad() {
                        let t = [];
                        const URL1 = await getDownloadURL(response.items[0]);
                        await t.push(URL1);

                        const URL2 = await getDownloadURL(response.items[1]);
                        await t.push(URL2);

                        const URL3 = await getDownloadURL(response.items[2]);
                        await t.push(URL3);

                        const URL4 = await getDownloadURL(response.items[3]);
                        await t.push(URL4);

                        const URL5 = await getDownloadURL(response.items[4]);
                        await t.push(URL5);

                        const URL6 = await getDownloadURL(response.items[5]);
                        await t.push(URL6);

                        const URL7 = await getDownloadURL(response.items[6]);
                        await t.push(URL7);

                        const URL8 = await getDownloadURL(response.items[7]);
                        await t.push(URL8);

                        const URL9 = await getDownloadURL(response.items[8]);
                        await t.push(URL9);

                        const URL10 = await getDownloadURL(response.items[9]);
                        await t.push(URL10);

                        const URL11 = await getDownloadURL(response.items[10]);
                        await t.push(URL11);



                        for (let i = 0; i < response.items.length; i++) {

                            lists.push(<div className={styles.category_content_group_outside}>
                                <div className={styles.category_content_group}>
                                    <div className={styles.category_content_group_inside}>
                                        <img src={t[i]} />
                                        {/* <div>{balls[i]["name"]}</div> */}
                                    </div>
                                    <div className={styles.category_content_group_type}>&emsp;/ {balls[i]["type"]} &emsp;</div>
                                </div>
                                <button className={styles.category_content_pullBall}><img src={pull_ball_black} /></button>
                            </div>)

                            setList(lists)

                        }

















                    }
                    getDownLoad();

                    // for (let i = 0; i < response.items.length; i++) {
                    //     getDownloadURL(response.items[i])
                    //         .then((url) => {
                    //             let merge = { name: ballsInfo[i]["name"], type: ballsInfo[i]["type"], id: ballsInfo[i]["id"], image: url }
                    //             setImageList((prev) => [...prev, merge])
                    //         })
                    // }

                })
            });

        // listAll(imageListRef).then((response) => {
        //     let imageURL = [];
        //     let merge = [];
        //     response.items.map(
        //         item => {
        //             getDownloadURL(item)
        //                 .then((url) => { imageURL.push(url) })
        //         })


        //     for (let i = 0; i < imageURL.length; i++) {
        //         merge.push({ "message": imageURL[i] })


        //     }
        //     setImageList(imageURL)
        // })

    }, []);



    return <Scrollbars style={{ width: "20vw", height: "100vh" }}>
        {console.log(test)}
        <div className={styles.category_outside}>
            <div className={styles.category}>
                <div className={styles.category_content}>Zora</div>
                <div className={styles.category_content_line}></div>
                <div className={styles.category_content}>????????????</div>
                <div className={styles.category_content_line}></div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={scuba_diving} />
                            <div>????????????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ??????&emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={hiking} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={bonfire} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={running} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>

                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={kung_fu} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content}>????????????</div>
                <div className={styles.category_content_line}></div>
                <div className={styles.category_content_all}>
                    <div className={styles.category_content_all_ball}>??????</div>
                    <div className={styles.category_content_all_water}>??????</div>
                    <div className={styles.category_content_all_outdoor}>??????</div>
                    <div className={styles.category_content_all_fitness}>??????</div>
                </div>


                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={basketball} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <button className={styles.category_content_pullBall}><img src={pull_ball_black} /></button>
                </div>


                {/* {imageList.map(ball => <div className={styles.category_content_group_outside} key={ball.id}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={ball.image} />
                            <div>{ball.name}</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ {ball.type} &emsp;</div>
                    </div>
                    <button className={styles.category_content_pullBall}><img src={pull_ball_black} /></button>
                </div>)} */}

                <div>
                    {list}
                </div>

                {/* {for (let i = 0; i < response.items.length; i++){
                    <div className={styles.category_content_group_outside} key={ball.id}>
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_inside}>
                                <img src={ball.image} />
                                <div>{ball.name}</div>
                            </div>
                            <div className={styles.category_content_group_type}>&emsp;/ {ball.type} &emsp;</div>
                        </div>
                        <button className={styles.category_content_pullBall}><img src={pull_ball_black} /></button>
                    </div>
                    }} */}























                {/* <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={baseball} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={badminton} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={table_tennis} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={volley_ball} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={tennis} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={soccer} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={pool_ball} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={squash} />
                            <div>??????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={bowling} />
                            <div>?????????</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={golf} />
                            <div>????????????</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ ?????? &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

 */}

            </div>
        </div >
    </Scrollbars >
}

export default Category;