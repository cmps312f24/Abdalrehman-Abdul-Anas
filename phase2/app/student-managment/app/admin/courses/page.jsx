'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCoursesAction } from '../../actions/server-actions';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getUserFromToken } from '@/app/actions/server-actions';

export default function CoursesPage() {
  const [sections, setSections] = useState([]);
  const router = useRouter();

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

  const displayGrades = (section) => {
    router.push(
      `/instructor/courses/${section.courseNo}/grades?section=${section.section}`
    );
  };

  return (
    <div className="container courses">
      <div className="content">
        {sections.map((s, idx) => (
          <section
            className="course-container"
            key={idx}
            onClick={() => displayGrades(s)}
          >
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