import Repository from "@/app/repository/Repo.js";
export async function GET(req) {
    const students = await Repository.getStudents();
    return Response.json(students, {status:200})
}