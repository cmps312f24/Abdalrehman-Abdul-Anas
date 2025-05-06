import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class jobsRepo {

    async getJobs(status){
        if (status){
            return await prisma.job.findMany({where:{isActive:status}, include:{applications:true}});
        }
        return await prisma.job.findMany({include:{applications:true}});
    }

    async getJob(id){
        return await prisma.job.findUnique({where:{id:id},
                                            include:{applications:true}})
    }

    async addApplication(newApplication){
        await prisma.application.create({data:newApplication});
    }

    async deleteApplication(id){
        await prisma.application.delete({where:{id:id}});
    }

    async updateJob(id,status){
        await prisma.job.update({data:{isActive:status},where:{id:id}})
    }

    async getApplicationsNo(id){
        if(id){
            return await prisma.application.count({where:{jobId:id}})
        }
        return await prisma.application.count();
    }
}

export default new jobsRepo();