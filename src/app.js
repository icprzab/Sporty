import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BallPage from "./pages/BallPage"
import Navbar from "./components/Navbar";
import Ball from "./components/cat/ball";
import SideBar from "./components/cat/SideBar";
import Water from "./components/cat/water";
import Fitness from "./components/cat/fitness";
import Outdoor from "./components/cat/outdoor";
import Home from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import Member from "./pages/MemberPage";
import styles from "./styles/app.module.css";
import style from "./styles/cat.module.css";
import Setting from "./pages/SettingPage";
import Login from "./components/Login"
import Register from "./components/Register"
import { Navigate } from "react-router-dom";
import { AuthContextProvider } from "./context/Authcontext"
import { AuthProvider } from "./firebase-config"
import { dataContext } from "./context/dataContext"
import { useState, useEffect } from "react";
import balls from "./data/data-ball"
import { useContext } from "react"
import avatar from "./assets/member.png"
import { AuthContext } from "./context/Authcontext"
import { imageContext } from "./context/imageContext"
import { NameContext } from "./context/NameContext"
import { GroupContext } from "./context/GroupContext"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase-config"
import { db } from "./firebase-config";
import { collection, getDoc, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot, getDocFromCache } from "firebase/firestore";
function APP() {
    const [url, setUrl] = useState(avatar)
    const [value, setValue] = useState(balls)
    const [userName, setUserName] = useState(null)
    const [group, setGroup] = useState(null);
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("user"))
    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/" />;
    }

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (data) => {
            setCurrentUser(data.uid);
            localStorage.setItem("user", data.uid)
            const imageRef = ref(storage, `users/${data.uid}`);
            getDownloadURL(imageRef)
                .then((url) => { setUrl(url); }
                ).catch((error) => { })

            const userDoc = doc(db, "users", data.uid);

            const snapshot = onSnapshot(userDoc, (snapshot) => {
                getDoc(
                    setUserName(snapshot.data().Name)
                );
            });

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
                    <GroupContext.Provider value={{ group, setGroup }}  >
                        <NameContext.Provider value={{ userName, setUserName }}  >
                            <imageContext.Provider value={{ url, setUrl }} >
                                <Routes>
                                    <Route path="/SideBar" element={<RequireAuth><Navbar /></RequireAuth>} />
                                    <Route path="/Mypage" element={<RequireAuth><Navbar /></RequireAuth>} />
                                    <Route path="/Member" element={<RequireAuth><Navbar /></RequireAuth>} />
                                    <Route path="/Setting" element={<RequireAuth><Navbar /></RequireAuth>} />
                                    <Route path="/Hiking" element={<RequireAuth><Navbar /></RequireAuth>} />
                                </Routes>
                                <dataContext.Provider value={{ value, setValue }}>
                                    <Routes>
                                        <Route path="/SideBar" element={<RequireAuth><SideBar /></RequireAuth>} />
                                        <Route path="/Mypage" element={<RequireAuth><SideBar /></RequireAuth>} />
                                        <Route path="/Member" element={<RequireAuth><SideBar /></RequireAuth>} />
                                        <Route path="/Setting" element={<RequireAuth><SideBar /></RequireAuth>} />
                                        <Route path="/Hiking" element={<RequireAuth><SideBar /></RequireAuth>} />
                                    </Routes>
                                </dataContext.Provider>
                                <Routes>
                                    <Route path="/SideBar" element={<RequireAuth><MyPage /></RequireAuth>} />
                                    <Route path="/Mypage" element={<RequireAuth><MyPage /></RequireAuth>} />
                                    <Route path="/Member" element={<RequireAuth><Member /></RequireAuth>} />
                                    <Route path="/Setting" element={<RequireAuth><Setting /></RequireAuth>} />
                                    <Route path="/Hiking" element={<RequireAuth><Home /></RequireAuth>} />
                                </Routes>
                            </imageContext.Provider>
                        </NameContext.Provider>
                    </GroupContext.Provider>
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


// ReactDOM.render(<MyHead />, document.getElementById("root"));
// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(<MyHead />);


// import List from "./list.js";

// class APP extends React.component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return <div>
//             <div>React 123</div>
//         </div>;
//     }
// }

// ReactDOM.render(<APP />, document.getElementById("root"));

// let app = <div>hello</div>
// ReactDOM.render(app, document.getElementById("root"));
