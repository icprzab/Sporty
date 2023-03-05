import styles from "./style2.module.css";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { collection, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, onSnapshot, limit } from "firebase/firestore";

function List() {
    let navigate = useNavigate();
    const [users, setUser] = useState([]);
    const [add, setAdd] = useState([]);
    const userCollectionRef = collection(db, "product");
    const q = query(userCollectionRef, where("price", "<", 500), orderBy("price", "desc"), limit(4));
    console.log("list");

    function handleSubmit(e) {
        e.preventDefault()
        if (add !== "") {
            addDoc(userCollectionRef, { message: add, createAt: serverTimestamp() });
            setAdd([])
            console.log("button");
        }
    }

    function deleteUser(id) {
        const userDoc = doc(db, "users", id);
        deleteDoc(userDoc);
        console.log("delete");
    }

    useEffect(() => {
        const getUser = () => {
            onSnapshot(q, (snapshot) =>
                setUser(snapshot.docs.map(
                    doc => ({
                        ...doc.data(),
                        id: doc.id,
                        ...console.log("getuser")
                    })
                ))
            )
        };
        getUser();
    }, []);


    return <div className={styles.listPage}>
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputOutside}>
                <input className={styles.input} type="text" value={add} onChange={e => setAdd(e.target.value)} />
                <button className={styles.button} type="submit">新增紀錄</button>
            </div>
        </form>
        <div className={styles.line}></div>
        <div className={styles.messageOutside}>
            <div className={styles.message}>
                {users.map(user => <div className={styles.messageInside} key={user.id}>
                    <div>{user.price}</div>
                    <button className={styles.button} onClick={() => { deleteUser(user.id) }}>刪除</button>
                </div>)}
                {console.log("return")}
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
