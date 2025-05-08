'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const Plotly = dynamic(() => import('plotly.js-dist-min'), { ssr: false })

export default function Graph ({ gpaList }) {
  useEffect(() => {
    if (!gpaList?.length) return
    const x = gpaList.map(v => v.CH)
    const y = gpaList.map(v => v.gpa)
    Plotly.then(P =>
      P.newPlot('myGraph', [{ x, y, mode: 'lines+markers', type: 'scatter' }],
                { title: 'GPA Graph', xaxis: { title: 'Credit Hours' }, yaxis: { title: 'GPA' } })
    )
  }, [gpaList])
  return <div id='myGraph' />
}