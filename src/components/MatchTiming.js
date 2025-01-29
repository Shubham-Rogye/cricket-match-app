import React, { useEffect, useState } from 'react'
import jsonData from "../scheduleMatch.json"

const MatchTiming = () => {
    const [timeSchedule, setTimeSchedule] = useState(jsonData.schedule)
    
  return (
    <section className='time_table_section p-5'>
        <div className='container'>
            <h1 className='text-light'>Upcomming Match List</h1>
              {timeSchedule.length < 1 ? (
                <div className="no_record">
                    <h2 className="text-danger">No records found</h2>
                </div>
              ) : (
                <table className='table table-hover table-dark table-striped table-bordered mt-5'>
                    <thead>
                        <tr className='table-warning'>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Match</th>
                            <th>Venue</th>
                            <th>time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeSchedule.map((data) => (
                            <tr key={data.id}>
                            <td>{data.date}</td>
                            <td>{data.day}</td>
                            <td>{data.match}</td>
                            <td>{data.venue}</td>
                            <td>{data.time}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              )}
        </div>
    </section>
  )
}

export default MatchTiming
