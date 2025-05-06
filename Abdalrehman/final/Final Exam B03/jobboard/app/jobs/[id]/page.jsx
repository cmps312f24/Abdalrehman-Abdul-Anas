

import { addApplication, getjobById } from "@/app/actions/server-actions"
import Link from "next/link";
export default async function Home({ params }) {

    const id =await params.id;
    const job = await getjobById(parseInt(id));

    return(
        <div className="application-form-container">
            <h1>here is the application page for job {job.title} </h1>
            <div className="form-actions">
                <Link href='/' className="btn btn-secondary">
                    <i className="fas fa-arrow-left"></i> Back to Jobs
                </Link>
            </div>
            <form className="application-form" data-job-id={job.id} action={addApplication}>
                <input type="hidden" name="jobId" value={job.id}/>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="resume">Resume Link</label>
                    <input type="url" id="resume" name="resume" required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit Application</button>
            </form>
        </div>
    )
}