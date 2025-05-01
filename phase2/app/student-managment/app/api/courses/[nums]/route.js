
export default async function handler(req, res) {
  await cors(req, res);
}

import Repository from "@/app/repository/Repo.js";
export async function GET(req, {params}) {
    const course = await Repository.getCourse(params.nums);
    return Response.json(course, {status:200});
}

export async function PUT(req, {params}) {
    const courseUpdates = await req.json();
    const response = await Repository.updateCourse(courseUpdates);
    return Response.json(response, { status: 200 });
}

