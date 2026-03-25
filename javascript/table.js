// создание таблицы 
const showTable = (idTable, data) => {
  const table = d3.select("#" + idTable);

  // создание строк таблицы (столько, сколько элементов в массиве)
  const rows = table
    .selectAll("tr")
    .data(data)
    .enter()
    .append('tr')
    .style("display", "");

  // создание ячеек каждой строки на основе каждого элемента массива 
  const cells = rows
    .selectAll("td")
    .data(d => Object.values(d))
    .enter()
    .append("td")
    .text(d => d);

  // создание шапки таблицы 	  
  const head = table
    .insert("tr", "tr")
    .selectAll("th")
    .data(d => Object.keys(data[0]))
    .enter()
    .append("th")
    .text(d => d);
};

const removeTableRows = (idTable) => {
  const table = d3.select(`#${idTable}`);

  table.selectAll('tr').remove();
}