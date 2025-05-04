'use client';
import { useSearchParams, useParams } from 'next/navigation';
import { getSectionGrades } from '../../actions/server-actions';


export default function GradesPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const enrollments=getSectionGrades(params.courseNo,searchParams.get(section));

  return (
    <>
        <div class="page-header">
            <h1>Web development Fundamentals L01</h1>
        </div>

        <div class="search-container grade-search">
            <form class="form-student-search">
                <div class="form-group">
                    <label class="form-label">Name:</label>
                    <div class="input-wrapper">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="search" id="name-input" class="form-input with-icon" placeholder="Student name"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Student ID:</label>
                    <div class="input-wrapper">
                        <input type="search" class="form-input" id="id-input" placeholder="Student ID"/>
                    </div>
                </div>

                <div class="button-container">
                    <button class="search-button">Search</button>
                </div>

            </form>
        </div>


        <div class="table-container grade-table">
            <table class="search-results-table">
                <thead>
                    <tr class="table-header">
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody class="tbody">
                
                </tbody>
            </table>
        </div>
    </>
  );
}