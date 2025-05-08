'use client';

import { useEffect, useState } from 'react';
import { getCoursesAction } from '../../actions/server-actions';

export default function CoursesPage() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      const decoded = jwtDecode(token);
      const user = await getUserFromToken(decoded);
      const sectionsData = await getCoursesAction(user);
      setSections(sectionsData);
    };
  
    fetchUser();
  }, []);


  return (
    <div className="container courses">
      <div className="content">
        {sections.map((s, idx) => (
          <section className="course-container" key={idx}>
            <p id="courseNumber">{s.courseNo}</p>
            <p id="courseName">{s.course?.name}</p>
            <p id="status">{s.status}</p>
            <p id="instructor">{s.instructors?.[0]?.userId}</p>
          </section>
        ))}
      </div>
    </div>
  );
}