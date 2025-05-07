import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StatisticRepo {
  static async totalStudents() {
    return {
      title: "Total Students",
      value: await prisma.student.count(),
    };
  }

  static async totalInstructors() {
    return {
      title: "Total Instructors",
      value: await prisma.instructor.count(),
    };
  }

  static async totalCourses() {
    return {
      title: "Total Courses",
      value: await prisma.course.count(),
    };
  }

  static async totalEnrollments() {
    return {
      title: "Total Enrollments",
      value: await prisma.enrollment.count(),
    };
  }

  static async mostEnrolledCourse() {
    const result = await prisma.enrollment.groupBy({
      by: ['courseNo'],
      _count: { courseNo: true },
      orderBy: { _count: { courseNo: 'desc' } },
      take: 1,
    });

    return {
      title: "Most Enrolled Course",
      value: result[0]?.courseNo || "N/A",
      description: "Course with the most students",
    };
  }

  static async topInstructor() {
    const result = await prisma.sectionInstructor.groupBy({
      by: ['userId'],
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 1,
    });

    return {
      title: "Top Instructor",
      value: result[0]?.userId || "N/A",
      description: "Instructor teaching most sections",
    };
  }

  static async averageGPA() {
    const result = await prisma.gPARecord.aggregate({
      _avg: { gpa: true }
    });
    return {
      title: "Average GPA",
      value: result._avg.gpa?.toFixed(2) || "N/A",
    };
  }

  static async highestGPAStudent() {
    const result = await prisma.gPARecord.groupBy({
      by: ['studentId'],
      _avg: { gpa: true },
      orderBy: { _avg: { gpa: 'desc' } },
      take: 1,
    });
    const student = await prisma.student.findUnique({
      where: { id: result[0]?.studentId || "" },
    });
    return {
      title: "Highest GPA Student",
      value: student?.name || "N/A",
      description: `GPA: ${result[0]?._avg.gpa.toFixed(2)}`,
    };
  }

  static async courseDistributionByCollege() {
    const result = await prisma.course.groupBy({
      by: ['college'],
      _count: { college: true },
    });
    return {
      title: "Colleges Offering Courses",
      value: result.length,
      description: result.map(r => `${r.college}: ${r._count.college}`).join(', '),
    };
  }

  static async genderDistribution() {
    const males = await prisma.student.count({ where: { gender: 'MALE' } });
    const females = await prisma.student.count({ where: { gender: 'FEMALE' } });
    return {
      title: "Student Gender Ratio",
      value: `${males} M / ${females} F`,
    };
  }

  static async mostCommonMajor() {
    const result = await prisma.student.groupBy({
      by: ['major'],
      _count: { major: true },
      orderBy: { _count: { major: 'desc' } },
      take: 1,
    });
    return {
      title: "Most Common Major",
      value: result[0]?.major || "N/A",
      description: `${result[0]?._count.major} students`,
    };
  }

  static async getAllStatistics() {
    return await Promise.all([
      this.totalStudents(),
      this.totalInstructors(),
      this.totalCourses(),
      this.totalEnrollments(),
      this.mostEnrolledCourse(),
      this.topInstructor(),
      this.averageGPA(),
      this.highestGPAStudent(),
      this.courseDistributionByCollege(),
      this.genderDistribution(),
      this.mostCommonMajor(),
    ]);
  }
}
