import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const instructor = await Repository.getInstructor(req);
    return Response.json(instructor, {status:200});
}
export async function PUT(req) {
    const response = await Repository.updateinstructor(req);
    return Response.json(response, { status: 200 });
}