'use client';

import { useEffect, useState } from 'react';
import {
  deleteSectionAction,
  getCoursesRegisterationAction,
  getStudentScheduleAction,
  registerStudentAction,
  unregisterStudentAction,
  updateSectionStatusAction
} from '../actions/server-actions';

export default function RegisterationTable({ user, pageType, initCourses = [] }) {
  const [courses, setCourses] = useState(initCourses);
  
  const loadCourses = async (filter) => {
    if (pageType === 'summary') {
      const data = await getStudentScheduleAction(user.id);
      setCourses(data ?? []);
    } 
    else if (pageType === 'register') {
    const data = await getCoursesRegisterationAction({ status: 'pending' });
    setCourses(data ?? []);
  } else {
    const data = await getCoursesRegisterationAction({ status: pageType });
    setCourses(data ?? []);
  }
    
  };

  useEffect(() => {       
    if (pageType === 'register' || pageType === "approved" || pageType === "pending") {
      loadCourses();
    }
    else if (pageType === 'summary') {
      loadCourses();
    }
  }, [pageType, user]);

  const removeRow = (courseNo, section) =>
    setCourses(prev =>
      prev.filter(c => !(c.courseNo === courseNo && c.section === section))
    );

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
            {pageType === 'pending' && <th>Delete</th>}
            {pageType === 'pending' && <th>Approve</th>}
            {pageType === 'register' && <th>Add</th>}
            {pageType === 'summary' && <th>Withdraw</th>}
            {pageType === 'approved' && <th>Complete</th>}
          </tr>
        </thead>

        <tbody className="tbody-pending">
          {courses.length === 0 ? (
            <tr>
              <td colSpan="12">No courses found.</td>
            </tr>
          ) : (
            courses.map((s, idx) => (
              <tr key={`${s.courseNo}-${s.section}-${idx}`} className="table-body-row">
                <td>{s.courseNo}</td>
                <td>{s.course?.name ?? s.sectionRef?.course?.name ?? 'N/A'}</td>
                <td>{s.section}</td>
                <td>{s.course?.credit ?? s.sectionRef?.course?.credit ?? 'N/A'}</td>
                <td>
                  {s.instructor?.name ??
                    s.admin?.name ??
                    s.sectionRef?.instructor?.name ??
                    s.sectionRef?.admin?.name ??
                    '-'}
                </td>
                <td>{s.course?.college ?? s.sectionRef?.course?.college ?? 'N/A'}</td>
                <td>{`${s.timing ?? s.sectionRef?.timing ?? '-'}/${s.place ?? s.sectionRef?.place ?? '-'}`}</td>
                <td>{s.status}</td>
                <td>{s.section?.[0] === 'B' ? 'Lab' : 'Lecture'}</td>

                {['pending', 'summary', 'approved'].includes(pageType) && (
                  <td className="add-box">
                    <button
                      className="add-button"
                      onClick={async () => {
                        if (pageType === 'pending') {
                          await deleteSectionAction(s.courseNo, s.section);
                        } else if (pageType === 'summary') {
                          await unregisterStudentAction(user.id, s.courseNo, s.section);
                        } else if (pageType === 'approved') {
                          await updateSectionStatusAction(s.courseNo, s.section, 'pending');
                        }
                        removeRow(s.courseNo, s.section);
                      }}
                    >
                      –
                    </button>
                  </td>
                )}

                {['pending', 'register'].includes(pageType) && (
                  <td className="add-box">
                    <button
                      className="add-button"
                      onClick={async () => {
                        if (pageType === 'pending') {
                          await updateSectionStatusAction(s.courseNo, s.section, 'approved');
                        } else {
                          await registerStudentAction(user.id, s.courseNo, s.section);
                        }
                        removeRow(s.courseNo, s.section);
                      }}
                    >
                      +
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}