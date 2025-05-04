'use client';
import { useSearchParams, useParams } from 'next/navigation';

export default function GradesPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const courseNo = params.courseNo;
  const sectionNo = searchParams.get('section');
  const status = searchParams.get('status');

  return (
    <div>
      <h1>Grades for Course: {courseNo}</h1>
      <p>Section: {sectionNo}</p>
      <p>Status: {status}</p>
    </div>
  );
}