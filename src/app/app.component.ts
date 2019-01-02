import { Component, OnInit } from '@angular/core';
import * as D3 from 'D3';
import { BellService } from './bell.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bell';
  upperPoints: any = [];
  lowerPoints: any = [];
  upperX: any;
  lowerX: any;
  private data: Array<object> = [];
  constructor(private apiService: BellService) {

}
ngOnInit() {
  this.getBell();
}
getBell() {
  this.apiService.getBellData().subscribe((data: Array<object>) => {
    this.createBell(data);
  });
}
createBell(data) {
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
},
width = 800 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

const higherlimit = 1.0;
const lowerlimit = -1.0;

const higherlimitPercent = 30;
const lowerlimitPercent = 40;
const middlePercent = 30;

/********* calculate scale ***************/
const x = D3.scaleLinear()
.range([0, width]);

const y = D3.scaleLinear()
.range([height, 0]);

/********* create line path **************/
const line = D3.line()
.x(function(d) {
    return x(d.p);
})
.y(function(d) {
    return y(d.q);
});

/************ calculate upper and lower data points **************/

for (const i in data) {
if (data[i].q >= higherlimit) {
    this.upperPoints.push(data[i]);
}
}
for (const i in data) {
if (data[i].q <= lowerlimit) {
    this.lowerPoints.push(data[i]);
}
}

/***************** calculate Upper and lower line paths *************/
const upperLine = D3.line()
.x(function(upperPoints) {
    return x(upperPoints.p);
})
.y(function(upperPoints) {
    return y(upperPoints.q);
});

const lowerLine = D3.line()
.x(function(lowerPoints) {
    return x(lowerPoints.p);
})
.y(function(lowerPoints) {
    return y(lowerPoints.q);
});

/*************** calculate the minimum x point value from upper and lower data points (data value p mapped on x axis) *****************/
const upperX = [];
const lowerX = [];

for (let i = 0; i < this.upperPoints.length; i++) {
upperX.push(this.upperPoints[i].p);
}

for (let i = 0; i < this.lowerPoints.length; i++) {
lowerX.push(this.lowerPoints[i].p);
}

const customUpperPoint = D3.min(upperX);
const customLowerPoint = D3.min(lowerX);

/***************** Push an extra custom point in upper and lower data arrays to compconste path ***************/
this.upperPoints.push({q: higherlimit, p: customUpperPoint});
this.lowerPoints.push({q: lowerlimit, p: customLowerPoint});

/************ Calculate higher & lower limit lines ********************/
const higherlimitline = D3.line()
        .x(function(d,  i) {
            return i * x(d.p);
        })
        .y(function(d) {
            return y(higherlimit);
        });

const lowerlimitline = D3.line()
        .x(function(d, i) {
            return i * x(d.p);
        })
        .y(function(d) {
            return y(lowerlimit);
        });

const svg = D3.select('#bellChart').append('svg')
.attr('width', width + margin.left + margin.right)
.attr('height', height + margin.top + margin.bottom)
.append('g')
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

x.domain(D3.extent(data, function(d) {
    return d.p;
}));
y.domain(D3.extent(data, function(d) {
    return d.q;
}));

/************* Draw 3 line paths *************/
svg.append('path')
.datum(data)
.attr('class', 'line')
.attr('d', line)
.style('opacity', '0.3');

svg.append('path')
.datum(this.upperPoints)
.attr('class', 'line')
.attr('d', line)
.attr('fill', 'red')
.style('opacity', '0.3');

svg.append('path')
.datum(this.lowerPoints)
.attr('class', 'line')
.attr('d', line)
.attr('fill', 'red')
.style('opacity', '0.3');

/*********** draw paths for upper limit and lower limit lines*************/
const higherLimitPath = svg.append('path')
.attr('class', 'line')
.style('fill', 'none')
.attr('d', higherlimitline(data))
.style('stroke', '#cacaca')
.style('stroke-dasharray', 8)
.attr('fill', 'red');

const lowerLimitPath = svg.append('path')
.attr('class', 'line')
.style('fill', 'none')
.attr('d', lowerlimitline(data))
.style('stroke', '#cacaca')
.style('stroke-dasharray', 8);

/********* Add percentage text **************/
svg
.append('text')
.attr('x', width - 50)
.attr('y', 50)
.text(higherlimitPercent + '%')
.style('font-size', 12)
.style('font-weight', 'bold');

svg
.append('text')
.attr('x', width - 300)
.attr('y', 200)
.text(middlePercent + '%')
.style('font-size', 12)
.style('font-weight', 'bold');

svg
.append('text')
.attr('x', width - 50)
.attr('y', 400)
.text(lowerlimitPercent + '%')
.style('font-size', 12)
.style('font-weight', 'bold');

/************* Axes *********************/
svg.append('g')
.attr('class', 'x axis')
.attr('transform', 'translate(0,' + height + ')')
.call(D3.axisBottom(x));

svg.append('g')
.attr('class', 'y axis')
.call(D3.axisLeft(y));
}
}

