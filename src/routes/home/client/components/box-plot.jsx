import React from "react";
import { connect } from 'react-redux';
import {Begin_GET_PERFORMANCE} from '../store/action';
import * as d3 from "d3";
import '../../../../assets/css/client/box-plot.css'


class BoxPlot extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      performance: {}
    };
  }

  componentDidMount(){
    this.props.dispatch(Begin_GET_PERFORMANCE());

  }

  render() {
    let bins = this.getBins(this.props.performance);
    // console.log(bins);
    this.createBoxPlot(bins);
    return null
  }

  getBins(data) {
    if(data === {}) {
      return data
    }
    let bins = [];
    for(let i in data){
      if(data.hasOwnProperty(i)) {
        let bin = {};
        bin.x0 = parseInt(i) + 0.01;
        bin.x1 = parseInt(i) + 1;

        let bin_data = {'loss':[], 'accuracy': []};
        for(let j in data[i]['train']) {
          if(data[i]['train'].hasOwnProperty(j)) {
            bin_data['loss'].push(data[i]['train'][j]['loss'], data[i]['test'][j]['loss']);
            bin_data['accuracy'].push(data[i]['train'][j]['accuracy'], data[i]['test'][j]['accuracy']);
          }
        }

        for(let j in bin_data) {
          if(bin_data.hasOwnProperty(j)){
            bin_data[j].sort(function(a,b){return a - b;});

            let min = bin_data[j][0];
            let max = bin_data[j][bin_data[j].length - 1];
            let q1 = d3.quantile(bin_data[j], 0.25);
            let q2 = d3.quantile(bin_data[j], 0.5);
            let q3 = d3.quantile(bin_data[j], 0.75);
            let iqr = q3 - q1;
            let r0 = Math.max(min, q1 - iqr * 1.5);
            let r1 = Math.min(max, q3 + iqr * 1.5);
            bin[j + 'Quantiles'] = [q1, q2, q3];
            bin[j + 'Range'] = [r0, r1];
            bin[j + 'Outliers'] = bin_data[j].filter(function(v){return v < r0 || v > r1;});
          }
        }
        bins.push(bin);
      }
    }
    return bins
  }

  createBoxPlot(bins) {

    if(bins.length === 0){
      return
    }

    const margin = ({top: 10, right: 30, bottom: 8, left: 30});
    const shift = ({in:8, out:25});

    const svg = d3.select("#ClientView")
      .append("svg")
      .attr('class', 'BoxSvg');

    const width = parseInt(d3.select(".BoxSvg").style("width"));
    const height = parseInt(d3.select('.BoxSvg').style('height'));

    const g = svg.append("g")
      .selectAll("g")
      .data(bins)
      .join("g");

    // const g_x = svg.append("g");
    const g_y1 = svg.append("g");
    const g_y2 = svg.append("g");


    const x = d3.scaleLinear()
      .domain([d3.min(bins, function(d){return d.x0;}), d3.max(bins, function(d){return d.x1;})])
      .rangeRound([margin.left, width - margin.right]);

    const y1 = d3.scaleLinear()
      .domain([d3.min(bins, function(d){return d.accuracyRange[0]}), d3.max(bins,function(d){return d.accuracyRange[1];})]).nice()
      .range([height - margin.bottom, margin.top]);

    const y2 = d3.scaleLinear()
      .domain([d3.min(bins, function(d){return d.lossRange[0]}), d3.max(bins,function(d){return d.lossRange[1];})]).nice()
      .range([height - margin.bottom, margin.top]);

    // g_x.attr("transform", "translate(" + 0 + "," + (height - margin.bottom) + ")")
    //   .call(d3.axisBottom(x).ticks(4));

    g_y1.attr("transform", "translate(" + margin.left + "," + 0 + ")")
      .call(d3.axisLeft(y1).ticks(5))
      .call(function(g){return g.select(".domain").remove();});

    g_y2.attr("transform", "translate(" + (width - margin.right) + "," + 0 + ")")
      .call(d3.axisRight(y2).ticks(5))
      .call(function(g){return g.select(".domain").remove();});

    //accuracy box plot
    const gAuc = g.append('g')
      .attr('class', 'BoxAuc');

    gAuc.append("path")
      .attr('class', 'Path')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 4 - shift.in / 2) + "," + y1(d.accuracyRange[1]) + " " +
          "V " + y1(d.accuracyRange[0]);
      });

    gAuc.append("path")
      .attr('class', 'Path FillPath')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out) + "," + y1(d.accuracyQuantiles[2]) + " " +
          "H " + (x(d.x0) + shift.out+ (x(d.x1) - x(d.x0) - shift.out * 2) / 2 - shift.in) +
          "V " + y1(d.accuracyQuantiles[0]) +
          "H " + (x(d.x0) + shift.out) +
          "Z"
      });

    gAuc.append("path")
      .attr('class', 'Path')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out) + "," + y1(d.accuracyQuantiles[1]) +
          "H " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 2 - shift.in);
      });

    gAuc.append("path")
      .attr('class', 'Path')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out) + "," + y1(d.accuracyRange[1]) +
          "H " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 2 - shift.in);
      });

    gAuc.append("path")
      .attr('class', 'Path')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out) + "," + y1(d.accuracyRange[0]) +
          "H " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 2 - shift.in);
      });

    gAuc.on('mouseover', mouseOver)
      .on('mouseout', mouseOut);

    //loss box plot
    const gLoss = g.append('g')
      .attr('class', 'BoxLoss');

    gLoss.append("path")
      .attr('class', 'Path')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) * 3 / 4 + shift.in / 2) + "," + y2(d.lossRange[1]) + " " +
          "V " + y2(d.lossRange[0]);
      });

    gLoss.append("path")
      .attr('class', 'Path FillPath')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 2 + shift.in) + "," + y2(d.lossQuantiles[2]) + " " +
          "H " + (x(d.x1) - shift.out) +
          "V " + y2(d.lossQuantiles[0]) +
          "H " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 2 + shift.in) +
          "Z"
      });

    gLoss.append("path")
      .attr('class', 'Path')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 2 + shift.in) + "," + y2(d.lossQuantiles[1]) +
          "H " + (x(d.x1) - shift.out);
      });

    gLoss.append("path")
      .attr('class', 'Path')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 2 + shift.in) + "," + y2(d.lossRange[1]) +
          "H " + (x(d.x1) - shift.out);
      });

    gLoss.append("path")
      .attr('class', 'Path')
      .attr("d", function (d) {
        return "M " + (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 2 + shift.in) + "," + y2(d.lossRange[0]) +
          "H " + (x(d.x1) - shift.out);
      });

    gLoss.on('mouseover', mouseOver)
      .on('mouseout', mouseOut);

    // line chart
    let lineAuc = d3.line()
      .x(d => (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) / 4 - shift.in / 2))
      .y(d => y1(d.accuracyQuantiles[1]))
      .curve(d3.curveNatural);

    svg.append("g")
      .selectAll("path")
      .data([bins])
      .join("path")
      .attr('d', lineAuc)
      .attr('class', 'BoxLine AucLine');

    let lineLoss = d3.line()
      .x(d => (x(d.x0) + shift.out + (x(d.x1) - x(d.x0) - shift.out * 2) * 3 / 4 + shift.in / 2))
      .y(d => y2(d.lossQuantiles[1]))
      .curve(d3.curveNatural);

    svg.append("g")
      .selectAll("path")
      .data([bins])
      .join("path")
      .attr('d', lineLoss)
      .attr('class', 'BoxLine LossLine');

    function mouseOver() {

      d3.selectAll('.BoxLine')
        .style('display', 'none');

      d3.selectAll('.BoxAuc')
        .style('opacity', 1);

      d3.selectAll('.BoxLoss')
        .style('opacity', 1);

      let selected = d3.select(this).attr('class');
      selected = selected.slice(3);
      let hide;
      if(selected === 'Auc'){
        hide = 'Loss'
      }else{
        hide = 'Auc'
      }

      d3.selectAll('.' + selected  + 'Line')
        .transition()
        .style('display', 'block');

      d3.selectAll('.Box' + hide)
        .transition()
        .style('opacity', 0.2);
    }

    function mouseOut() {

      d3.selectAll('.BoxLine')
        .style('display', 'none');

      d3.selectAll('.BoxAuc')
        .style('opacity', 1);

      d3.selectAll('.BoxLoss')
        .style('opacity', 1);
    }

  }

}


const mapStateToProps  = (state) => ({
  performance: state.clientView.performance
});

export default connect(mapStateToProps)(BoxPlot);
