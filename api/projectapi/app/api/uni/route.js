import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const uni = await Repository.getUni();
    return Response.json(uni, {status:200})
}