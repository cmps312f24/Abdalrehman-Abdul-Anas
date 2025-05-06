'use client';

import { useEffect, useState } from "react";
import { getJobsAction, getApplicationsNoAction } from "./actions/server-actions";
import Link from "next/link";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [applicationCounts, setApplicationCounts] = useState({});
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getJobsAction(showActiveOnly); 
      setJobs(data);

      const counts = {};
      for (const job of data) {
        const count = await getApplicationsNoAction(job.id);
        counts[job.id] = count;
      }
      setApplicationCounts(counts);
    }

    loadData();
  }, [showActiveOnly]);

  const handleToggle = async (e) => {
    setShowActiveOnly(e.target.checked); 
  };

  return (
    <div className="container">
      <div className="filters">
        <label className="toggle">
          <input type="checkbox" id="showActiveOnly" onChange={handleToggle} />
          <span className="slider"></span>
          Show Active Jobs Only
        </label>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`job-card ${!job.isActive ? 'job-inactive' : ''}`}
            data-job-id={job.id}
          >
            <div className="job-header">
              <div>
                <h3 className="job-title">{job.title}</h3>
                <div className="job-info">
                  <i className="fas fa-building"></i>
                  <span>{job.company}</span>
                </div>
                <div className="job-info">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{job.location}</span>
                </div>
              </div>
              <span className={`status-badge ${!job.isActive ? 'status-inactive' : ''}`}>
                {job.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="job-info">
              <i className="fas fa-briefcase"></i>
              <span>{job.type}</span>
            </div>
            <div className="job-info">
              <i className="fas fa-money-bill-wave"></i>
              <span>{job.salary}</span>
            </div>

            <div className="job-actions">
              <div className="application-count">
                <i className="fas fa-users"></i>
                <span className="count">{applicationCounts[job.id] ?? 0}</span>
                <span>applications</span>
              </div>

              {job.isActive && (
                <Link href={`/jobs/${job.id}`} className="btn btn-primary">
                  Apply Now
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}