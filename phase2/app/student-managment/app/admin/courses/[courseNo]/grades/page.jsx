'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSectionGrades } from '../../actions/server-actions';

export default function GradesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [enrollments, setEnrollments] = useState([]);

  const courseNo = params.courseNo;
  const sectionID = searchParams.get('section');

  useEffect(() => {
    const fetchData = async () => {
      if (!courseNo || !sectionID) return;
      const data = await getSectionGrades(courseNo, sectionID);
      setEnrollments(data);
    };
    fetchData();
  }, [courseNo, sectionID]);

  const handleGradeChange = async (enrollment, newGrade) => {
    const { courseNo, section, studentId } = enrollment;
  
    setEnrollments(prev =>
      prev.map(en =>
        en.student.id === studentId && en.courseNo === courseNo && en.section === section
          ? { ...en, grade: newGrade }
          : en
      )
    );

    await updateGrade(courseNo, section, studentId, newGrade);
  };

  return (
    <>
      <div className="page-header">
        <h1>Web Development Fundamentals {sectionID}</h1>
      </div>

      <div className="search-container grade-search">
        <form className="form-student-search">
          <div className="form-group">
            <label className="form-label">Name:</label>
            <div className="input-wrapper">
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="search" id="name-input" className="form-input with-icon" placeholder="Student name" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Student ID:</label>
            <div className="input-wrapper">
              <input type="search" className="form-input" id="id-input" placeholder="Student ID" />
            </div>
          </div>

          <div className="button-container">
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>
      </div>

      <div className="table-container grade-table">
        <table className="search-results-table">
          <thead>
            <tr className="table-header">
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {enrollments.map((s) => (
              <tr key={s.student.id} className="student-grade">
                <td>{s.student.name}</td>
                <td>{s.student.id}</td>
                <td>
                  <select
                    className="grade-input"
                    value={s.grade}
                    onChange={(e) => handleGradeChange(s, e.target.value)}
                  >
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="D+">D+</option>
                    <option value="D">D</option>
                    <option value="F">F</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}