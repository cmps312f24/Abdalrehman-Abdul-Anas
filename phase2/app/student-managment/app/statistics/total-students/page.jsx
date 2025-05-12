'use client';

import { useEffect, useState } from 'react';
import '../details.css';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      const response = await fetch('/api/students');
      const data = await response.json();
      setStudents(data);
    }
    fetchStudents();
  }, []);

  return (
    <div className="details-container">
      <h1 className="details-title">Total Students</h1>
      <table className="details-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}