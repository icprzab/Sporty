import React from "react";
import styles from "./styles/app.module.css";
import style from "./styles/cat.module.css";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import Member from "./pages/MemberPage";
import Setting from "./pages/SettingPage";
import Login from "./components/Login"
import Register from "./components/Register"
import balls from "./data/data-ball"
import avatar from "./assets/member.png"
import { Navigate } from "react-router-dom";
import { dataContext } from "./context/dataContext"
import { useState, useEffect } from "react";
import { AuthContext } from "./context/Authcontext"
import { PostContext } from "./context/PostContext"
import { displayPostContext } from "./context/displayPostContext"
import { SideBarContext } from "./context/SideBarContext"
import { SportContext } from "./context/SportContext"
import { imageContext } from "./context/imageContext"
import { NameContext } from "./context/NameContext"
import { GroupContext } from "./context/GroupContext"
import { memberContext } from "./context/memberContext"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage"
import { db } from "./firebase-config";
import { storage } from "./firebase-config"
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function APP() {
    const [getMember, setGetMember] = useState("")
    const [displaySidebar, setDisplaySidebar] = useState(false)
    const [displayPost, setDisplayPost] = useState(false)
    const [sport, setSport] = useState("ball")
    const [url, setUrl] = useState(avatar)
    const [value, setValue] = useState(balls)
    const [userName, setUserName] = useState(null)
    const [group, setGroup] = useState("");
    const [newPost, setNewPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("user"))
    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/" />;
    }

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (data) => {
            if (data) {
                setUrl(avatar)
                setCurrentUser(data.uid);
                setGetMember(data.uid);
                localStorage.setItem("user", data.uid)
                const imageRef = ref(storage, `users/${data.uid}`);
                getDownloadURL(imageRef)
                    .then((url) => { setUrl(url); }
                    ).catch((error) => { })
                const userDoc = doc(db, "users", data.uid);
                onSnapshot(userDoc, (snapshot) => {
                    setUserName(snapshot.data().Name)
                });
            }
            if (!data) { setCurrentUser(false) }
        })

    }, [currentUser])

    return (<Router>
        <div className={styles.app}>
            <div className={style.cat}>
                <AuthContext.Provider value={{ currentUser, setCurrentUser }} >
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/Register" element={<Register />} />
                    </Routes>
                    <memberContext.Provider value={{ getMember, setGetMember }}  >
                        <SideBarContext.Provider value={{ displaySidebar, setDisplaySidebar }}  >
                            <SportContext.Provider value={{ sport, setSport }}  >
                                <displayPostContext.Provider value={{ displayPost, setDisplayPost }}  >
                                    <PostContext.Provider value={{ newPost, setNewPost }}  >
                                        <GroupContext.Provider value={{ group, setGroup }}  >
                                            <NameContext.Provider value={{ userName, setUserName }}  >
                                                <imageContext.Provider value={{ url, setUrl }} >
                                                    <Routes>
                                                        <Route path="/SideBar" element={<RequireAuth><Navbar /></RequireAuth>} />
                                                        <Route path="/Mypage" element={<RequireAuth><Navbar /></RequireAuth>} />
                                                        <Route path="/Member" element={getMember ? <RequireAuth><Navbar /></RequireAuth> : <Navigate to="/Mypage" />} />
                                                        <Route path="/Setting" element={<RequireAuth><Navbar /></RequireAuth>} />
                                                        <Route path="/Home" element={group ? <RequireAuth><Navbar /></RequireAuth> : <Navigate to="/Mypage" />} />
                                                    </Routes>
                                                    <dataContext.Provider value={{ value, setValue }}>
                                                        <Routes>
                                                            <Route path="/Mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
                                                            <Route path="/Member" element={getMember ? <RequireAuth><Member /></RequireAuth> : <Navigate to="/Mypage" />} />
                                                            <Route path="/Setting" element={<RequireAuth><Setting /></RequireAuth>} />
                                                            <Route path="/Home" element={group ? <RequireAuth><Home /></RequireAuth> : <Navigate to="/Mypage" />} />
                                                        </Routes>
                                                    </dataContext.Provider>
                                                </imageContext.Provider>
                                            </NameContext.Provider>
                                        </GroupContext.Provider>
                                    </PostContext.Provider>
                                </displayPostContext.Provider>
                            </SportContext.Provider>
                        </SideBarContext.Provider >
                    </memberContext.Provider>
                </AuthContext.Provider>
            </div>
        </div>
    </Router >
    )
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <APP />
);