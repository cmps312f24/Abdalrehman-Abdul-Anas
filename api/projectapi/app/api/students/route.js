import Repository from "@/app/repository/Repsotiry.js";
export async function GET(req) {
    const students = await Repository.getStudents();
    return Response.json(students, {status:200})
}