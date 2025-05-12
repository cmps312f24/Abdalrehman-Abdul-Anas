'use client'
import React, { useEffect, useState } from 'react'
import { deleteSectionAction, getCoursesRegisterationAction, registerStudentAction, unregisterStudentAction, updateSectionStatusAction } from '../actions/server-actions'

export default function RegisterationTable({ user, initCourses, pageType }) {
  const [courses, setCourses] = useState(initCourses);
  
  useEffect(()=>{    
    setCourses(initCourses)    
  })

  async function loadCourses() {
    const filteredCourses = await getCoursesRegisterationAction(pageType);
    setCourses(filteredCourses);    
  }

  return (
    <div className="table-container summary">
      <table className="summary-table">
        <thead className="summary-header">
          <tr className="table-header-row">
            <th>CourseNo</th>
            <th>Title</th>
            <th>Section</th>
            <th>Credit</th>
            <th>Instructor</th>
            <th>College</th>
            <th>Timing/Place</th>
            <th>Status</th>
            <th>Category</th>
            {pageType == "pending" ? <th>Delete</th> : <></>}
            {pageType == "pending" ? <th>Approve</th> : <></>}
            {pageType == "register" ? <th>Add</th> : <></>}
            {pageType == "summary" ? <th>Withdraw</th> : <></>}
            {pageType == "approved" ? <th>Complete</th> : <></>}
          </tr>
        </thead>
        <tbody className="tbody-pending">
          {courses.map((s, index) => (
            <tr key={index} className="table-body-row">
              <td>{s.courseNo}</td>
              <td>{s.course.name}</td>
              <td>{s.section}</td>
              <td>{s.course.credit}</td>
              <td>{s.instructor ? s.instructor.name : s.admin.name}</td>
              <td>{s.course.college}</td>
              <td>{`${s.timing}/${s.place}`}</td>
              <td>{s.status}</td>
              <td>{s.section?.[0] === 'B' ? "Lab" : "Lecture"}</td>

              {["pending", "summary", "approved"].includes(pageType) && (
                <td className="add-box">
                  <button className="add-button" onClick={() => {
                    if (pageType === "pending") deleteSectionAction(s.courseNo, s.section);
                    else if (pageType === "summary") unregisterStudentAction(user.id, s.courseNo, s.section);
                    else if (pageType === "approved") updateSectionStatusAction(s.courseNo, s.section, "pending");
                  }}>-</button>
                </td>
              )}

              {["pending", "register"].includes(pageType) && (
                <td className="add-box">
                  <button className="add-button" onClick={async() => {
                    if (pageType === "pending") {
                      updateSectionStatusAction(s.courseNo, s.section, "approved");
                      loadCourses()
                    }
                    else registerStudentAction(user.id, s.courseNo, s.section);
                  }}>+</button>
                </td>
              )}
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}
