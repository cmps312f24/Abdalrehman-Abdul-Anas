import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const student = await Repository.getStudent(req);
    return Response.json(student, {status:200})
}

export async function PUT(req) {
    const response = await Repository.updateStudent(req);
    return Response.json(response, {status:200})
}