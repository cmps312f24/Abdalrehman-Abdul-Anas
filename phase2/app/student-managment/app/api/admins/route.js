
export default async function handler(req, res) {
  await cors(req, res);
}

import Repository from "@/app/repository/Repo.js";
export async function GET(req) {
    const admins = await Repository.getAdmins();
    return Response.json(admins, {status:200})
}