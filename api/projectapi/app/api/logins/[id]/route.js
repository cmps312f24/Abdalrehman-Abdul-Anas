import Repository from "@/app/repository/Repo.js";
export async function GET(req, {params}) {
    const user = await Repository.getUser(params.id);
    return Response.json(user, {status:200})
}

export async function PUT(req, {params}) {
    const userUpdates = await req.json();
    const response = await Repository.updateUser(userUpdates);
    return Response.json(response, {status:200})
}