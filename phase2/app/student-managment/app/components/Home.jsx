'use client';

import { useEffect, useState } from 'react';
import Graph from '@/app/components/Graph';
import Calendar from '@/app/components/Calendar';
import { uniInfoAction } from '../actions/server-actions';

export default function Home() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setRole(parsed.role);
    }
  }, []);

  return (
    <div id="Home-box">
      <div className="backgroud-home"></div>
      <section id="content-home">
        <UniSection />
        {user && <UserSection user={user} />}
        <Calendar />
      </section>
    </div>
  );
}

function UniSection() {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    const fetchUniInfo = async () => {
      try {
        const uni = await uniInfoAction();
        const lines = uni.info?.split(/(?=\d-)/).map(line => line.trim()) || [];
        setInfo(lines);
      } catch (err) {
        setInfo([]);
      }
    };
    fetchUniInfo();
  }, []);

  return (
    <span id="uni-info" className="content-home">
      <h2 className="header-home">Information</h2>
      <p id="uni-info-text">
        {info.map((line, idx) => (
          <span key={idx}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </span>
  );
}

function UserSection({ user }) {
  if (user.role === 'ADMIN' || user.role === 'INSTRUCTOR') return null;
  const last = user.gpa?.[user.gpa.length - 1];

  let gpa=0;
  let CH=0;
  if (last){
    gpa=last.gpa;
    CH=last.CH;
  }

  return (
    <span id="stu-info" className="content-home">
      <span id="student-text">
        <h2 className="header">Student Information</h2>
        <p id="stu-info-text">
          Major : {user.major}
          <br />
          GPA : {gpa}
          <br />
          CH : {CH}
        </p>
      </span>
      <Graph gpaList={user.gpa} />
    </span>
  );
}

