'use client';

import { useEffect, useState } from 'react';
import '../details.css';

export default function AverageGPAPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchAverageGPA() {
      const response = await fetch('/api/average-gpa');
      const data = await response.json();
      setStudents(data);
    }
    fetchAverageGPA();
  }, []);

  return (
    <div className="details-container">
      <h1 className="details-title">Average GPA</h1>
      <table className="details-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>GPA</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.gpa.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}