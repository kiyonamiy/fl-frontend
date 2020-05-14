/**
 * Created by zhangtianye on 2020/2/18.
 */


const margin = ({top: 20, right: 20, bottom: 20, left: 40});
const width = 400;
const height = 400;

const index = 99; // index of the training round

var opt = {}
opt.epsilon = 10; // epsilon is learning rate (10 = default)
opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
opt.dim = 2; // dimensionality of the embedding (2 = default)

var tsne = new tsnejs.tSNE(opt); // create a tSNE instance




window.onload = function(){

    d3.json("data/niid.json").then(function(data){
        console.log(data);
        const chart_data = data[index].values;

        var cos_matrix = [];
        for(var i = 0; i < chart_data.length; i++){
            var row = [];
            for(var j = 0; j < chart_data.length; j++){
                row.push(cos(chart_data[i], chart_data[j]));
            }
            cos_matrix.push(row);
        }

        //input the distance matrix
        var dist_matrix = sim2dist(cos_matrix);
        tsne.initDataDist(dist_matrix);

        for(var k = 0; k < 2000; k++) {
            tsne.step(); // every time you call this, solution gets better
        }

        const coordinates = tsne.getSolution(); // Y is an array of 2-D points that you can plot

        console.log(coordinates);

        const x = d3.scaleLinear()
            .domain(d3.extent(coordinates, function(d){return d[0];})).nice()
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain(d3.extent(coordinates, function(d){return d[1];})).nice()
            .range([height - margin.bottom, margin.top])

        const svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("font", "10px sans-serif");

        // svg.append("g")
        //     .attr("transform", "translate(" + 0 + "," + (height - margin.bottom) + ")")
        //     .call(d3.axisBottom(x).ticks(8))
        //     .call(function (g) {return g.select(".domain").remove();});
        //
        //
        // svg.append("g")
        //     .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        //     .call(d3.axisLeft(y))
        //     .call(function (g) {return g.select(".domain").remove();});

        svg.append("g")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("fill", "none")
            .selectAll("circle")
            .data(coordinates)
            .join("circle")
            .attr("cx", function (d) {return x(d[0]);})
            .attr("cy", function(d){return y(d[1]);})
            .attr("r", 3)
            .on("mouseover", function(d, i){

                svg.append("text")
                    .attr("x", function() { return x(d[0]) - 25; })
                    .attr("y", function() { return y(d[1]) - 10; })
                    .attr("id", function(){return "t" + i})
                    .attr("dy", ".15em")
                    .text(function(){return "client" + i;});
            })
            .on("mouseout", function(d, i){
                d3.select("#t" + i).remove();  // Remove text location
            });

    });
}


function sim2dist(matrix){

    var row_maxs = [];
    var row_mins = [];
    for(var i = 0; i < matrix.length; i++ ){
        var row_max = d3.max(matrix[i]);
        var row_min = d3.min(matrix[i]);
        row_maxs.push(row_max);
        row_mins.push(row_min);
    }

    var normalize = d3.scaleLinear()
        .domain([d3.min(row_mins), d3.max(row_maxs)])
        .range([0, 1])

    var result = [];
    for(var i = 0; i < matrix.length; i++){
        var row = [];
        for(var j = 0; j < matrix[i].length; j++){
            row.push(1 - normalize(matrix[i][j]));
        }
        result.push(row);
    }

    return result;
}

