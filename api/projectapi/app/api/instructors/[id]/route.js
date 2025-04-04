import Repository from "@/app/repository/Repo.js";
export async function GET(req, {params}) {
    const instructor = await Repository.getInstructor(params.id);
    return Response.json(instructor, {status:200});
}
export async function PUT(req) {
    const instructorUpdates= await req.json();
    const response = await Repository.updateinstructor(instructorUpdates);
    return Response.json(response, { status: 200 });
}