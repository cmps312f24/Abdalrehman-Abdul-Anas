'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCoursesAction } from '../../actions/server-actions';

export default function CoursesPage() {
  const [sections, setSections] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const stored = localStorage.getItem('user');
      if (!stored) return;

      const user = JSON.parse(stored);
      const sectionsData = await getCoursesAction(user);
      setSections(sectionsData);
    };

    fetchData();
  }, []);

  const displayGrades = (section) => {
    router.push(
      `/instructor/courses/${section.courseNo}/grades?section=${section.section}&status=${section.status}`
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