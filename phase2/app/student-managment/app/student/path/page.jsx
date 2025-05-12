"use client"

import { getPathAction } from "@/app/actions/server-actions";
import { useEffect } from "react"
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getUserFromToken } from '@/app/actions/server-actions';

export default function Path() {
  
  useEffect(() => {
    async function displayPath() {
      const content = document.querySelector("#Flowchart-content")
      const token = Cookies.get('token');
      const decoded = jwtDecode(token);
      const user = await getUserFromToken(decoded);

      const mapColor = {
        completed: "#359A6C",
        pending: "#E9DC78",
        current: "#F19A2F",
        uncompleted: "#101820",
      }

      const path= await getPathAction(user.major.split(" ").join(""));


      for (const c of path.courses) {
        const courseElement = document.createElement("span");
        courseElement.className = "course";
        courseElement.id = `c${c.order}`;
        
        const status = "uncompleted"; 
        courseElement.style.backgroundColor = mapColor[status];

        courseElement.innerHTML = `
          ${c.course.name}<br>${c.course.courseNo}
          <div class="course-details">
            <div>Credits: ${c.course.credit}</div>
            <div>Status: ${status}</div>
            <div>Grade: N/A</div>
          </div>
        `;
        content.appendChild(courseElement);
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

      <div id="Flowchart-content">

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
