import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const students = await Repository.getStudents(req);
    return Response.json(students, {status:200})
}