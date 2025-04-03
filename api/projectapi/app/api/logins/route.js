import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const user = await Repository.getUser(...req);
    return Response.json(user, {status:200})
}