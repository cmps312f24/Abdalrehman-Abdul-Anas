
export default async function handler(req, res) {
  await cors(req, res);
}

import Repository from "@/app/repository/Repo.js";
export async function GET(req, {params}) {
    const admin = await Repository.getAdmin(params.id);
    return Response.json(admin, {status:200});
}

export async function PUT(req, {params}) {
    const adminUpdates = await req.json();
    const response = await Repository.updateAdmin(adminUpdates);
    return Response.json(response, { status: 200 });
}