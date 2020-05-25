
//import csv
const dataPromise = d3.csv('../data/data-sample.csv', parseData);

//
const W = d3.select('.canvas').node().clientWidth;
const H = d3.select('.canvas').node().clientHeight;
const m = { t: 50, r: 50, b: 50, l: 50 };
const w = W - m.r - m.l;
const h = H - m.t - m.b;
console.log(`W,H:${W},${H}`);

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

//parse csv
function parseData(d) {
	return {
		year: +d.Year,
		city: d.City,
		title: d.Title,
		date: d.Date,
		story: d.Story
	}
}

//d3.json("data-sample.json").then(data=>{})
dataPromise.then(function (rows) {

	var start_dot_originalX = 425;
	var start_dot_originalY = 462;
	var wheel_radius = 412;
	var dot_radius = 2;
	var startYear = rows[0].year;
	var count_year = rows[rows.length - 1].year - startYear;
	var avg_degree = 180 / count_year;
	var rotating_degrees = [];
	var degrees = [0];
	var year_sub = [0]

	//calculate rotating degrees
	for (i = 1; i < rows.length; i++) {
		var interval_year = rows[i].year - startYear;
		var new_element = d3.format(".1f")(avg_degree * interval_year);
		rotating_degrees.push(new_element);
		degrees.push(avg_degree * (rows[i].year - rows[i - 1].year));
		year_sub.push(rows[i].year - rows[i - 1].year);
	}
	console.log('each rotatiion degree=' + degrees)
	//add svg	
	var canvas = d3.select('.canvas')
		.append('svg')
		.attr('width', W)
		.attr('height', H)
		
	//add wheel image
	var wheel = canvas.append('g')
		.attr('class','g-wheel')
		.append('image')
		.attr('id', 'wheel-img')
		.attr('xlink:href', "../img/wheel-blur.png")
		.attr('transform', 'translate(-412,50)')
		
	//dots
	var timeline = canvas.append('g')
		.attr('id', 'timeline')
		.style('transition', 'all 1s ease 0s');

	var dots = timeline.selectAll('.dot')
		.data(rows)
		.enter()
		.append('circle')
		.attr('class', 'dot')
		.attr('id', (d, i) => { return `d-${i}` })
		.attr('cx', (d) => {
			var rotate_degree = avg_degree * (d.year - startYear);
			return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));
		})
		.attr('cy', (d) => {
			var rotate_degree = avg_degree * (d.year - startYear);
			if (rotate_degree <= 90) {
				return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
			} else if (rotate_degree <= 180) {
				return start_dot_originalX * Math.sin(toRadians(180 - rotate_degree)) + start_dot_originalY;
			}
		})
		.attr('r', dot_radius)
		.style('transition', 'all 1s ease 0s')
		.style('fill', 'rgb(255,255,255)');

	//labels
	var labels = timeline.append('g')
		.selectAll('.label-text')
		.data(rows)
		.enter()
		.append('text')
		.attr('class','label-text')
		.attr('id',(d,i)=>{return `label-${i}`})
		.attr('dx','-5px')
		.attr('dy','.35em')
		.attr('transform',(d) =>{
			var trans_x, trans_y = 0;
			var rotate_degree = avg_degree * (d.year - startYear);

			trans_x = (wheel_radius-10) * Math.cos(toRadians(rotate_degree));
			if (rotate_degree <= 90) {
				trans_y = (wheel_radius-10) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
			} else if (rotate_degree <= 180) {
				trans_y = (wheel_radius-10) * Math.sin(toRadians(180 - rotate_degree)) + start_dot_originalY;
			}

			return `translate(${trans_x},${trans_y}) rotate(${rotate_degree})`
		})
		.style('text-anchor','end')
		.style('color','rgb(0,0,0)')
		.style('transition', 'all 1s ease 0s')
		.text((d)=>{
			return d.year;
		})
	
	//text
	var items = canvas.append('g')
		.attr('id', 'text')
		//.style('transition', 'all 1s ease 0s');
	
	var item0 = items.append('g')
		.attr('class','item')
		.attr('id','item-0');

	item0.append('text')
		.attr('class','')

	var currentWheel = d3.select('#wheel-img');
	var currentDots = timeline.selectAll('.dot');
	var currentLabels = timeline.selectAll('.label-text')
	var index = 0;
	var sumAngle = 0
	var wheel_sumAngle = 0

	function rotation_def(index, up_down) {
		let rotationAngle = 0;
		let wheelAngle = 0;

		if (up_down == 'down') {
			rotationAngle = 0 - degrees[index];
			wheelAngle = 0 - 18;
		}
		if (up_down == 'up') {
			rotationAngle = degrees[index + 1];
			wheelAngle = 18;
		}

		//transition to original color and size
		currentDots.style('fill', 'rgb(255,255,255)')
			.attr('r',dot_radius);
		d3.select('#d-' + index)
			.attr('r',4)
			.style('fill', 'rgb(0,0,0)');
		
		currentLabels.style('opacity', 0.5)
			.style('font-family','Trade Regular');
		d3.select('#label-' + index)
			.style('opacity',1)
			.style('font-family','Trade Condensed');

		wheel_sumAngle += wheelAngle;
		sumAngle += rotationAngle;

		timeline
			.attr('transform', `translate(0 0) rotate(${sumAngle} 0 462)`);
		currentWheel
			.attr('transform', `translate(-412 50) rotate(${wheel_sumAngle} 412 412)`);
		
		// currentDots
		// 	.attr('transform', `translate(0 0) rotate(${sumAngle} 0 462)`);
		// currentLabels
		// 	.attr('transform',`translate(0 0) rotate(${sumAngle} 0 462)`);
			
	}

	function move(delta) {
		if (delta < 0) {
			if (index - 1 >= 0) {
				index--;
				rotation_def(index, 'up');

			}
		} else if (delta > 0) {
			if (index + 1 < degrees.length) {
				index++;
				rotation_def(index, 'down');
				//console.log(index);
			}
		}
	}

	var num_m = 0;

	var scrollFunc = function (e) {
		e = e || window.event;
		var delta = 0;

		if (!event) { event = window.event; }
		if (event.wheelDelta) {
			delta = event.wheelDelta / 10000;
			if (window.opera) { delta = -delta; }
		} else if (event.detail) {
			delta = -event.detail / 3;
		}
		if (delta) {
			num_m++;
			//only if num_m is even, run move()
			if (num_m % 2 == 0) {
				move(delta);
			}
		}
	}

	function throttle(fn,wait){
		var time = Date.now();
		return function(){
			if(time + wait - Date.now() < 0){
				fn();
				time = Date.now();
			}
		}
	}

	if (document.addEventListener) {
		document.addEventListener('DOMMouseScroll', throttle(scrollFunc,500), false);
	}
	window.onmousewheel = document.onmousewheel = throttle(scrollFunc,500);

})