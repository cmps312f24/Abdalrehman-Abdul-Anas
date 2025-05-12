'use client';

import { useEffect, useState } from 'react';
import '../details.css';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    async function fetchInstructors() {
      const response = await fetch('/api/instructors');
      const data = await response.json();
      setInstructors(data);
    }
    fetchInstructors();
  }, []);

  return (
    <div className="details-container">
      <h1 className="details-title">Total Instructors</h1>
      <table className="details-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor.id}>
              <td>{instructor.id}</td>
              <td>{instructor.name}</td>
              <td>{instructor.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}