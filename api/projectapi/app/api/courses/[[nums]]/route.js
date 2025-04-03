import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const course = await Repository.getCourse(req);
    return Response.json(course, {status:200});
}

export async function PUT(req) {
    const response = await Repository.updateCourse(req);
    return Response.json(response, { status: 200 });
}

