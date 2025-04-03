import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const instructors = await Repository.getInstructors(req);
    return Response.json(instructors, {status:200});
}