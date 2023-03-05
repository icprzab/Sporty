import styles from "./style2.module.css";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";


function List() {
    let navigate = useNavigate();
    const [users, setUser] = useState([]);
    // let userMessage = [];
    const userCollectionRef = collection(db, "users");

    useEffect(() => {
        // console.log(user)
    }, [users])

    useEffect(() => {
        const getUser = () => {
            getDocs(userCollectionRef)
                .then(response => {
                    const userInfo = response.docs.map(doc => ({
                        // message: doc.data().message,
                        ...doc.data(),
                        id: doc.id
                    }))
                    setUser(userInfo);
                });
        };
        getUser();
    }, []);

    // useEffect(() => {
    //     const getUser = async () => {
    //         const dataUser = await getDocs(userCollectionRef);
    //         dataUser.forEach((doc) => {
    //             // console.log(doc.data().message);
    //             userMessage.push(doc.data().message)
    //         });
    //     };
    //     getUser();
    // }, []);

    return <div className={styles.listPage}>
        <form className={styles.form} >
            <div className={styles.inputOutside}>
                <input className={styles.input} type="text" />
                <button className={styles.button} type="submit" value="submit">新增紀錄</button>
            </div>
        </form>
        <div className={styles.line}></div>
        <div className={styles.messageOutside}>
            <div className={styles.message}>
                {users.map(user => <div className={styles.messageInside} key={user.id}>
                    <div>{user.message}</div>
                    <button className={styles.button}>刪除</button>
                </div>)}
            </div>
        </div>
        <div className={styles.buttonOutside}><button className={styles.buttonReturn} onClick={() => { navigate("/") }}>返回首頁</button></div>
    </div>
}
export default List;

// class MyHead extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: "",
//         }
//     }

//     render() {
//         return <form className="form" onSubmit={this.handleSubmit.bind(this)}>
//             <div className="input-outside">
//                 <input className="input" type="text" value={this.state.name}
//                     onChange={this.handleNameChange.bind(this)} />
//                 <button className="button" type="submit" value="submit">新增紀錄</button>
//             </div>
//             <div className="line"></div>
//         </form>

//     }

//     handleNameChange(e) {
//         this.setState({ name: e.currentTarget.value })
//     }


//     handleSubmit(e) {
//         e.preventDefault();
//         console.log(this.state.name)
//     }

// }

// window.addEventListener("load", () => {
//     const container = document.getElementById('root');
//     const root = createRoot(container);
//     root.render(<MyHead />);
// });
