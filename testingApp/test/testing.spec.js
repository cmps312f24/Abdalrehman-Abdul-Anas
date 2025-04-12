import { expect } from "chai";
import { approveCourse, removeCourse, completeCourse } from '../../phase1/Admin/js/index.js';
describe("Testing the functionality", async () => {
    it("Expect changing course status to approved", async() => {
        let course = await fetch("http://localhost:3000/api/courses/CMPS151").then((response) => response.json());
        const courseStatusBefore = course.sections[0].status;
        await approveCourse(course.courseNo,course.sections[0].sectionID);
        course = await fetch("http://localhost:3000/api/courses/CMPS151").then((response) => response.json());
        const courseStatusAfter = course.sections[0].status;
        expect(courseStatusAfter).to.equal("current");
    });
    it("Expect changing course sections length to sections length - 1", async() => {
        let course = await fetch("http://localhost:3000/api/courses/CMPS151").then((response) => response.json());
        const courseSectionsLength = course.sections.length;
        await removeCourse(course.courseNo,course.sections[0].sectionID);
        course = await fetch("http://localhost:3000/api/courses/CMPS151").then((response) => response.json());
        const courseStatusAfter = course.sections.length;
        expect(courseStatusAfter).to.equal("current");
    });
    it("Expect changing course status to completed", async() => {
        let course = await fetch("http://localhost:3000/api/courses/CMPS151").then((response) => response.json());
        const courseStatusBefore = course.sections[0].status;
        await completeCourse(course.courseNo,course.sections[0].sectionID);
        course = await fetch("http://localhost:3000/api/courses/CMPS151").then((response) => response.json());
        const courseStatusAfter = course.sections[0].status;
        expect(courseStatusAfter).to.equal("completed");
    });

});