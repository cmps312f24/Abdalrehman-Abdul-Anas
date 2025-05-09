console.log(await prisma.sectionInstructor.create({
      data: {
        courseNo: "CMPS151",
        section : "01",
        userId :  '1001',
        role :    'INSTRUCTOR'
      }
    }));