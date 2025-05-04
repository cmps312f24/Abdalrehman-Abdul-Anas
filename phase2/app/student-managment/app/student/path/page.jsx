"use client"

import { getPathAction } from "@/app/actions/server-actions"
import { useEffect } from "react"

export default function Path() {
  useEffect(() => {
    async function displayPath() {
      const content = document.querySelector("#Flowchart-content")
      const user = JSON.parse(localStorage.user);

      const mapColor = {
        completed: "#359A6C",
        pending: "#E9DC78",
        current: "#F19A2F",
        uncompleted: "#101820",
      }

      const path= getPathAction(user.major);

      let index = 1
      for (const c of path) {
        if (c.name === "empty") {
          index++
          continue
        }
        
        const courseElement = document.createElement("span")
        courseElement.className = "course"
        courseElement.id = `c${index}`
        courseElement.style.backgroundColor = mapColor[section.status]

        courseElement.innerHTML = `
          ${c.name}<br>${c.courseNo}
          <div class="course-details">
            <div>Credits: ${c.credit}</div>
            <div>Status: ${section.status}</div>
            <div>Grade: ${section.grade}</div>
          </div>
        `
        content.appendChild(courseElement)
        index++
      }
    }

    displayPath()
  }, []) 

  return (
    <div className="container path">
      <div className="header-path">
        <div className="year">First Year</div>
        <div className="year">Second Year</div>
        <div className="year">Third Year</div>
        <div className="year">Fourth Year</div>
      </div>

      {/* Flowchart Content */}
      <div id="Flowchart-content">
        {/* Courses will be added here by the JavaScript */}

        {/* Arrows */}
        <div id="Arrows">
          <img src="/img/Arrow 1.png" id="arrow1" className="arrow" alt="" />
          <img src="/img/Arrow 1.png" id="arrow2" className="arrow" alt="" />
          <img src="/img/Arrow 1.png" id="arrow3" className="arrow" alt="" />
          <img src="/img/Arrow 17.png" id="arrow17" className="arrow" alt="" />
          <img src="/img/Arrow 18.png" id="arrow18" className="arrow" alt="" />
          <img src="/img/Arrow 3.png" id="arrow4" className="arrow" alt="" />
          <img src="/img/Arrow 9.png" id="arrow5" className="arrow" alt="" />
          <img src="/img/Arrow 6.png" id="arrow6" className="arrow" alt="" />
          <img src="/img/Arrow 8.png" id="arrow7" className="arrow" alt="" />
          <img src="/img/Arrow 4.png" id="arrow8" className="arrow" alt="" />
          <img src="/img/Arrow 27.png" id="arrow9" className="arrow" alt="" />
          <img src="/img/Arrow 1.png" id="arrow10" className="arrow" alt="" />
          <img src="/img/Arrow 1.png" id="arrow11" className="arrow" alt="" />
          <img src="/img/Arrow 23.png" id="arrow12" className="arrow" alt="" />
          <img src="/img/Arrow 24.png" id="arrow13" className="arrow" alt="" />
          <img src="/img/Arrow 24.png" id="arrow14" className="arrow" alt="" />
          <img src="/img/Arrow 1.png" id="arrow15" className="arrow" alt="" />
          <img src="/img/Arrow 26.png" id="arrow20" className="arrow" alt="" />
          <img src="/img/Arrow 15.png" id="arrow16" className="arrow" alt="" />
          <img src="/img/Arrow 21.png" id="arrow19" className="arrow" alt="" />
          <img src="/img/Arrow 21.png" id="arrow30" className="arrow" alt="" />
          <img src="/img/Arrow 21.png" id="arrow31" className="arrow" alt="" />
          <img src="/img/Arrow 16.png" id="arrow32" className="arrow" alt="" />
          <img src="/img/Arrow 1.png" id="arrow33" className="arrow" alt="" />
          <img src="/img/Arrow 12.png" id="arrow34" className="arrow" alt="" />
          <img src="/img/Arrow 14.png" id="arrow35" className="arrow" alt="" />
          <img src="/img/Arrow 44.png" id="arrow36" className="arrow" alt="" />
        </div>
      </div>
    </div>
  )
}
