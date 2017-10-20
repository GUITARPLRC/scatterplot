const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
var data = [],
	howMany = 0,
	totalSecondsBehind = 0;

const margin = {top:25, right:50, bottom:25, left:25},
		height = 500 - margin.top - margin.bottom,
		width = 1000 - margin.left - margin.right;

const makeChart = () => {
	// append tooltip div
	var toolTip = d3.select('#chart')
			.append('div')
			.attr('class', 'tooltip');

	// set y scale
	var y = d3.scaleLinear()
						.domain([1, howMany + 1])
						.range([0, height - margin.top - margin.bottom]);

	// set x scale
	var x = d3.scaleLinear()
						.domain([totalSecondsBehind + 10 ,0])
						.range([0, width - margin.left - margin.right]);

	// create axis'
	var yAxis = d3.axisLeft(y).scale(y);
	var xAxis = d3.axisBottom(x).scale(x);

	//make chart
	var svg = d3.select('#chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('transform', `translate(-${margin.left},-${margin.top})`)
			.style('background', 'white')
			.style('box-shadow', '0 5px 10px rgba(0,0,0,0.7)')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`);

	// create dats points
	svg.selectAll('.circle')
		.data(data)
		.enter()
		.append('circle')
			.attr('cy', function(d,i) {
				return y(d.Place);
			})
			.attr('cx', function(d,i) {
				return x(d.secondsBehind);
			})
			.attr('r', 5)
			.attr('class', 'circle')
			.style('fill', function(d) {
				if (d.Doping != "") {
					return "red";
				} else  {
					return "black";
				}
			})
			.on('mouseover', function(d,i) {
				this.style.opacity = "0.5";
				var Dope = "";
				if (d.Doping != "") {
					Dope += d.Doping;
				} else  {
					Dope += "No Doping Allegations";
				}
				toolTip.html(`${d.Name}: ${d.Nationality}<br/>Year: ${d.Year}, Time: ${d.Time}<br/><br/>${Dope}`);
				toolTip.transition()
				.duration(150)
				.style('opacity', 0.9)
			})
			.on('mouseout', function() {
				this.style.opacity = '1';
				toolTip.transition()
				.duration(150)
				.style('opacity', 0)
			});
			/* TODO fix me
			d3.selectAll('.circle').append('text')
				.style('color', "#000")
				.attr('x', x(d.secondsBehind))
				.attr('y', y(d.Place))
				.attr("transform", "translate(15,+4)");
				.text(function(d) {
					return d.Name
				});
				*/

	// display/append axis
	svg.append('g')
		.call(yAxis);

	svg.append('g')
		.attr('transform', `translate(0,${height - margin.top - margin.left})`)
		.call(xAxis);

	svg.append("text")
			.attr('transform', 'translate(' + (width / 2) + ' ,' + (height) + ')')
			.style('text-anchor', 'middle')
			.text('Seconds Behind Leader');

	svg.append("text")
			.attr("transform", "translate("+ (margin.left) +",0), rotate(270)")
			.style("text-anchor", "end")
			.text("Ranking");

	//legend
	svg.append('circle')
		.attr('cx', function(d) {
			return x(10);
		})
		.attr('cy', function(d) {
			return y(20);
		})
		.attr('r', 5)
		.attr('fill', 'red');

	svg.append('text')
		.attr('x', function(d) {
			return x(10)+6;
		})
		.attr('y', function(d) {
			return y(20)+5;
		})
		.text('Doping Allegations');

	svg.append('circle')
		.attr('cx', function(d) {
			return x(10);
		})
		.attr('cy', function(d) {
			return y(22);
		})
		.attr('r', 5)
		.attr('fill', 'black');

	svg.append('text')
		.attr('x', function(d) {
			return x(10)+6;
		})
		.attr('y', function(d) {
			return y(22)+4;
		})
		.text('No Doping Allegations');
}

// init get all data and add data for chart
const getData = () => {
	d3.json(url, (d) => {
		data.push(...d);
	});

	window.setTimeout( () => {
		data.map( function(each) {
			each.secondsBehind = each.Seconds - 2210;
			totalSecondsBehind = each.secondsBehind;
			if (each.Doping != "") {
				each.legend = "Doping Allegations";
			} else {
				each.lengend = "No Doping Allegations";
			}
		})

		data.map( function(each) {
			howMany++;
		});

		makeChart();
	}, 200)
};

getData();
