/* eslint-disable radix */
import React from "react";
import { connect } from 'react-redux';
import * as d3 from "d3";
import '../../assets/css/client/server-client.css'



class ServerClient extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      performance: {}
    };
  }

  render() {
    let clients = this.getClients(this.props.performance);
    this.createSankey(clients);
    return null
  }

  getClients(data){
    if(Object.keys(data).length === 0) {
      return data
    }

    let clients = {};
    for(let round in data){
      if(data.hasOwnProperty(round)){
        for(let id in data[round]['train']){
          if(data[round]['train'].hasOwnProperty(id)){
            if(clients.hasOwnProperty(id)){
              clients[id].push(parseInt(round));
            }else{
              clients[id] = [parseInt(round)]
            }
          }
        }
      }
    }

    let res = [];
    for(let c in clients){
      if(clients.hasOwnProperty(c)){
        res.push({client: c, rounds: clients[c]});
      }
    }
    return res
  }

  createSankey(clients){

    const len = Object.keys(clients).length;

    if(len === 0){
      return
    }

    const size = {rectWidth:50, rectHeight:20, innerMargin: 5};
    const padding = 10;

    // add server rect
    const ServerSvg = d3.select("#ClientView")
      .append('svg')
      .attr('id', 'ServerSvg');

    ServerSvg.append('circle')
     .attr('id', 'ServerCircle');

    d3.select("#ClientView")
      .append('text')
      .text('Server')
      .attr('class', 'ServerText LegendText');

    // add client rect
    const containerBound = {top: 205, bottom: 705};

    d3.select("#ClientView")
      .append('text')
      .text('Client')
      .attr('class', 'ClientText LegendText');

    const container = d3.select("#ClientView")
      .append("div")
      .attr('id', 'ContainerDiv');

    const clientSvg = container.append('svg')
      .attr('class','ClientSvg')
      .attr('height', (size.rectHeight + padding) * len - padding);

    const g = clientSvg.append('g')
      .selectAll("g")
      .data(clients)
      .join("g");

    g.append('rect')
      .attr('class', function(d,i){
        let y = (size.rectHeight + padding) * i;
        if( y >= 0 && y <= containerBound.bottom - containerBound.top){
          return 'ClientRect Display'
        }else{
          return 'ClientRect Hidden'
        }

      })
      .attr('id', function(d, i){
        return 'rect' + i.toString();
      })
      .attr('y', function (d,i) {
        return (size.rectHeight + padding) * i;
      });

    // add circles in client rects
    const minRound = d3.min(clients, function(d){return d.rounds[0];});
    const maxRound = d3.max(clients, function(d){return d.rounds[d.rounds.length - 1];});

    const xCircle = d3.scaleLinear()
      .domain([minRound, maxRound])
      .rangeRound([size.innerMargin, size.rectWidth - size.innerMargin]);

    const colorScale = d3.scaleSequentialSqrt([minRound, maxRound], d3.interpolateYlGnBu);

    g.selectAll('circle')
      .data(function (d, i) {
        let data = [];
        d.rounds.forEach((e) => {
          let obj = {client: i, round: e};
          data.push(obj);
        });
        return data
      })
      .join('circle')
      .attr('class', 'RoundCircle')
      .attr('cx', function(d){
        return xCircle(d.round)
      })
      .attr('cy', function (d) {
        return (size.rectHeight + padding) * d.client + 0.5 * size.rectHeight;
      })
      .attr('fill', function(d){
        return colorScale(d.round);
      });

    // add color legend
    const colorSvg = d3.select("#ClientView")
      .append("svg")
      .attr('id', 'ColorLegendSvg');

    const defs = colorSvg.append("defs");

    const linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");

    linearGradient.selectAll("stop")
      .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    colorSvg.append('g')
      .append("rect")
      .attr('id', 'ColorLegend')
      .style("fill", "url(#linear-gradient)");

    colorSvg.append('text')
      .attr('class', 'LegendText')
      .text('Round ' + minRound.toString())
      .attr('x', 0)
      .attr('y', 13.5);

    colorSvg.append('text')
      .attr('class', 'LegendText')
      .text('Round ' + maxRound.toString())
      .attr('x', 365)
      .attr('y', 13.5);

    // add curves
    const serverAttr = {r: 8, cy: 250};


    const gCurve = d3.select('#ServerSvg')
      .append('g')
      .selectAll("g")
      .data(clients)
      .join("g");

    let displayRects = document.querySelectorAll('.Display')
    appendCurve(gCurve, displayRects);

    // bind mousewheel to client rects
    let scrollable = d3.select('#ContainerDiv');
    scrollable.on('mousewheel', function () {

      d3.selectAll('.Curve').remove();
      d3.selectAll('.ClientRect')
        .attr('class', function (d, i) {
          let rectBound = document.querySelector('#rect' + i.toString()).getBoundingClientRect();
          // console.log(rectBound);
          if((rectBound.top >= containerBound.top && rectBound.top <= containerBound.bottom) ||
            (rectBound.bottom >= containerBound.top && rectBound.bottom <= containerBound.bottom)){
            return 'ClientRect Display'
          }else{
            return 'ClientRect Hidden'
          }
        });

      let displayRects = document.querySelectorAll('.Display');

      appendCurve(gCurve, displayRects);
    });

    function curve(x0, y0, x1, y1) {
      let curvature = 0.5;
      // same with the position of the serverRect and ClientRect
      let xi = d3.interpolateNumber(x0, x1),
        x2 = xi(curvature),
        x3 = xi(1 - curvature);
      return "M" + x0 + "," + y0
        + "C" + x2 + "," + y0
        + " " + x3 + "," + y1
        + " " + x1 + "," + y1;
    }

    function appendCurve(dom, displayRects) {
      dom.append('path')
        .attr('class', 'Curve')
        .attr('d', function (d, i) {
          let rectId = '#rect' + i.toString();
          let rectClass = d3.select(rectId).attr('class');
          if(rectClass === 'ClientRect Hidden'){
            return null
          }
          let top = document.querySelector(rectId).getBoundingClientRect().top;
          return curve(serverAttr.r * 2, serverAttr.cy, 80, top + size.rectHeight / 2 - containerBound.top)
        });
    }

  }

}


const mapStateToProps  = (state) => ({
  performance: state.Client.test
});

export default connect(mapStateToProps)(ServerClient);
