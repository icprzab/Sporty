import React from "react";
import styles from "./styles/app.module.css";
import style from "./styles/cat.module.css";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import Member from "./pages/MemberPage";
import Setting from "./pages/SettingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import balls from "./data/data-ball";
import avatar from "./assets/member.png";
import { Navigate, useNavigate } from "react-router-dom";
import { dataContext } from "./context/dataContext";
import { useState, useEffect } from "react";
import { AuthContext } from "./context/Authcontext";
import { PostContext } from "./context/PostContext";
import { displayPostContext } from "./context/displayPostContext";
import { SideBarContext } from "./context/SideBarContext";
import { SportContext } from "./context/SportContext";
import { imageContext } from "./context/imageContext";
import { NameContext } from "./context/NameContext";
import { GroupContext } from "./context/GroupContext";
import { memberContext } from "./context/memberContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { db } from "./firebase-config";
import { storage } from "./firebase-config";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { FadeLoader } from "react-spinners";
function APP() {
  const [getMember, setGetMember] = useState("");
  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [displayPost, setDisplayPost] = useState(false);
  const [sport, setSport] = useState("ball");
  const [url, setUrl] = useState(avatar);
  const [value, setValue] = useState(balls);
  const [userName, setUserName] = useState(null);
  const [group, setGroup] = useState("");
  const [newPost, setNewPost] = useState(null);
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);

  const RequireAuth = ({ children }) => {
    const [authState, setAuthState] = useState(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setAuthState(user !== null);
      });
      return () => unsubscribe();
    }, []);

    return authState === null ? null : authState ? (
      children
    ) : (
      <Navigate to="/" />
    );
  };

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (data) => {
      if (data) {
        setUrl(avatar);
        setGetMember(data.uid);
        localStorage.setItem("user", data.uid);
        const imageRef = ref(storage, `users/${data.uid}`);
        getDownloadURL(imageRef)
          .then((url) => {
            setUrl(url);
          })
          .catch((error) => {});
        const userDoc = doc(db, "users", data.uid);
        onSnapshot(userDoc, (snapshot) => {
          setUserName(snapshot.data().Name);
          setLoading(false);
        });
      }
    });
  }, []);

  return (
    <Router>
      <div className={styles.app}>
        <div className={style.cat}>
          <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Register" element={<Register />} />
            </Routes>
            <memberContext.Provider value={{ getMember, setGetMember }}>
              <SideBarContext.Provider
                value={{ displaySidebar, setDisplaySidebar }}
              >
                <SportContext.Provider value={{ sport, setSport }}>
                  <displayPostContext.Provider
                    value={{ displayPost, setDisplayPost }}
                  >
                    <PostContext.Provider value={{ newPost, setNewPost }}>
                      <GroupContext.Provider value={{ group, setGroup }}>
                        <NameContext.Provider value={{ userName, setUserName }}>
                          <imageContext.Provider value={{ url, setUrl }}>
                            <dataContext.Provider value={{ value, setValue }}>
                              {loading ? (
                                <div className={styles.loader}>
                                  <FadeLoader
                                    color={"#34eb8c"}
                                    loading={loading}
                                    size={100}
                                  />
                                </div>
                              ) : (
                                <Routes>
                                  <Route
                                    path="/Mypage"
                                    element={
                                      <RequireAuth>
                                        <Navbar />
                                        <MyPage />
                                      </RequireAuth>
                                    }
                                  />
                                  <Route
                                    path="/Member"
                                    element={
                                      getMember ? (
                                        <RequireAuth>
                                          <Navbar />
                                          <Member />
                                        </RequireAuth>
                                      ) : (
                                        <Navigate to="/Mypage" />
                                      )
                                    }
                                  />
                                  <Route
                                    path="/Setting"
                                    element={
                                      <RequireAuth>
                                        <Navbar />
                                        <Setting />
                                      </RequireAuth>
                                    }
                                  />
                                  <Route
                                    path="/Home"
                                    element={
                                      group ? (
                                        <RequireAuth>
                                          <Navbar />
                                          <Home />
                                        </RequireAuth>
                                      ) : (
                                        <Navigate to="/Mypage" />
                                      )
                                    }
                                  />
                                </Routes>
                              )}
                            </dataContext.Provider>
                          </imageContext.Provider>
                        </NameContext.Provider>
                      </GroupContext.Provider>
                    </PostContext.Provider>
                  </displayPostContext.Provider>
                </SportContext.Provider>
              </SideBarContext.Provider>
            </memberContext.Provider>
          </AuthContext.Provider>
        </div>
      </div>
    </Router>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<APP />);
