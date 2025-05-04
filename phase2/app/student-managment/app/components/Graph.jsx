'use client';

import { useEffect } from 'react';

export default function Graph({ gpaList }) {
  useEffect(() => {
    async function plot() {
      const Plotly = (await import('plotly.js-dist')).default;
      if (!gpaList){return <div id="myGraph" />}
      const gpaValues = gpaList.map(e => e.gpa);
      const chValues = gpaList.map(e => e.CH);

      const data = [
        {
          x: chValues,
          y: gpaValues,
          mode: 'lines+markers',
          type: 'scatter',
        }
      ];

      const layout = {
        title: 'GPA Graph',
        xaxis: { title: 'Credit Hours' },
        yaxis: { title: 'GPA' }
      };

      Plotly.newPlot('myGraph', data, layout);
    }

    plot();
  }, [gpaList]);

  return <div id="myGraph" />;
}