import { Outlet } from "react-router-dom";
// import Navbar from "./components/Navbar";
import React from "react";
function BallPage() {
    return <div>
        {/* <Navbar /> */}
        <main>
            <Outlet />
        </main>
    </div>

}

export default BallPage;