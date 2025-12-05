// script.js
const DATA_PATH = 'data/default_credit.csv';

// layout
const margin = { top: 30, right: 20, bottom: 70, left: 80 };
const fullWidth = 960;
const fullHeight = 520;
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

// create svg container
const container = d3.select('#chart');
const svg = container.append('svg')
  .attr('width', fullWidth)
  .attr('height', fullHeight);

const g = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// tooltip
const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

// education mapping
const EDU_LABELS = {
  '0': 'Unknown/Other',
  '1': 'Graduate school',
  '2': 'University',
  '3': 'High school',
  '4': 'Others',
  '5': 'Others',
  '6': 'Others'
};

function mapEducation(code) {
  const c = String(code);
  return EDU_LABELS[c] || 'Others';
}

d3.csv(DATA_PATH, d3.autoType).then(rawData => {
  console.log('Loaded rows:', rawData.length);

  // detect default column
  const cols = Object.keys(rawData[0] || {});
  let defaultCol = cols.find(col => col.toLowerCase().includes('default'));
  if (!defaultCol) {
    console.error('Default column not found. Columns:', cols);
    d3.select('#chart').append('p')
      .text('Error: default column not found in CSV. Check header names.');
    return;
  }

  // preprocess
  rawData.forEach(d => {
    d.EDUCATION = mapEducation(d.EDUCATION);

    // normalize gender codes
    if (d.SEX === 1 || d.SEX === "1") d.SEX = "male";
    else d.SEX = "female";

    d._default = +d[defaultCol];
  });

  let filteredData = rawData;

  const x = d3.scaleBand().padding(0.15).range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'x-axis');

  const yAxisG = g.append('g').attr('class', 'y-axis');

  g.append('text')
    .attr('class', 'y-label')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 18)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Default rate (%)');

  g.append('text')
    .attr('class', 'x-label')
    .attr('x', width / 2)
    .attr('y', height + 50)
    .attr('text-anchor', 'middle')
    .text('Education level');

  function update(data) {
    if (data.length === 0) {
      g.selectAll('.bar').remove();
      console.warn("No data for selected filter.");
      return;
    }

    const agg = Array.from(
      d3.rollup(
        data,
        v => {
          const total = v.length;
          const defaults = d3.sum(v, d => d._default);
          return { total, defaults, rate: defaults / total };
        },
        d => d.EDUCATION
      ),
      ([education, stats]) => ({ education, ...stats })
    );

    agg.sort((a, b) => b.rate - a.rate);

    x.domain(agg.map(d => d.education));
    y.domain([0, d3.max(agg, d => d.rate) * 1.15]);

    xAxisG.call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-25)")
      .style("text-anchor", "end");

    yAxisG.transition().duration(400)
      .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

    const bars = g.selectAll('.bar').data(agg, d => d.education);

    bars.exit()
      .transition().duration(500)
      .attr('y', y(0))
      .attr('height', 0)
      .remove();

    bars.transition().duration(700)
      .attr('x', d => x(d.education))
      .attr('y', d => y(d.rate))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.rate));

    const enter = bars.enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.education))
      .attr('y', y(0))
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .style('fill', '#2b8cbe')
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 1)
          .html(`
            <strong>${d.education}</strong><br/>
            Defaults: ${d.defaults} / ${d.total}<br/>
            Rate: ${(d.rate * 100).toFixed(2)}%
          `);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', (event.pageX + 12) + 'px')
               .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => tooltip.style('opacity', 0));

    enter.transition().duration(800)
      .attr('y', d => y(d.rate))
      .attr('height', d => height - y(d.rate));
  }

  update(filteredData);

  // gender dropdown
  d3.select('#genderFilter').on('change', (event) => {
    const val = event.target.value;
    filteredData = (val === 'all')
      ? rawData
      : rawData.filter(d => d.SEX === val);

    update(filteredData);
  });

  // reset button
  d3.select('#resetBtn').on('click', () => {
    d3.select('#genderFilter').property('value', 'all');
    filteredData = rawData;
    update(filteredData);
  });

}).catch(err => {
  console.error('Error loading data:', err);
  d3.select('#chart').append('p')
    .text('Failed to load data. Check browser console for details.');
});
