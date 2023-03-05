import React from "react";
import "../styles/loginpage.css";

function LoginPage() {
    return <div className="login_outside">
        <div className="login">
            <div className="left">
                <div className="left_inside">Welcome to Sporty!</div>
            </div>
            <div className="right">
                <div className="right_inside">
                    <div className="right_inside_content">
                        <div className="right_inside_content_title">
                            <div className="right_inside_content_title_inside">登入Sporty帳號</div>
                        </div>
                        <div className="right_inside_content_form_outside">
                            <div className="right_inside_content_form">

                                <input className="right_inside_content_form_input" placeholder="請輸入Email帳號"></input>
                                <div>
                                    <div className="right_inside_content_form_input_text">帳號輸入錯誤</div>
                                </div>

                                <input className="right_inside_content_form_input" placeholder="請輸入密碼"></input>
                                <div>
                                    <div className="right_inside_content_form_input_text">密碼輸入錯誤</div>
                                </div>

                                <button className="right_inside_content_form_button">登入帳號</button>
                                <div className="right_inside_content_form_change">
                                    <div className="right_inside_content_form_change_text">還沒有帳號? 請點此註冊</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>



    </div>















}

export default LoginPage;
