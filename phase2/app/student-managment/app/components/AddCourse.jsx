'use client'
import React from 'react'
import { useState } from 'react';
import { handelAddCourseAction } from '../actions/server-actions';
export default function AddCourse() {

    const [category, setCategory] = useState("Lecture")

    return (
        <div className="addCourse-container">
            <h2 id="addCourse-header">Add New Course</h2>

            <form className="form-container" action={handelAddCourseAction}>
                <section className="field-section">
                    <label htmlFor="courseName">Course Name</label>

                    <input type="text" id="course-Name" name="name" className="field" placeholder="Course Name" required onInput={e => e.target.value = e.target.value.replace(/[^a-zA-Z-\s]/g, '')} />
                </section>

                <section className="field-section">
                    <label htmlFor="courseNumber">Course Number</label>
                    <input type="text" id="courseNumber" name="courseNo" className="field" placeholder="Course Number" required />
                </section>

                <section className="field-section">
                    <label htmlFor="category">Category</label>

                    <select name="category" id="category" className="field" onChange={e => setCategory(e.target.value)} defaultValue="Lecture" required>
                        <option value="Lecture">Lecture</option>
                        <option value="Lab">Lab</option>
                    </select>
                </section>

                <section className="field-section">
                    <label htmlFor="courseSection">Section</label>


                    <div className="input-prefix-wrapper">
                        <span className="prefix">{category == "Lecture" ? "L" : "B"}</span>
                        <input type="text" id="courseSection" name="section" className="field" placeholder="Section" required />
                    </div>
                </section>
                <section className="field-section">
                    <label htmlFor="credit">Credit</label>
                    <input type="number" id="credit" name="credit" min="1" max="4" className="field"
                        placeholder="Credit" required></input>
                </section>
                <section className="field-section">
                    <label htmlFor="capacity">Capacity</label>
                    <input type="number" id="capacity" name="capacity" min="1" max="50" className="field"
                        placeholder="Capacity" required></input>
                </section>
                <section className="field-section">
                    <label htmlFor="instructorID">Instructor</label>
                    <input type="text" id="instructorID" name="instructorID" className="field" placeholder="InstructorID" onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} required></input>
                </section>

                <section className="field-section">
                    <label htmlFor="place">Place</label>


                    <input type="text" id="place" name="place" className="field" placeholder="Place" required />
                </section>

                <section className="field-section">
                    <label htmlFor="days">Days</label>
                    <select name="dow" id="days" className="field" placeholder="Select Days" defaultValue={"sun/tue/thu"} required>
                        {category == "Lecture" ?
                            <>
                                <option value="sun/tue/thu">Sunday-Tuesday-Thursday</option>
                                <option value="mon/wed">Monday-Wednesday</option>
                            </> :
                            <>
                                <option value="sun" selected>Sunday</option>
                                <option value="mon">Monday</option>
                                <option value="tue">Tuesday</option>
                                <option value="wed">Wednesday</option>
                                <option value="thu">Thursday</option>
                            </>}
                    </select>
                </section>

                <section className="field-section">
                    <label htmlFor="timing">Timing</label>
                    <select name="timing" id="timing" className="field" placeholder="Select Start Time" defaultValue={"8"} required>
                        <option value="8">8am</option>
                        <option value="9">9am</option>
                        <option value="10">10am</option>
                        <option value="11">11am</option>
                        <option value="12">12pm</option>
                        <option value="13">1pm</option>
                        <option value="14">2pm</option>
                        <option value="15">3pm</option>
                        <option value="16">4pm</option>
                        <option value="17">5pm</option>

                    </select>
                </section>

                <section className="field-section">
                    <label htmlFor="campus">Campus</label>

                    <select name="campus" id="campus" className="field" placeholder="Select campus" defaultValue={"male"} required>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </section>

                <section className="field-section">
                    <label htmlFor="college">College</label>
                    <input type="text" id="college" name="college" className="field" placeholder="College" required />
                </section>

                <button type="submit" id="addCourse">Add Course</button>

            </form>
        </div>
    )
}
