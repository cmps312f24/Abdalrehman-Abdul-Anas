import Repository from "@/app/repository/Repo.js";
export async function GET(req) {
    const instructors = await Repository.getInstructors();
    return Response.json(instructors, {status:200});
}