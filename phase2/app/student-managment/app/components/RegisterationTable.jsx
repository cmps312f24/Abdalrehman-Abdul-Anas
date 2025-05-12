import React, { useState } from 'react'
import { deleteSectionAction, registerStudentAction, unregisterStudentAction, updateSectionStatusAction } from '../actions/server-actions'

export default function RegisterationTable({ user, initCourses, pageType }) {

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
            {pageType=="pending"?<th>Delete</th>:<></>}
            {pageType=="pending"?<th>Approve</th>:<></>}
            {pageType=="register"?<th>Add</th>:<></>}
            {pageType=="summary"?<th>Withdraw</th>:<></>}
            {pageType=="approved"?<th>Complete</th>:<></>}
          </tr>
        </thead>
        <tbody className="tbody-pending">
          {initCourses.map(c => {
            c.sections.map(s => {
              <tr className="table-body-row">
                <td>{c.courseNo}</td>
                <td>{c.name}</td>
                <td>{s.section}</td>
                <td>{c.credit}</td>
                {/* <td>{s.instructors[0].instructor?s.instructors[0].instructor.name: s.instructors[0].admin.name}</td> */}
                <td>{c.college}</td>
                <td>{`${s.timing}/${s.place}`}</td>
                <td>{s.status}</td>
                <td>{c.category}</td>
                {["pending","summary","approved"].includes(pageType)?<td className="add-box"><button className="add-button" onClick={e=>{
                  pageType=="pending"? deleteSectionAction(c.courseNo, s.section)
                  : pageType == "summary"? unregisterStudentAction(user.id,c.courseNo,s.section)
                  : pageType=="approved"? updateSectionStatusAction(c.courseNo, s.section, "pending")
                  : ''
                }}>-</button></td>:<></>}
                {["pending","register"].includes(pageType)?<td className="add-box"><button className="add-button" onClick={e=>{
                  pageType == "pending"? updateSectionStatusAction(c.courseNo, s.section, "approved")
                  :registerStudentAction(user.id,c.courseNo,s.section)
                }}>+</button></td>:<></>}
              </tr>
            })
          })}
        </tbody>

      </table>

    </div>
  )
}
