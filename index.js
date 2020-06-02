const renderData = (product, parsedResults) => {
  $('#current-name').html(product[1]);
  $('#current-description').html(product[3]);
  $('#parsed-results').JSONView(parsedResults, { collapsed: true });
}

$(function() {
  let parsedResults = [];

  $('#json-string').on('click', () => alert(JSON.stringify(parsedResults)));

  $('#csv').on('change', e => {
    Papa.parse(e.target.files.item(0), {
      complete: results => {
        let data = results.data;
        data.shift();
        let currentProduct = data.shift();
        renderData(currentProduct, parsedResults);

        $('#continue').on('click', () => {
          const productName = currentProduct[1];
          const productDescription = currentProduct[3];

          const selection = rangy.getSelection();
          const ranges = selection._ranges[0];

          if (ranges) {
            parsedResults.push({
              annotations: [{
                text_extraction: {
                  text_segment: {
                    end_offset: ranges.endOffset,
                    start_offset: ranges.startOffset
                  }
                },
                display_name: productName
              }],
              text_snippet: {
                content: productDescription
              }
            });
            currentProduct = data.shift();
            selection.removeAllRanges();
            renderData(currentProduct, parsedResults);
          }
          else {
            alert('Select product in the description first');
          }
        });
      }
    });
  });
});
