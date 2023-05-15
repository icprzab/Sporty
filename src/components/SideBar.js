import "typeface-quicksand"
import balls from "../data/data-ball"
import fitness_all from "../data/data-fitness"
import outdoor_all from "../data/data-outdoor"
import water_all from "../data/data-water"
import styles from "../styles/sidebar.module.css";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { dataContext } from "../context/dataContext"
import { imageContext } from "../context/imageContext"
import { NameContext } from "../context/NameContext"
import { GroupContext } from "../context/GroupContext"
import { SportContext } from "../context/SportContext"
import { SideBarContext } from "../context/SideBarContext"
function SideBar() {
    const { displaySidebar, setDisplaySidebar } = useContext(SideBarContext);
    const { group, setGroup } = useContext(GroupContext);
    const { userName, setUserName } = useContext(NameContext);
    const { sport, setSport } = useContext(SportContext);
    const { value, setValue } = useContext(dataContext);
    const { url, setUrl } = useContext(imageContext);

    let navigate = useNavigate()

    function groupName(data) {
        localStorage.setItem("type", data)
        setGroup(data)
        setDisplaySidebar(false)
        sessionStorage.setItem("bottom", "")
        navigate("/Hiking")
    }
    function Me() {
        setDisplaySidebar(false)
        sessionStorage.setItem("bottom", "")
        navigate("/Mypage")
    }

    function ball() {
        setValue(balls)
        setSport("ball")
    }

    function fitness() {
        setValue(fitness_all)
        setSport("fitness")
    }

    function outdoor() {
        setValue(outdoor_all)
        setSport("outdoor")

    }

    function water() {
        setSport("water")
        setValue(water_all)
    }


    return <div className={"category_shadow"} >
        <div className={styles.category_outside}>
            <Scrollbars style={{ width: "100%", height: "100vh" }}>
                <div className={styles.category}>
                    <div className={styles.category_member} onClick={Me}>
                        <div className={styles.category_member_selfie}>
                            <img src={url}></img>
                        </div>
                        <div className={styles.category_member_name}>{userName}</div>
                    </div>
                    <div className={styles.category_content}>所有社群</div>
                    <div className={styles.category_content_line_outside}>
                        <div className={styles.category_content_line}></div>
                    </div>
                    <div className={styles.category_content_all}>
                        <button className={sport == "ball" ? styles.category_content_all_ball2 : styles.category_content_all_ball} onClick={ball}>球類</button>
                        <button className={sport == "water" ? styles.category_content_all_water2 : styles.category_content_all_water} onClick={water}>水上</button>
                        <button className={sport == "outdoor" ? styles.category_content_all_outdoor2 : styles.category_content_all_outdoor} onClick={outdoor}>戶外</button>
                        <button className={sport == "fitness" ? styles.category_content_all_fitness2 : styles.category_content_all_fitness} onClick={fitness}>健身</button>
                    </div>

                    {value.map(type => <div className={styles.category_content_group_outside} key={type.name} onClick={() => groupName(type.name)} >
                        <div className={styles.category_content_group}>
                            <div className={styles.category_content_group_image}>
                                <img src={type.images} />
                            </div>
                            <div className={styles.category_content_group_text}>
                                <div className={styles.category_content_group_sport} >{type.name}</div>
                                <div className={styles.category_content_group_type}>&emsp;/ {type.type}</div>
                            </div>
                        </div>
                    </div>)}
                </div>
            </Scrollbars >
        </div >
    </div >
}

export default SideBar;