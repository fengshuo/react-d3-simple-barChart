import React, { Component, PropTypes } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { axisLeft, axisBottom } from 'd3-axis'

class BarChart extends Component {
	static PropTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		data: PropTypes.array,
	}

	componentDidMount() {
		const node = this.node;
		const margin = this.props.margin;
		const canvasWidth = this.props.width - margin.left - margin.right;
		const canvasHeight = this.props.height - margin.top - margin.bottom;
		select(node).attr("transform", "translate(" + this.props.margin.left + "," + this.props.margin.top + ")")
						.attr("class", "canvas");

		this.renderChart();
	}

	componentDidUpdate() {
		this.renderChart()
	}

	renderChart() {
		const node = this.node;
		const data = this.props.data;
		const canvasSize = this.getCanvasSize()

		// scale and axis
		const xScale = scaleBand().rangeRound([0, canvasSize.width]).padding(0.1)
					.domain(data.map(function(d) { return d.type; }));

		const yScale = scaleLinear().rangeRound([canvasSize.height, 0])
					.domain([0, max(data, function(d) { return d.value; })]);

		select(node)
      	.selectAll(".axis.axis--x")
      	.data([0])
      	.enter()
      	.append("g")
      	.attr("class", "axis axis--x")
      	.attr("transform", "translate(0," + canvasSize.height + ")")
      	.call(axisBottom(xScale));

      	select(node)
	    .selectAll(".axis.axis--x")
	    .transition()
	    .duration(1000)
	    .call(axisBottom(xScale));

  		select(node)
      	.selectAll(".axis.axis--y")
      	.data([0])
      	.enter()
      	.append("g")
      	.attr("class", "axis axis--y")
      	.call(axisLeft(yScale))

      	select(node)
	    .selectAll(".axis.axis--y")
	    .transition()
	    .duration(1000)
	    .call(axisLeft(yScale))

		// rect
		let rects = select(node)
	      .selectAll("rect.bar")
	      .data(this.props.data)
	      
	     rects.enter()
	      .append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) {
			return xScale(d.type)
			})
		  .attr("y", function(d) {
			return yScale(d.value)
		  })
		  .attr("width", xScale.bandwidth())
		  .attr("height", function(d) {
			return canvasSize.height - yScale(d.value)
		  })
		  .style("opacity", 0)
		  .style("fill", "steelblue")
		  .transition()
		  .duration(1000)
		  .style("opacity", 1)

	      rects.exit()
	      .remove()

	    rects
	      .transition()
	      .duration(1000)
	      .attr("x", function(d) {
			return xScale(d.type)
			})
		  .attr("y", function(d) {
			return yScale(d.value)
		  })
		  .attr("width", xScale.bandwidth())
		  .attr("height", function(d) {
			return canvasSize.height - yScale(d.value)
		  })

	    
	}


	getCanvasSize() {
		const margin = this.props.margin;
		const canvasWidth = this.props.width - margin.left - margin.right;
		const canvasHeight = this.props.height - margin.top - margin.bottom;
		return {
			width: canvasWidth,
			height: canvasHeight
		}
	}

	render() {
		return (
			<svg width={this.props.width} height={this.props.height}>
				<g ref={node => this.node = node} />
			</svg>
		)
	}
}

export default BarChart;