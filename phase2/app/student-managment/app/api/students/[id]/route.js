
export default async function handler(req, res) {
  await cors(req, res);
}

import Repository from "@/app/repository/Repo.js";
export async function GET(req, {params}) {
    const student = await Repository.getStudent(params.id);
    return Response.json(student, {status:200})
}

export async function PUT(req, {params}) {
    const studentUpdates = await req.json();
    const response = await Repository.updateStudent(studentUpdates);
    return Response.json(response, {status:200})
}