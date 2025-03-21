async function courses() {
    const data = await fetch(BASE_URL);
    courses = await data.json();
    return courses;
}

