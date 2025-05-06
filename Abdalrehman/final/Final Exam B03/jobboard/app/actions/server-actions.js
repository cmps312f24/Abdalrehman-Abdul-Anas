'use server'

import jobsRepo from "@/app/Repo/jobsRepo";
import { redirect } from 'next/navigation'

function removeServerActionProperty(data) {
    for (const key in data) {
        if (key.startsWith('$ACTION_ID_')) {
            delete data[key];
            break
        }
    }
    return data
  }

export async function  getJobsAction(status) {
    return await jobsRepo.getJobs(status);
}

export async function getApplicationsNoAction(id){
    return await jobsRepo.getApplicationsNo(id);
}

export async function getjobById(id) {
    return await jobsRepo.getJob(id);
}


export async function addApplication(formData) {
    let application = Object.fromEntries(formData);
    application=removeServerActionProperty(application);
    application.jobId=parseInt(application.jobId);
    console.log(application)
    await jobsRepo.addApplication(application);
    redirect('/')
}