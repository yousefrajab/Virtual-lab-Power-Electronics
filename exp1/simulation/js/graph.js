function plotData() {
  if(plot_data_points.length>1){
    var graph = document.getElementById("graph-new");
    graph.style.height = "650px";
    graph.innerHTML = "";
    var graph_element = document.createElement("div");
    graph_element.id = "VR";
    graph_element.classList.add("graph-style");
    graph.append(graph_element);
    Plotly.newPlot(
      "VR",
      plot_data_points,
      {
        title: "<b>" +"Output Characteristics"+ "</b>",
        xaxis: {
          range: [0, 7.1],
          title: "<b>V<sub>CE</sub> (V)</b>",
          fixedrange: true,
        },
        yaxis: {
          range: [-1, 70],
          title: "<b>I<sub>C</sub> (mA)</b>",
          fixedrange: true,
        },
        margin: { t: 35 },
      },
      { displayModeBar: false }
    );
  }
}
