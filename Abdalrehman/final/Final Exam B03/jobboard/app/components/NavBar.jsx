'use client'
import { getJobsAction , getApplicationsNoAction} from "../actions/server-actions";
import { useState,useEffect } from "react";

export default function NavBar() {

    const [jobs,setJobs]= useState([]);
    const [applications,setapp]= useState([]);

    async function loadData() {
        const dataj = await getJobsAction();
        const dataa = await getApplicationsNoAction();
        setJobs(dataj.length);
        setapp(dataa);
    }

    useEffect(() => { loadData() }, [])

    return (
        <div className="banner">
            <div className="container">
                <div className="banner-content">
                    <div className="logo">
                        <i className="fas fa-briefcase"></i>
                        <span>JobBoard</span>
                    </div>
                    <div className="banner-stats">
                        <div className="stat-item">
                            <i className="fas fa-building"></i>
                            <span id="totalJobs">{jobs}</span>
                            <span className="stat-label">Active Jobs</span>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-file-alt"></i>
                            <span id="totalApplications">{applications}</span>
                            <span className="stat-label">Applications</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}