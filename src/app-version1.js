import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Ball from "./components/cat/ball";
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

function APP() {

    const currentUser = false;
    const RequireAuth = ({ children }) => {
        return currentUser ? children : <Navigate to="/" />;
    }


    return (<Router>
        <div className={styles.app}>
            <div className={style.cat}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/Ball" element={<Navbar />} />
                    <Route path="/Water" element={<Navbar />} />
                    <Route path="/Outdoor" element={<Navbar />} />
                    <Route path="/Fitness" element={<Navbar />} />

                    <Route path="/Mypage" element={<Navbar />} />
                    <Route path="/Member" element={<Navbar />} />
                    <Route path="/Setting" element={<Navbar />} />
                    <Route path="/Hiking" element={<Navbar />} />
                </Routes>
                <Routes>
                    <Route path="/Ball" element={<Ball />} />
                    <Route path="/Water" element={<Water />} />
                    <Route path="/Outdoor" element={<Outdoor />} />
                    <Route path="/Fitness" element={<Fitness />} />

                    <Route path="/Mypage" element={<Ball />} />
                    <Route path="/Member" element={<Ball />} />
                    <Route path="/Setting" element={<Ball />} />
                    <Route path="/Hiking" element={<Ball />} />
                </Routes>
                <Routes>
                    <Route path="/Mypage" element={<MyPage />} />
                    <Route path="/Member" element={<RequireAuth><Member /></RequireAuth>} />
                    <Route path="/Setting" element={<Setting />} />
                    <Route path="/Hiking" element={<Home />} />
                </Routes>
            </div>
        </div>
    </Router>)
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
