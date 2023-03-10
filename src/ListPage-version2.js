import styles from "./style2.module.css";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp } from "firebase/firestore";


function List() {
    let navigate = useNavigate();
    const [users, setUser] = useState([]);
    const [add, setAdd] = useState([]);
    const [fetchADD, setFetchADD] = useState(false);
    const userCollectionRef = collection(db, "users");
    const q = query(userCollectionRef, where("message", "==", "cddd"))
    console.log("list")

    function handleSubmit(e) {
        e.preventDefault()
        if (add !== "") {
            console.log(fetchADD)
            addDoc(userCollectionRef, { message: add, createAt: serverTimestamp() });
            setAdd([])
            setFetchADD(!fetchADD)
            console.log("button");
        }
    }

    function deleteUser(id) {
        const userDoc = doc(db, "users", id);
        deleteDoc(userDoc);
        console.log("delete");
        setFetchADD(!fetchADD);
    }

    useEffect(() => {
        const getUser = () => {
            getDocs(q)
                .then(response => {
                    const userInfo = response.docs.map(doc => ({
                        // message: doc.data().message,
                        ...doc.data(),
                        id: doc.id,
                        ...console.log("getuser")
                    }))
                    setUser(userInfo);
                });
        };
        getUser();
    }, [fetchADD]);

    // let userMessage = [];
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
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputOutside}>
                <input className={styles.input} type="text" value={add} onChange={e => setAdd(e.target.value)} />
                <button className={styles.button} type="submit">????????????</button>
            </div>
        </form>
        <div className={styles.line}></div>
        <div className={styles.messageOutside}>
            <div className={styles.message}>
                {users.map(user => <div className={styles.messageInside} key={user.id}>
                    <div>{String(user.createAt)}</div>
                    <button className={styles.button} onClick={() => { deleteUser(user.id) }}>??????</button>
                </div>)}
                {console.log("return")}
            </div>
        </div>
        <div className={styles.buttonOutside}><button className={styles.buttonReturn} onClick={() => { navigate("/") }}>????????????</button></div>
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
//                 <button className="button" type="submit" value="submit">????????????</button>
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
