'use client';

import { useEffect, useState } from 'react';
import '../details.css';
import { getAllCoursesAction } from '@/app/actions/server-actions';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const data = await getAllCoursesAction();
      setCourses(data);
    }
    fetchCourses();
  }, []);

  return (
    <div className="details-container">
      <h1 className="details-title">Total Courses</h1>
      <table className="details-table">
        <thead>
          <tr>
            <th>Course Name</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={course.id || index}>
              <td>{course.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}