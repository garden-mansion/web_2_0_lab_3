function createArrGraph(data, key) {
  const groupObj = d3.group(data, d => d[key]);

  let arrGraph = [];
  for (let entry of groupObj) {
    const minMax = d3.extent(entry[1].map(d => {
      return d['Высота']
    }));
    arrGraph.push({ labelX: entry[0], values: minMax });
  }

  return arrGraph;
}

function drawGraph(data, dataForm) {
  const formData = new FormData(dataForm)

  const dataFormOxValue = formData.get('ox-value');
  const keyX = dataFormOxValue === 'year' ? 'Год' : 'Страна';

  let arrGraph = createArrGraph(data, keyX);

  if (keyX === 'Год') {
    arrGraph.sort((a, b) => a.labelX - b.labelX)
  }

  const svg = d3.select("svg")
  svg.selectAll('*').remove();

  const attr_area = {
    width: parseFloat(svg.style('width')),
    height: parseFloat(svg.style('height')),
    marginX: 50,
    marginY: 50
  }

  const oyValueArray = formData.getAll('oy-value');

  const chartType = formData.get('chart-type');

  const [scX, scY] = createAxis(svg, arrGraph, attr_area, oyValueArray);

  // количество данных,нужно для расчёта ширины столбцов гистограмы
  const numSeries = oyValueArray.length;
  let seriesIndex = 0;

  if (oyValueArray.includes('max-height')) {
    createChart(svg, arrGraph, scX, scY, attr_area, "red", 'max', chartType, numSeries, seriesIndex);
    seriesIndex++;
  }

  if (oyValueArray.includes('min-height')) {
    createChart(svg, arrGraph, scX, scY, attr_area, 'blue', 'min', chartType, numSeries, seriesIndex);
    seriesIndex++;
  }
}

function createAxis(svg, data, attr_area, oyValueArray) {
  let allValues = [];

  if (oyValueArray.includes('min-height')) {
    allValues.push(...data.map(d => d.values[0]));
  }

  if (oyValueArray.includes('max-height')) {
    allValues.push(...data.map(d => d.values[1]));
  }

  const [min, max] = d3.extent(allValues);

  const scaleX = d3.scaleBand()
    .domain(data.map(d => d.labelX))
    .range([0, attr_area.width - 2 * attr_area.marginX]);

  const scaleY = d3.scaleLinear()
    .domain([min * 0.85, max * 1.1])
    .range([attr_area.height - 2 * attr_area.marginY, 0]);

  const axisX = d3.axisBottom(scaleX);
  const axisY = d3.axisLeft(scaleY);

  svg.append("g")
    .attr("transform", `translate(${attr_area.marginX}, 
                                    ${attr_area.height - attr_area.marginY})`)
    .call(axisX)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", d => "rotate(-45)");

  svg.append("g")
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .call(axisY);

  return [scaleX, scaleY];
}

function createChart(svg, data, scaleX, scaleY, attr_area, color, type, chartType, numSeries, seriesIndex) {
  if (chartType === 'bar-chart') {
    createBarChart(svg, data, scaleX, scaleY, attr_area, color, type, numSeries, seriesIndex);
  } else {
    createDotChart(svg, data, scaleX, scaleY, attr_area, color, type);
  }
}

function createDotChart(svg, data, scaleX, scaleY, attr_area, color, type) {
  const r = 4;
  const valueIndex = type === 'max' ? 1 : 0;

  svg.selectAll(`.dot-${type}`)
    .data(data)
    .enter()
    .append("circle")
    .attr("class", `dot-${type}`)
    .attr("r", r)
    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
    .attr("cy", d => scaleY(d.values[valueIndex]))
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .style("fill", color);
}

function createBarChart(svg, data, scaleX, scaleY, attr_area, color, type, numSeries, seriesIndex) {
  // Отступ группы от краёв полосы (доля от bandwidth)
  const groupPadding = 0.3;
  // Отступ между столбцами внутри группы (в пикселях)
  const barGap = 1;

  // Доступная ширина для группы столбцов (с учётом отступов по краям)
  const groupWidth = scaleX.bandwidth() * (1 - groupPadding);
  // Смещение группы от начала полосы (центрирование)
  const groupOffset = (scaleX.bandwidth() - groupWidth) / 2;

  // Ширина одного столбца с учётом зазоров между ними
  const barWidth = (groupWidth - barGap * (numSeries - 1)) / numSeries;

  const chartHeight = attr_area.height - 2 * attr_area.marginY;
  const valueIndex = type === 'max' ? 1 : 0;

  svg.selectAll(`.bar-${type}`)
    .data(data)
    .enter()
    .append("rect")
    .attr("class", `bar-${type}`)
    .attr("x", d => scaleX(d.labelX) + groupOffset + seriesIndex * (barWidth + barGap))
    .attr("y", d => scaleY(d.values[valueIndex]))
    .attr("width", barWidth)
    .attr("height", d => chartHeight - scaleY(d.values[valueIndex]))
    .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
    .style("fill", color);
}

function isChartFormValid(dataForm) {
  const formData = new FormData(dataForm);

  const oyValues = formData.getAll('oy-value');

  if (!oyValues.length) {
    return false;
  }

  return true;
}

function showErrorInChartForm() {
  const errorLabel = d3.select('.oy-value-error').node();

  errorLabel.classList.remove('oy-value-error_display_none')
}

function hideErrorInChartForm() {
  const errorLabel = d3.select('.oy-value-error').node();

  if (!errorLabel.classList.contains('oy-value-error_display_none')) {
    errorLabel.classList.add('oy-value-error_display_none')
  }
}

