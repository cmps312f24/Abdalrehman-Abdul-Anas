import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const admin = await Repository.getAdmin(req);
    return Response.json(admin, {status:200});
}

export async function PUT(req) {
    const response = await Repository.updateAdmin(req);
    return Response.json(response, { status: 200 });
}