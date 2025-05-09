'use client';

import { useEffect, useState } from 'react';
import { getCoursesRegisterationAction } from '../../actions/server-actions';
import RegisterationTable from '@/app/components/RegisterationTable';
import ScheduleTable from '@/app/components/ScheduleTable';

export default function RegisterationPage() {

    const [courses, setCourses] = useState([]);
    const [pageIndex, setPageIndex] = useState("register");
    const [isExpanded, setIsExpanded] = useState(false);
    const [user, setUser] = useState(null);
    const [campus, setCampus] = useState("");

    function changeCampus(changeCampus) {
        if (changeCampus == campus)
            setCampus("")
        else if (changeCampus == "male")
            setCampus("male")
        else
            setCampus("female")
        loadCourses({
            campus: changeCampus,
            status: "pending"
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            const stored = localStorage.getItem('user');
            if (stored) setUser(JSON.parse(stored));

            const courses = await getCoursesRegisterationAction({ status: "pending" });
            setCourses(courses);
        };

        fetchData();
    }, []);

    async function loadCourses(filter) {
        const filteredCourses = await getCoursesRegisterationAction(filter);
        setCourses(filteredCourses)
    }

    return (
        <>
            <div className="nav-tabs">
                <button className={`nav-button ${pageIndex == "register" ? "active" : ""}`} id="pending-button" onClick={e => { setPageIndex("register"); }}>Register</button>
                <button className={`nav-button ${pageIndex == "schedule" ? "active" : ""}`} id="approved-button" onClick={e => { setPageIndex("schedule"); }}>Schedule</button>
                <button className={`nav-button ${pageIndex == "summary" ? "active" : ""}`} onClick={e => { setPageIndex("summary"); }}>Summary</button>
            </div>

            <div className="container registration-container">

                {pageIndex == "register" ? <>
                    <div className="search-container">
                        <div className="search-container">
                            <form className="form-student-search">
                                <div className="form-group">
                                    <label className="form-label">College:</label>
                                    <div className="input-wrapper">
                                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input type="search" id="college-input" className="form-input with-icon"
                                            placeholder="College name" onChange={e => loadCourses({
                                                college: e.target.value,
                                                status: "pending"
                                            })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Course Number:</label>
                                    <div className="input-wrapper">
                                        <input type="search" className="form-input" id="id-input" placeholder="Course number" onChange={e => loadCourses({
                                            courseNo: e.target.value,
                                            status: "pending"
                                        })} />
                                    </div>
                                </div>

                                <div className="button-container">
                                    <button id="toggle-expand" className="toggle-button" type="button" onClick={e => setIsExpanded(!isExpanded)}>
                                        <svg id="expand-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        <svg id="collapse-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round" style={{ display: "none" }}>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </button>
                                    <button className="search-button">Search</button>
                                </div>

                                <div className="form-group expandable-section" style={!isExpanded ? { display: "none" } : { display: "block" }}>
                                    <label className="form-label">Keyword:</label>
                                    <div className="input-wrapper">
                                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input type="search" id="keyword-input" className="form-input with-icon" placeholder="Keyword" />
                                        {/* I didn't implement this method */}
                                        <button id="clear-keyword" className="clear-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group expandable-section" style={!isExpanded ? { display: "none" } : { display: "block" }}>
                                    <label className="form-label">Campus:</label>
                                    <div className="campus-options">
                                        <button className={`campus-button male ${campus=="male"? "selected":""}`} data-campus="male" type="button" onClick={e => changeCampus("male")}>Male</button>
                                        <button className={`campus-button female ${campus=="female"? "selected":""}`} data-campus="female" type="button" onClick={e => changeCampus("female")}>Female</button>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                    <RegisterationTable initCourses={courses} pageType={"register"} user={user} /></>
                    :
                    pageIndex == "schedule" ?
                        <ScheduleTable user={user} />
                        :
                        pageIndex == "summary" ?
                            <RegisterationTable initCourses={courses} pageType={"summary"} user={user} />
                            :
                            <></>
                }
            </div>
        </>
    );
}