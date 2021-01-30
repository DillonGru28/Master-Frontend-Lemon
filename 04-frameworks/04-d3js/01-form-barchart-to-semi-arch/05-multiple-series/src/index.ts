import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";
import {
  resultCollectionSpainNov19,
  resultCollectionSpainApr19,
  ResultEntry,
} from "./data";

const svgDimensions = { width: 800, height: 500 };
const margin = { left: 5, right: 5, top: 10, bottom: 10 };

const chartDimensions = {
  width: svgDimensions.width - margin.left - margin.right,
  height: svgDimensions.height - margin.bottom - margin.top,
};

const updateChart = (data: ResultEntry[]) => {
  d3.selectAll("path")
    .data(pieChart(<any>data))
    .transition()
    .duration(500)
    .attr("d", <any>arc);
};

document
  .getElementById("april")
  .addEventListener("click", function handleResultsApril() {
    updateChart(resultCollectionSpainApr19);
  });

document
  .getElementById("november")
  .addEventListener("click", function handleResultsNovember() {
    updateChart(resultCollectionSpainNov19);
  });

const partiesColorScale = d3
  .scaleOrdinal([
    "#ED1D25",
    "#0056A8",
    "#5BC035",
    "#6B2E68",
    "#F3B219",
    "#FA5000",
    "#C50048",
    "#029626",
    "#A3C940",
    "#0DDEC5",
    "#FFF203",
    "#FFDB1B",
    "#E61C13",
    "#73B1E6",
    "#FFA500",
  ])
  .domain([
    "PSOE",
    "PP",
    "VOX",
    "UP",
    "ERC",
    "Cs",
    "JxCat",
    "PNV",
    "Bildu",
    "Más pais",
    "CUP",
    "CC",
    "BNG",
    "Teruel Existe",
    "Compromis",
  ]);

// Define the div for the tooltip
const div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgDimensions.width)
  .attr("height", svgDimensions.height);

const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("width", chartDimensions.width)
  .attr("height", chartDimensions.height);

const radius = Math.min(chartDimensions.width, chartDimensions.height) / 2;

chartGroup.attr("transform", `translate(${radius},${radius})`);

const arc = d3
  .arc()
  .innerRadius(radius / 1.7) // We want to have an arc with a propotional width
  .outerRadius(radius);

const pieChart = d3
  .pie<ResultEntry>()
  .startAngle(-90 * (Math.PI / 180))
  .endAngle(90 * (Math.PI / 180))
  .value(function (d: any) {
    return d.seats;
  })
  .sort(null);

const arcs = chartGroup
  .selectAll("slice")
  .data(pieChart(resultCollectionSpainNov19))
  .enter();
arcs
  .append("path")
  .attr("d", <any>arc) // Hack typing: https://stackoverflow.com/questions/35413072/compilation-errors-when-drawing-a-piechart-using-d3-js-typescript-and-angular/38021825
  .attr("fill", (d, i) => {
    return partiesColorScale(d.data.party);
  })
  .on("mouseover", function (mouseEvent: any, datum: any) {
    d3.select(this).attr("transform", `scale(1.1, 1.1)`);
    const partyInfo = datum.data;
    const coords = { x: mouseEvent.clientX, y: mouseEvent.clientY };
    div.transition().duration(200).style("opacity", 0.9);
    div
      .html(`<span>${partyInfo.party}: ${partyInfo.seats}</span>`)
      .style("left", `${coords.x}px`)
      .style("top", `${coords.y - 28}px`);
  })
  .on("mouseout", function (d, i) {
    d3.select(this).attr("transform", ``);
    div.transition().duration(500).style("opacity", 0);
  });
// Legend
const legendLeft = margin.left;
const legendTop = radius + 5;

const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${legendLeft},${legendTop})`);

var colorLegend = legendColor().scale(partiesColorScale);

legendGroup.call(colorLegend);
