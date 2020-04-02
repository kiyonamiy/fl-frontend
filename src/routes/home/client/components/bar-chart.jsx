import React from "react";
import { connect } from 'react-redux';
import {Begin_GET_PERFORMANCE} from '../store/action';
import * as d3 from "d3";
import '../../../../assets/css/client/bar-chart.css'



class BarChart extends React.Component{

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
    let data = this.getData(this.props.performance);
    console.log(data);
    this.createBarChart(data);
    return null
  }

  getData(performance){
    let res = [];
    for(let r in performance){
      if(performance.hasOwnProperty(r)){
        let thisRound = performance[r];
        let round = {round: r, clients:[]};
        for(let c in thisRound['train']){
          if(thisRound['train'].hasOwnProperty(c)){
            let client = {
              id: c,
              round: r,
              trainAuc: thisRound['train'][c].accuracy,
              trainLoss: thisRound['train'][c].loss,
              testAuc: thisRound['test'][c].accuracy,
              testLoss:thisRound['test'][c].loss
            }
            round.clients.push(client);
          }
        }
        res.push(round);
      }
    }
    return res
  }

  createBarChart(data){

    if(data.length === 0){
      return
    }

    // add rounds text
    const textBound = {width: 460, height: 30};
    const textWidth = (textBound.width - 20) / data.length;

    const textSvg = d3.select("#ClientView")
      .append('svg')
      .attr('id', 'TextSvg');

    const text = textSvg.selectAll('text')
      .data(data)
      .join('text');

    text.attr('class', 'Text')
      .text(function (d) {
        return 'Round ' + d.round
      })
      .attr('x', function (d, i) {
        return (0.3 + i) * textWidth
      })
      .attr('y', 0.57 * textBound.height);

    // add bar charts
    const barBound = {width: 0.7 * textWidth, height: 80};
    const barPadding = 20;
    const container = d3.select("#ClientView")
      .append('Div')
      .attr('id', 'BarContainer');

    const barSvg = container.append('svg')
      .attr('id', 'BarSvg');

    const gRound = barSvg.selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', (d, i) => {return 'translate(' + textWidth * (0.3 + i) + ',' + 0 + ')'});

    const gClient = gRound.selectAll('g')
      .data((d) => {return d.clients})
      .join('g')
      .attr('transform', (d, i) => {return 'translate(' + 0 + ',' + (barBound.height + barPadding) * i + ')'});

    // TODO: add grouped barchart for every client in every round

    let group = ['Auc', 'Loss'];

    let yGroup = d3.scaleBand()
      .domain(group)
      .rangeRound([0, barBound.height])
      .paddingInner(0.1);

    let y = d3.scaleBand()
      .domain([0,1])
      .rangeRound([0, yGroup.bandwidth()])
      .padding(0.05);

    let xAuc = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(d.clients, c => d3.max([c.trainAuc, c.testAuc])))]).nice()
      .rangeRound([0,barBound.width]);

    let xLoss = d3.scaleLinear()
      .domain([0, d3.max(data, d => d3.max(d.clients, c => d3.max([c.trainLoss, c.testLoss])))]).nice()
      .rangeRound([0,barBound.width]);

    group.forEach(g => {
      const gRect = gClient.append('g')
        .attr('id', d => d.id + d.round)
        .attr('transform', 'translate(0,' + yGroup(g) + ')');

      gRect.selectAll('rect')
        .data(d => {return [d['train' + g], d['test' + g]]})
        .join('rect')
        .attr('class', (d, i) => {
          if(i === 0){
            return 'Train' + g
          }else if(i === 1){
            return 'Test' + g
          }else{
            return 'Error'
          }
        })
        .attr("x", 0)
        .attr("y", (d, i) => y(i))
        .attr("width", d => {
          if(g === 'Auc'){
            return xAuc(d) - xAuc(0)
          }else if(g === 'Loss'){
            return xLoss(d) - xLoss(0)
          }else{
            return 0
          }
        })
        .attr("height", y.bandwidth());

      gRect.selectAll('text')
        .data(d => {return [{id: d.id, round: d.round, name: 'Train' + g}, {id: d.id, round: d.round, name:'Test' + g}]})
        .join('text')
        .text(d => d.name)
        .attr('class', d => {
          return 'RectText Text' + d.id + d.round
        })
        .attr('x', 2)
        .attr('y',(d, i) => {return y.bandwidth() * 0.7 + y(i)});

      gRect.on('mouseover', function() {
        let id = d3.select(this).attr('id');
        d3.selectAll('.Text' + id)
          .style('display', 'block');
      })
        .on('mouseleave', function() {
          d3.selectAll('.RectText')
            .style('display', 'none');
        })
    });



  }

}


const mapStateToProps  = (state) => ({
  performance: state.clientView.performance
});

export default connect(mapStateToProps)(BarChart);
