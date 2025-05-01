
export default async function handler(req, res) {
  await cors(req, res);
}

import Repository from "@/app/repository/Repo.js";
export async function GET(req, {params}) {
    const path = await Repository.getPath(params.name);
    return Response.json(path, {status:200})
}