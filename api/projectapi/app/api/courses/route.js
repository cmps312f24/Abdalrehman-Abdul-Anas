import Repository from "@/app/repository/Repository";
export async function GET(req) {
    const courses = await Repository.getCourses();
    return Response.json(courses, {status:200});
}

export async function POST(req) {
    const response = await Repository.addCourse(req);
    return Response.json(response, { status: 200 });
}
