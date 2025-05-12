'use client';

import { useEffect, useState } from 'react';
import { getCoursesRegisterationAction } from '../../actions/server-actions';
import RegisterationTable from '@/app/components/RegisterationTable';
import AddCourse from '@/app/components/AddCourse';

export default function RegisterationPage() {

    const [courses, setCourses] = useState([]);
    const [pageIndex, setPageIndex] = useState("pending");

    useEffect(() => {
        const fetchData = async () => {
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
                <button className={`nav-button ${pageIndex == "pending" ? "active" : ""}`} id="pending-button" onClick={e => { setPageIndex("pending"); loadCourses({ status: "pending" }) }}>Under Process</button>
                <button className={`nav-button ${pageIndex == "approved" ? "active" : ""}`} id="approved-button" onClick={e => { setPageIndex("approved"); loadCourses({ status: "approved" }) }}>Approved</button>
                <button className={`nav-button ${pageIndex == "addCourse" ? "active" : ""}`} onClick={e => setPageIndex("addCourse")}>Add Course</button>
            </div>

            <div className="container registration-container">

                {["pending", "approved"].includes(pageIndex) ? <><div className="search-container">
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
                                        status: pageIndex
                                    })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Course Number:</label>
                            <div className="input-wrapper">
                                <input type="search" className="form-input" id="id-input" placeholder="Course number" onChange={e => loadCourses({
                                    courseNo: e.target.value,
                                    status: pageIndex
                                })} />
                            </div>
                        </div>

                        <div className="button-container">
                            <button className="search-button">Search</button>
                        </div>
                    </form>
                </div><RegisterationTable initCourses={courses} pageType={pageIndex} /></>
                    :
                    <AddCourse />
                }






            </div>
        </>
    );
}