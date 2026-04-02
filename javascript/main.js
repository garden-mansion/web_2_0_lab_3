let isTableShown = true;

document.addEventListener("DOMContentLoaded", function () {
  showTable('build', buildings);

  const toggleTableButton = d3.select('#toggle-table-button');

  toggleTableButton.node().addEventListener('click', () => {
    isTableShown = !isTableShown;

    if (isTableShown) {
      toggleTableButton.node().innerHTML = 'Скрыть таблицу';
      showTable('build', buildings);
    } else {
      toggleTableButton.node().innerHTML = 'Показать таблицу';
      removeTableRows('build');
    }
  });

  const dataForm = d3.select('form#chart-settings').node();

  const drawGraphButton = d3.select('form#chart-settings>button[type="submit"]').node();

  drawGraphButton.addEventListener('click', (event) => {
    event.preventDefault();
    drawGraph(buildings, dataForm);
  })
})