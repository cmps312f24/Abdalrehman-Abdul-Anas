'use client'

import { changePassAction } from "@/app/actions/server-actions";

export default function Settings(){
    const user= JSON.parse(localStorage.user);

    async function HandleChangePassword(e) {
        e.preventDefault();
        
        const newPass = document.getElementById("newPassword").value;
        const oldPass = document.getElementById("oldPassword").value;
        
        const result = await changePassAction(user.email, oldPass, newPass);
        
        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";
        
        if (result == 1) {
            alert("Password changed successfully");
        } else {
            alert("Old password is incorrect");
        }
    }

    return(
        <div className="container" id="settings-container">
            <div className="content settings">
                <section className="form-container-settings" id="Profile">

                    <div className="field-section-settings">
                        <label htmlFor="fullName">FULL NAME</label>

                        <input type="text" value={user.name} id="fullName" name="fullName" className="field"
                            readOnly />
                    </div>

                    <div className="field-section-settings">
                        <label htmlFor="collageMajor">COLLAGE/MAJOR</label>

                        <input type="text" value={user.major} id="collageMajor"
                            name="collageMajor" className="field" readOnly />
                    </div>

                    <div className="field-section-settings">
                        <label htmlFor="phone">PHONE NUMBER</label>

                        <input type="text" value={user.phoneNo} id="phone" name="phone" className="field" readOnly />
                    </div>

                    <div className="field-section-settings">
                        <label htmlFor="id">ID</label>

                        <input type="text" value={user.id} id="id" name="id" className="field" readOnly />
                    </div>

                    <div className="field-section-settings">
                        <label htmlFor="email">EMAIL</label>

                        <input type="text" value={user.email} id="email" name="email" className="field"
                            readOnly />
                    </div>

                    {user.role === 'STUDENT' && (
                        <div className="field-section-settings" id="gpa-section">
                            <label htmlFor="gpa" id="gpa-bar">GPA</label>
                            <div className="field" id="progress">
                                <div className="progress-bar"></div>
                                <div id="scale">
                                <span>0</span><span>0.5</span><span>1</span><span>1.5</span><span>2</span>
                                <span>2.5</span><span>3</span><span>3.5</span><span>4</span>
                                </div>
                            </div>
                        </div>
                    )}   
                </section>

            </div>
            <div className="content settings">
                <section className="form-container-settings" id="Preffrences">
                <form id="changePasswordForm" className="settingsForm">
                    <div className="field-section-settings">
                        <label htmlFor="oldPassword">OLD PASSWORD</label>

                        <input type="password" id="oldPassword" name="oldPassword" className="field" placeholder="old password" />
                    </div>
                    <div className="field-section-settings">
                        <label htmlFor="newPassword">NEW PASSWORD</label>

                        <input type="password" id="newPassword" name="newPassword" className="field" placeholder="new password" />
                    </div>
                    <button id="changePassword" onClick={HandleChangePassword}>Change Password</button>
                </form>
                <form id="changeView" className="settingsForm">
                    <div className="field-section-settings">
                        <label htmlFor="language">Language</label>

                        <input type="text" value="English" id="language"
                            name="language" className="field" readOnly />
                    </div>

                    <div className="field-section-settings">
                        <label htmlFor="theme" className="theme">
                            <span>Light</span>
                            <span className="theme__toggle-wrap">
                                <input id="theme" className="theme__toggle" type="checkbox" role="switch" name="theme" value="dark" />
                                <span className="theme__fill"></span>
                                <span className="theme__icon">
                                    <span className="theme__icon-part"></span>
                                    <span className="theme__icon-part"></span>
                                    <span className="theme__icon-part"></span>
                                    <span className="theme__icon-part"></span>
                                    <span className="theme__icon-part"></span>
                                    <span className="theme__icon-part"></span>
                                    <span className="theme__icon-part"></span>
                                    <span className="theme__icon-part"></span>
                                    <span className="theme__icon-part"></span>
                                </span>
                            </span>
                            <span>Dark</span>
                        </label>
                    </div>
                </form>
                </section>
            </div>
        </div>
    );
}



