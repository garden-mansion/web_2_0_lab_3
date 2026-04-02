// Входные данные:
//   data - исходный массив (например, buildings)
//   key - поле, по которому осуществляется группировка

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

  // значения по оси ОХ    
  // const keyX = "Год";
  // const dataFormOxValue = dataForm['ox-value'].value;
  const dataFormOxValue = formData.get('ox-value');

  const keyX = dataFormOxValue === 'year' ? 'Год' : 'Страна';

  // создаем массив для построения графика
  let arrGraph = createArrGraph(data, keyX);

  /* если выбран Год, то отсортировать массив по labelX */
  if (keyX === 'Год') {
    arrGraph.sort((a, b) => a.labelX - b.labelX)
  }

  const svg = d3.select("svg")
  svg.selectAll('*').remove();

  // создаем словарь с атрибутами области вывода графика
  const attr_area = {
    width: parseFloat(svg.style('width')),
    height: parseFloat(svg.style('height')),
    marginX: 50,
    marginY: 50
  }

  // const oyValueArray = [...dataForm['oy-value']].map(input => input.value);
  const oyValueArray = formData.getAll('oy-value');

  // создаем шкалы преобразования и выводим оси
  /* 
  добавить параметр, который указывает какие графики выводить
  минимальные значения, максимальные значения или оба 
  */
  const [scX, scY] = createAxis(svg, arrGraph, attr_area, oyValueArray);

  // рисуем график/ графики
  /* добавить параметр, какой именно график рисуем */
  /* рисуем график с минимальными значениями, если это необходимо */
  if (oyValueArray.includes('min-height')) {
    createChart(svg, arrGraph, scX, scY, attr_area, 'blue', 'min');
  }

  /* рисуем график с максимальными значениями, если это необходимо */
  if (oyValueArray.includes('max-height')) {
    createChart(svg, arrGraph, scX, scY, attr_area, "red", 'max')
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

// createChart(svg, arrGraph, scX, scY, attr_area, "red", 'max')
function createChart(svg, data, scaleX, scaleY, attr_area, color, type) {
  const r = 4;

  if (type === 'max') {
    // Отображение максимальных 
    svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", r)
      .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
      .attr("cy", d => scaleY(d.values[1]))
      .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
      .style("fill", color)
  } else if (type === 'min') {
    // отображение минимальных
    svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", r)
      .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
      .attr("cy", d => scaleY(d.values[0] + 4))
      .attr("transform", `translate(${attr_area.marginX}, ${attr_area.marginY})`)
      .style("fill", color)
  }
}

