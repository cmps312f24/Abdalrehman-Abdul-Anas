import React, { useEffect, useState } from 'react'
import { getStudentScheduleAction } from '../actions/server-actions';

export default function ScheduleTable({ user }) {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (user?.id && user?.role === 'STUDENT') {
                const result = await getStudentScheduleAction(user.id);
                setSections(result);
            }
        };
        fetchSchedule();
    }, [user]);
    
    return (
        <div className="table-container schedual">
            <table className="schedual-table">
                <thead className="summary-header">
                    <tr className="table-header-row">
                        <th>Days</th>
                        <th>Sunday</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                    </tr>
                </thead>
                <tbody className="tbody">
                    <tr className="schedual-body-row h8am">
                        <td>8 am</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h9am">
                        <td>9 am</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h10am">
                        <td>10 am</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h11am">
                        <td>11 am</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h12pm">
                        <td>12 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h1pm">
                        <td>1 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h2pm">
                        <td>2 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h3pm">
                        <td>3 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h4pm">
                        <td>4 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h5pm">
                        <td>5 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h6pm">
                        <td>6 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h7pm">
                        <td>7 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                    <tr className="schedual-body-row h8pm">
                        <td>8 pm</td>
                        <td className="sun"></td>
                        <td className="mon"></td>
                        <td className="tue"></td>
                        <td className="wed"></td>
                        <td className="thu"></td>
                    </tr>
                </tbody>

            </table>
        </div>
    )
}
