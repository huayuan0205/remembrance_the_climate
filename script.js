//import csv
const dataPromise = d3.csv('./data/data-sample.csv', parseData);

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

	var wheel_radius = 412;
	var dot_radius = 2;
	var start_dot_originalX = 425;
	var start_dot_originalY = 462;

	var text_item_width = 400;
	var text_item_height = 400;
	var text_wrap_width = 314;
	
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
		.attr('class', 'wheel-img')
		.attr('id', 'wheel-img')
		.attr('xlink:href', "./img/wheel-dark.png")
		.style('transition', 'transform 1s ease 0s')
		//.attr('transform','translate(-412,50) rotate(0 412 412)')
		//safari
		.style('transform-origin','412px 412px')
		.style('transform', `translate(-412px, 50px)`)

	//dots & labels
	//dots
	var timeline = canvas.append('g')
		.attr('id', 'timeline')
		.style('transition', 'all 1s ease 0s')
		//.attr('transform', `translate(0 0) rotate(-90 0 ${start_dot_originalY})`)
		//set start position
		.style('transform-origin',`0 ${start_dot_originalY}px`)//(0,462)
		.style('transform',`translate(0,0) rotate(-90deg)`)

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
		//.attr('dx','-5px')
		.attr('dy','.35em')
		.attr('transform',(d) =>{
			var trans_x, trans_y = 0;
			var rotate_degree = avg_degree * (d.year - startYear);

			trans_x = (wheel_radius-5) * Math.cos(toRadians(rotate_degree));
			if (rotate_degree <= 90) {
				trans_y = (wheel_radius-5) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
			} else if (rotate_degree <= 180) {
				trans_y = (wheel_radius-5) * Math.sin(toRadians(180 - rotate_degree)) + start_dot_originalY;
			}
			return `translate(${trans_x},${trans_y}) rotate(${rotate_degree})`
		})
		.style('text-anchor','end')
		.style('transition', 'all 1s ease 0s')
		.text((d)=>{
			return d.year;
		})
	
	//text items
	var text_item = canvas.append('g')
		.selectAll('.text-item')
		.data(rows)
		.enter()
		.append('text')
		.attr('class','text-item')
		.attr('id',(d,i)=>{return `text-item-${i}`})
		.attr('width',`${text_item_width}px`)
		.attr('height',`${text_item_height}px`)
		//.style('transition', 'transform .8s ease 0s, opacity 0.8s ease 0s')
		.style('transition', 'transform .8s ease 0s, opacity .5s ease 0s')
		//.style('transform-origin','left top')
		//.attr('transform','translate(20,380) rotate(90)')
		.style('transform-origin','0px 0px')
		.style('transform', `translate(20px, 380px) rotate(90deg)`)
		.style('opacity',0)
	
	text_item.append("tspan")
		.text(d => d.city)
		.attr('class','text-id')

	text_item.append("tspan")
		.text(d => d.title)
		.attr('class','text-title')	
		.attr('x', 0)
		.attr('dy', '1.7em')
	
	text_item.append("tspan")
		.text(d => d.date)
		.attr('class','text-date')	
		.attr('x', 0)
		.attr('dy', '2.2em')
	
	text_item.append("tspan")
		.text(d => d.story)
		.attr('class','text-desc')	
		.attr('x', 0)
		.attr('dy', '1.5em')
		.call(wrap,1.5,text_wrap_width)
	
	//fix the description part in a given width
	function wrap(text, dy, width) {
		text.each(function () {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineHeight = 1.2, //ems
				x = text.attr("x"),
				y = text.attr("y"),
				tspan = text.text(null)
							.append("tspan")
							.attr("x", x)
							.attr("y", y)
							.attr("dy", dy + "em");
			
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan")
								.attr("x", x)
								.attr("y", y)
								.attr("dy", lineHeight + "em")
								.text(word);
				}
			}
		});
	}		
	
	//onboard animation
	//wheel
	//wheel.attr('transform','translate(-412,50) rotate(90 412 412)')	
	wheel.style('transform-origin','412px 412px')
		.style('transform', `translate(-412px, 50px) rotate(90deg)`);
	//dots and labels
	timeline
		//.attr('transform', `translate(0 0) rotate(0 0 462)`);
		.style('transform-origin','0 462px')
		.style('transform', `translate(0,0)`);
	//first dot
	let first_dot = d3.select('#d-0');
	first_dot
		.attr('r',4)
		.style('transition-delay','1s')
		.style('fill', 'rgb(0,0,0)');
	//first label 2018
	let first_label = d3.select('#label-0');
	first_label
		.attr('r',4)
		.style('transition-delay','1s')
		.style('opacity',.7)
		.style('font-family','Trade Bold');
	//first text item 
	let fisrt_content = d3.select('#text-item-0');
	fisrt_content
		//.style('transform-origin','0 0')
		//.style('transform', 'translate(20px,380px) rotate(0)')
		.style('opacity',1)
		.style('transition', 'transform .8s ease 0s, opacity .5s ease 0s')
		//.style('transform-origin','0px 0px')
		.style('transform', `translate(20px, 380px) rotate(0deg)`)


	//rotation
	var currentWheel = d3.select('#wheel-img');
	var currentDots = timeline.selectAll('.dot');
	var currentLabels = timeline.selectAll('.label-text')

	var index = 0;
	var sumAngle = 0
	var wheel_sumAngle = 90;
	let old_url = window.location.href;

	function rotation_def(index, up_down) {
		let rotationAngle = 0;
		let wheelAngle = 0;

		if (up_down == 'down') {
			//clear onboarding delay 
			first_label.style('transition-delay','0s');
			first_dot.style('transition-delay','0s');

			rotationAngle = 0 - degrees[index];//counter-clockwise
			wheelAngle = 0 - 18;

			//switch text items
			let current_word_label = d3.select('#text-item-'+(index-1));
			console.log('now',(index-1))
			console.log('down',index);

			let last_word_label = d3.select('#text-item-'+index);

			current_word_label//rotate out
				//.attr('transform', `translate(20,380) rotate(0)`)
				.style('transform-origin','0px 0px')
				.style('transform', `translate(20px, 380px) rotate(-180deg)`)
				.style('opacity',0)
				
			last_word_label//rotate in
				//.attr('transform', `translate(20,400) rotate(0)`)
				.style('transform-origin','0px 0px')
				.style('transform', `translate(20px, 380px) rotate(0deg)`)
				.style('opacity',1)
			
			//change URL path?
			let new_url =old_url + '#/durham-'+ (index+1);
			window.history.pushState({},0,new_url);
		}
		if (up_down == 'up') {
			//clear onboarding delay 
			first_label.style('transition-delay','0s');
			first_dot.style('transition-delay','0s');

			rotationAngle = degrees[index + 1];
			wheelAngle = 18;

			//switch text items
			let current_word_label = d3.select('#text-item-'+(index+1))
			console.log('now',(index+1))
			console.log('up',(index));

			let next_word_label = d3.select('#text-item-'+(index))

			current_word_label//rotate out
				//.attr('transform', `translate(20,380) rotate(0)`)
				.style('transform-origin','0px 0px')
				.style('transform', `translate(20px, 380px) rotate(180deg)`)
				.style('opacity',0)
			next_word_label//rotate in
				//.attr('transform', `translate(20,380) rotate(0)`)
				.style('transform-origin','0px 0px')
				.style('transform', `translate(20px, 380px) rotate(0deg)`)
				.style('opacity',1)

			//change URL path?
			let new_url =old_url + '/#/durham-'+ (index+1);
			window.history.pushState({},0,new_url);
		}

		//transition to original color and size
		currentDots.style('fill', 'rgb(255,255,255)')
			.attr('r',dot_radius)
			.style('transition-delay','none');
		//current dot is black
		d3.select('#d-' + index)
			.attr('r',4)
			.style('fill', 'rgb(0,0,0)');
		
		currentLabels.style('opacity', 0.3)
			.style('font-family','Trade')
			.style('transition-delay','none');
		//current label is bold
		d3.select('#label-' + index)
			.style('opacity',.8)
			.style('font-family','Trade Bold');
		
		wheel_sumAngle += wheelAngle;
		sumAngle += rotationAngle;

		// timeline
		// 	.attr('transform', `translate(0 0) rotate(${sumAngle} 0 462)`);
		timeline.style('transform-origin','0px 462px')
			.style('transform', `translate(0,0) rotate(${sumAngle}deg)`);
		// currentWheel
		// 	.attr('transform', `translate(-412 50) rotate(${wheel_sumAngle} 412 412)`);
		// safari
		currentWheel
		.style('transform-origin','412px 412px')
		.style('transform', `translate(-412px, 50px) rotate(${wheel_sumAngle}deg)`);
	}

	//keydown-scroll
	document.addEventListener("keydown", function(event) {
		event.preventDefault();
		
		const key = event.key; // "ArrowUp", or "ArrowDown"
		
		switch (key) { 
		  case "ArrowUp":
			// Up pressed
			keyUp();
			break;
		  case "ArrowDown":
			// Down pressed
			keyDown();
			break;
		}
	  });

	function keyUp(){
		if (index - 1 >= 0) {
			index--;
			rotation_def(index, 'up');
		}
	}
	function keyDown(){
		if (index + 1 < degrees.length) {
			index++;
			rotation_def(index, 'down');
		}
	}
	
	//touch on mobile device
	// document.addEventListener('touchmove', function(event) {
	// 	event.preventDefault();

	// 	if (index - 1 >= 0) {
	// 		index--;
	// 		rotation_def(index, 'up');
	// 	}
	// 	if (index + 1 < degrees.length) {
	// 		index++;
	// 		rotation_def(index, 'down');
	// 	}

	// }, true);

	//scroll
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

	// var rotating = false;

	// onMouseScroll {
	// 	if(!rotating) {
	// 		rotateWheel()
	// 	};
	// }

	// rotateWheel { 
	// 	rotating = true; 
	// 	//fires animations
	// 	//after these animations are done they should automatically call 
	// 	function(){ rotating = false;}
	// }

	//mobile touch
	bindTouch('#scroll', _.debounce(function(type) {
		if(type === 'up' || type === 'left') {
			keyDown();
		} else {
			keyUp();
		}
	},500));
})
