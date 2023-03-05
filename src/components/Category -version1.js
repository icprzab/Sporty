import styles from "../styles/category.module.css";
import React from "react";
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
import { Scrollbars } from "react-custom-scrollbars-2"


function Category() {
    return <Scrollbars style={{ width: "20vw", height: "100vh" }}>
        <div className={styles.category_outside}>
            <div className={styles.category}>
                <div className={styles.category_content}>我的最愛</div>
                <div className={styles.category_content_line}></div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={scuba_diving} />
                            <div>水肺潛水</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 水上&emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={hiking} />
                            <div>爬山</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 戶外 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={bonfire} />
                            <div>野營</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 戶外 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={running} />
                            <div>跑步</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 戶外 &emsp;</div>

                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={kung_fu} />
                            <div>武術</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 健身 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content}>所有社群</div>
                <div className={styles.category_content_line}></div>
                <div className={styles.category_content_all}>
                    <div className={styles.category_content_all_ball}>球類</div>
                    <div className={styles.category_content_all_water}>水上</div>
                    <div className={styles.category_content_all_outdoor}>戶外</div>
                    <div className={styles.category_content_all_fitness}>健身</div>
                </div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={basketball} />
                            <div>籃球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={baseball} />
                            <div>棒球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={badminton} />
                            <div>羽球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={table_tennis} />
                            <div>桌球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_red} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={volley_ball} />
                            <div>排球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={tennis} />
                            <div>網球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={soccer} />
                            <div>足球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={pool_ball} />
                            <div>撞球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={squash} />
                            <div>壁球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={bowling} />
                            <div>保齡球</div>
                        </div>
                        <div className={styles.category_content_group_type}>&emsp;/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={golf} />
                            <div>高爾夫球</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ 球類 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>


                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={free_dive} />
                            <div>自由潛水</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ 水上 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>


                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={surfing} />
                            <div>衝浪</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ 水上 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={life_jacket} />
                            <div>溯溪</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ 水上 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>
                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={swim} />
                            <div>游泳</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ 水上 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={SUP} />
                            <div>SUP</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ 水上 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={fishing} />
                            <div>釣魚</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ 水上 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>

                <div className={styles.category_content_group_outside}>
                    <div className={styles.category_content_group}>
                        <div className={styles.category_content_group_inside}>
                            <img src={kayak} />
                            <div>獨木舟</div>
                        </div>
                        <div className={styles.category_content_group_type}>/ 水上 &emsp;</div>
                    </div>
                    <div className={styles.category_content_pullBall}>
                        <img src={pull_ball_black} />
                    </div>
                </div>
            </div>
        </div >
    </Scrollbars >
}

export default Category;