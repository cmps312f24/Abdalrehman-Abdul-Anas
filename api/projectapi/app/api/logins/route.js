import Repository from "@/app/repository/Repo.js";
export async function GET(req) {
    const users = await Repository.getUsers();
    return Response.json(users, {status:200})
}