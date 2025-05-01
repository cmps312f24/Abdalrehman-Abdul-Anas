
export default async function handler(req, res) {
  await cors(req, res);
}

import Repository from "@/app/repository/Repo.js";
export async function GET(req) {
    const uni = await Repository.getUni();
    return Response.json(uni, {status:200})
}
