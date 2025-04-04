import Repository from "@/app/repository/Repo.js";
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const campus = searchParams.get('campus');
    const courses = await Repository.getCourses(status,campus);
    return Response.json(courses, { status: 200 });
}

export async function POST(req) {
    const newCourse = await req.json();
    const response = await Repository.addCourse(newCourse);
    return Response.json(response, { status: 200 });
}
