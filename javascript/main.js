let isTableShown = true;

document.addEventListener("DOMContentLoaded", function() {
  showTable('build', buildings);

  const toggleTableButton = d3.select('#toggle-table-button');

  toggleTableButton.node().addEventListener('click', () => {
    isTableShown = !isTableShown;
    console.log('in event listener', isTableShown)

    if (isTableShown) {
      toggleTableButton.node().innerHTML = 'Скрыть таблицу';
      showTable('build', buildings);
    } else {
      toggleTableButton.node().innerHTML = 'Показать таблицу';
      removeTableRows('build');
    }

  })
})