// get city name from URL
var switch_to_city = getQueryVariable("city");

// use the two lines below when selecting a new place
// if the user is clicking one place ID - switch_to_city
//var switch_to_url = "https://web.northeastern.edu/climatefutures/page/" + "?city=" + switch_to_city;
//location.href = switch_to_url;

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
} //(/?id=1&image=awesome.jpg ——> getQueryVariable("id")——>return 1)

//----------- csv ---------------
// var data_src = "./data/Essex/data.csv";
// const dataPromise = d3.csv(data_src, parseData);

//parse csv
// function parseData(d) {
//   // set format for time data
//   var formatMonDay = d3.timeFormat("%B %d");
//   var formatYear = d3.timeFormat("%Y");

//   return {
//     year: +formatYear(new Date(d.date)),
//     monday: formatMonDay(new Date(d.date)),
//     //year: +d.Year,
//     city: d.spot_id,
//     title: d.event,
//     desc: d.description,
//   }
// }
//----------- csv ---------------

// set width and height
const W = d3.select('.canvas').node().clientWidth;
const H = d3.select('.canvas').node().clientHeight;
const m = {
  t: 50,
  r: 50,
  b: 50,
  l: 50
};
const w = W - m.r - m.l;
const h = H - m.t - m.b;
// console.log(`.canvas-W,H:${W},${H}`);

// disable scrolling after clicking the button
// $('#exampleModal1').on('shown.bs.modal', function (e) {
// 	document.getElementsById("scroll").disabled = true;
// 	// document.getElementById("g-wheel").disabled = true;
// 	});

// $('#exampleModal2').on('shown.bs.modal', function (e) {
// 	document.getElementsById("scroll").disabled = true;
// 	// document.getElementById("g-wheel").disabled = true;
// 	})

var topRight = false;

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

//d3.json(`https://web.northeastern.edu/climatefutures/page/data/${switch_to_city}/data.json`).then(function (json) {
d3.json(`./data/${switch_to_city}/data.json`).then(function (json) {
  // testing - use file url 'data/Essex/data.json'

  // console.log(switch_to_city);

  //remove MORE button in Essex
  //if (switch_to_city === "Essex") {
    //document.getElementById("btn_more").remove();
    // $('#about_link')
    //   .attr('href', 'https://www.essexma.org/board-selectmen/pages/coastal-resilience-resources')
  //}

  var dataArray = []; // This will be the resulting array
  for (var key in json) {
    var entry = json[key]
    dataArray.push(entry)
  }
  // console.log(dataArray);
  // })

  // dataPromise.then(function(rows) {
  //   console.log("rows");
  //   console.log(rows);

  //   //get sorted data by year
  //   var data_by_year = rows.slice().sort((a, b) => d3.ascending(a.year, b.year));//orignal date format: mm/dd/yyyy

  var wheel_radius = 480;
  var dot_radius = 2;
  var start_dot_originalX = wheel_radius + 13; //493
  var start_dot_originalY = wheel_radius + 50; //530

  //textbox on wheel
  var text_item_width = 400;
  var text_wrap_width_title = 375;
  var text_wrap_width_desc = 390;
  var text_item_height = 459;

  if (screen.width <= 375) {
    text_item_height = 444.5;
    text_wrap_width_title = 255;
    text_wrap_width_desc = 340;
  } else if (screen.width <= 505) {
    text_item_height = 438.5;
    text_wrap_width_title = 255;
    text_wrap_width_desc = 340;
  }

  //calculate rotating degrees
  var startYear = dataArray[0].year;
  var count_year = dataArray[dataArray.length - 1].year - startYear;

  //console.log(count_year);

  var avg_degree = 270 / count_year;
  var rotating_degrees = [];
  var degrees = [0];
  var year_sub = [0]

  for (i = 1; i < dataArray.length; i++) {
    var interval_year = dataArray[i].year - startYear;
    var new_element = d3.format(".1f")(avg_degree * interval_year);
    rotating_degrees.push(new_element);
    degrees.push(avg_degree * (dataArray[i].year - dataArray[i - 1].year));
    year_sub.push(dataArray[i].year - dataArray[i - 1].year);
  }
  //console.log('each rotatiion degree=' + degrees)

  // set the transition var
  var transitionTimeNormal = ' 700ms ease 0s';
  var transitionTimeFaster = ' 500ms ease 0s';
  var transitionTimeSlower = ' 1.5s ease 0s';

  //add svg
  var svg = d3.select('.canvas')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
  //console.log(`.svg-w,h:${W},${H}`);

  //add wheel image
  var wheel = svg.append('g')
    .attr('class', 'g-wheel')
    .append('image')
    .attr('class', 'wheel-img')
    .attr('id', 'wheel-img')
    .attr('xlink:href', "./img/wheel-dark.png")
    //.style('transition', 'transform' + transitionTimeNormal)
    .style('transition', 'transform 1s ease 0s')

    //safari
    .style('transform-origin', `${wheel_radius}px ${wheel_radius}px`)
    .style('transform', `translate3d(-${wheel_radius}px, 50px,0)`)

  // add dots and labels
  var timeline = svg.append('g')
    .attr('id', 'timeline')
    .style('transition', 'all' + transitionTimeFaster)

    //set start position
    .style('transform-origin', `0 ${start_dot_originalY}px`) //(0,530)
    .style('transform', `translate3d(0,0,0) rotate(-90deg)`)

  // add dots
  var dots = timeline.selectAll('.dot')
    .data(dataArray)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('id', (d, i) => {
      return `d-${i}`
    })
  dots
    .attr('cx', (d, i) => {
      var prevData = dots.data()[i - 1];
      var prevData2 = dots.data()[i - 2];
      var rotate_degree = avg_degree * (d.year - startYear);
      
      if (rotate_degree <= 180) {
        if (i > 1) {
          if (d.year == prevData['year'] && d.year == prevData2['year']) {//three dots with the same year
            // console.log(`same year2:${prevData2['year']}`);
            return ((start_dot_originalX + 20) * Math.cos(toRadians(rotate_degree)));
          } else if (d.year == prevData['year']){//two dots with the same year
            return ((start_dot_originalX + 10) * Math.cos(toRadians(rotate_degree)));
          } else {//others
            return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));
          }
        } else if (i>0) {//the 2nd dot
          if (d.year == prevData['year']){//two dots with the same year
            return ((start_dot_originalX + 10) * Math.cos(toRadians(rotate_degree)));
          } else {
            return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));
          }
        } else {//the 1st dot
          return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));
        }
      } else if (rotate_degree <= 270) {
        if (i > 0) {
          if (d.year == prevData['year'] && d.year == prevData2['year']) {
            return (-1) * (start_dot_originalX + 20) * Math.cos(toRadians(rotate_degree - 180));
          } else if (d.year == prevData['year']) { //two dots with the same year
            return (-1) * (start_dot_originalX + 10) * Math.cos(toRadians(rotate_degree - 180));
          } else {
            return (-1) * start_dot_originalX * Math.cos(toRadians(rotate_degree - 180));
          }
        } else {
          return (-1) * start_dot_originalX * Math.cos(toRadians(rotate_degree - 180));
        }
      }
    })
    .attr('cy', (d, i) => {
      var prevData = dots.data()[i - 1];
      var prevData2 = dots.data()[i - 2];
      var rotate_degree = avg_degree * (d.year - startYear);
      if (rotate_degree <= 180) {
        if (i > 1) {
          if (d.year == prevData['year'] && d.year == prevData2['year']){
            return (start_dot_originalX + 20) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
          } else if (d.year == prevData['year']) {
            return (start_dot_originalX + 10) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
          } else {
            return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
          }
        } else if(i>0){
            if (d.year == prevData['year']) {
              return (start_dot_originalX + 10) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
            } else {
              return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
            }
        } else {
          return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
        }
      } else if (rotate_degree <= 270) {
        if (i > 0) {
          if (d.year == prevData['year'] && d.year == prevData2['year']){
            return start_dot_originalY - (start_dot_originalX + 20) * Math.sin(toRadians(rotate_degree - 180));
          }
          if (d.year == prevData['year']) {
            return start_dot_originalY - (start_dot_originalX + 10) * Math.sin(toRadians(rotate_degree - 180));
          } else {
            return start_dot_originalY - start_dot_originalX * Math.sin(toRadians(rotate_degree - 180));
          }
        } else {
          return start_dot_originalY - start_dot_originalX * Math.sin(toRadians(rotate_degree - 180));
        }
      }
    })
    .attr('r', dot_radius)
    //.style('transition', 'all' + transitionTimeNormal)
    .style('transition', 'all 800ms ease 0s, opacity 1s ease 0s')
    .style('transition-delay', '0.6s')
    .style('fill', 'rgb(255,255,255)');

  //add labels
  var labels = timeline.append('g')
    .selectAll('.label-text')
    .data(dataArray)
    .enter()
    .append('text')
    .attr('class', 'label-text')
    .attr('id', (d, i) => {
      return `label-${i}`
    })
    //.attr('dx','-5px')
    .attr('dy', '.35em')
    .attr('transform', (d) => {
      var trans_x, trans_y = 0;
      var rotate_degree = avg_degree * (d.year - startYear);

      //trans_x
      if (rotate_degree <= 180) {
        trans_x = (wheel_radius - 5) * Math.cos(toRadians(rotate_degree));
      } else if (rotate_degree <= 270) {
        trans_x = (-1) * (wheel_radius - 5) * Math.cos(toRadians(rotate_degree - 180));
      }
      //trans_y
      if (rotate_degree <= 180) {
        trans_y = (wheel_radius - 5) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
      } else if (rotate_degree <= 270) {
        trans_y = start_dot_originalY - (wheel_radius - 5) * Math.sin(toRadians(rotate_degree - 180));
      }
      return `translate(${trans_x},${trans_y}) rotate(${rotate_degree})`
    })
    .style('text-anchor', 'end')
    //.style('transition', 'all' + transitionTimeNormal)
    .style('transition', 'all 800ms ease 0s, opacity 1s ease 0s')
    .style('transition-delay', '0.6s')
    .text((d) => {
      return d.year;
    })

  //add text items on the wheel
  var text_item = svg
    .selectAll('.text-item-g')
    .data(dataArray)
    .enter()
    .append('g')
    .attr('class', 'text-item-g')
    .attr('id', (d, i) => {
      return `text-item-g-${i}`
    })
    .style('transition', 'transform 1s ease 0s, opacity .5s ease 0s')
    .style('transform-origin', '0px 0px')
    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(90deg)`)
    .style('opacity', 0)

  var text_item2 = svg
    .selectAll('.text-item-g2')
    .data(dataArray)
    .enter()
    .append('g')
    .attr('class', 'text-item-g2')
    .attr('id', (d, i) => {
      return `text-item-g2-${i}`
    })
    .style('transition', 'transform 1s ease 0s, opacity .5s ease 0s')
    .style('transform-origin', '0px 0px')
    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(90deg)`)
    .style('opacity', 0)

  var text_top = text_item
    .append('text')
    .attr('class', 'text-item-top')
    .attr('id', (d, i) => {
      return `text-item-top-${i}`
    })
    .attr('width', `${text_item_width}px`)
    .attr('height', `${text_item_height}px`)
  //.style('transition', 'transform .8s ease 0s, opacity .5s ease 0s')

  var text_bottom = text_item2
    .append('text')
    //.style('transform-origin', '20px 0px')
    //.style('transform',`translate(100,${start_dot_originalY})`)
    .attr('class', 'text-item-bottom')
    .attr('id', (d, i) => {
      return `text-item-bottom-${i}`
    })
    .attr('width', `${text_item_width}px`)
    .attr('height', `${text_item_height}px`)
  //.style('transition', 'transform .8s ease 0s, opacity .5s ease 0s') 

  var title = text_top.append("tspan")
    .text(d => d.event)
    .attr('class', 'tspan-top')
    .attr('id', 'text-title')
    .attr('x', 0)
    .attr('dy', '1em')
    .call(wrapUpper, 1, 1, text_wrap_width_title);

  var spot = text_top.append("tspan")
    .text(d => d.spot)
    .attr('class', 'tspan-top')
    .attr('id', 'text-id')
    // .attr('name', (d, i) => {
    //   return `${d.spot_id}`
    // })
    .attr('x', 0)
    .attr('dy', '-1.55em')
    .call(reposition)

  var monday = text_bottom.append("tspan")
    .attr('class', 'tspan-bottom')
    .text(d => d.mon_day.toUpperCase()) //monday = month + day
    .attr('id', 'text-date')
    .attr('x', 0)
    .attr('y', '4em')
    .attr('y', d => {
      if (screen.width <= 412) {
        return '3.5em';
      } else if (screen.width <= 375) {
        return '3.475em';
      } else {
        return '4em';
      }
    })

  // var windowWidth = d3.select('body').node().clientWidth;
  // console.log("windowsize= " + screen.width);
  var desc = text_bottom.append("tspan")
    .attr('class', 'tspan-bottom')
    .text(d => d.desc)
    .attr('id', 'text-desc')
    .attr('x', 0)
    .call(wrapBelow, 1.7, 1.2, text_wrap_width_desc)
  // .call(wrapAdjust)

  // realign text id with text description
  function reposition(text) {
    text.each(function () {
      if ($(this).prev("tspan").find("#wrap").length != 0) {
        // console.log('hello');
        $(this).attr("dy", "-3.15em");//distance between spot and event
      }
    })
  }

  //fix the up description part above the middle line in a given width
  function wrapUpper(text, dy1, dy, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineHeight = dy, //ems
        x = text.attr("x"),
        y = text.attr("y"),
        tspan = text.text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        //.attr("dy", "2em");
        .attr("dy", dy1 + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          tspan = text.text(null)
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            //.attr("dy", "2em");
            .attr("dy", dy1 - 1 + "em");

          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", lineHeight + "em")
            .text(word)
            .attr('id', 'wrap');
          $('tspan').css('dominant-baseline', 'baseline')
        } else {
          // tspan.style('dominant-baseline','hanging')
        }
      }
    });
  }

  //fix the bottom description part in a given width
  function wrapBelow(text, dy1, dy, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineHeight = dy, //ems
        x = text.attr("x"),
        y = text.attr("y"),
        tspan = text.text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        //.attr("dy", "2em");
        .attr("dy", dy1 + "em");

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
  wheel.style('transform-origin', `${wheel_radius}px ${wheel_radius}px`)
    .style('transform', `translate3d(-${wheel_radius}px, 50px,0) rotate(90deg)`);
  //dots and labels
  timeline
    //.attr('transform', `translate(0 0) rotate(0 0 462)`);
    .style('transform-origin', `0 ${start_dot_originalY}px`)
    .style('transform', `translate3d(0,0,0)`);
  //first dot
  let first_dot = d3.select('#d-0');
  first_dot
    .attr('r', 4)
    .style('transition-delay', '0.7s')
    .style('fill', 'rgb(0,0,0)');
  //first label 2018
  let first_label = d3.select('#label-0');
  first_label
    .attr('r', 4)
    .style('transition-delay', '0.7s')
    .style('opacity', .7)
    .style('font-family', 'Trade Bold');
  //first text item
  let fisrt_content_top = d3.select('#text-item-g-0');
  fisrt_content_top
    .attr('class', 'first_content1')
    .style('transform-origin', '0 0')
    .style('transform', `translate3d(20px,${text_item_height}px,0) rotate(0deg)`)
    .style('opacity', 1)

  let fisrt_content_bottom = d3.select('#text-item-g2-0');
  fisrt_content_bottom
    .attr('class', 'first_content2')
    .style('transform-origin', '0 0')
    .style('transform', `translate3d(20px,${text_item_height}px,0) rotate(0deg)`)
    .style('opacity', 1)

  //rotation
  var currentWheel = d3.select('#wheel-img');
  var currentDots = timeline.selectAll('.dot');
  var currentLabels = timeline.selectAll('.label-text')

  var index = 0;
  var sumAngle = 0
  var wheel_sumAngle = 90;
  let old_url = window.location.pathname + "?city=" + switch_to_city;
  // console.log(old_url);

  // QR codes
  const dealWithHashChange = () => {
    window.location.reload();
  }
  window.addEventListener('hashchange', dealWithHashChange, true);
  window.onbeforeunload = function(){
    window.removeEventListener('hashchange',dealWithHashChange, true);
  }
  console.log(window.location.pathname);

  function rotation_def(index, up_down, data) {

    let rotationAngle = 0;
    let wheelAngle = 0;

    // rotate to next dot
    if (up_down == 'up') {
      //clear onboarding delay
      //first_label.style('transition-delay', '0s');
      //first_dot.style('transition-delay', '0s');

      rotationAngle = 0 - degrees[index]; //counter-clockwise
      wheelAngle = 0 - 18; //counter-clockwise

      // switch text items
      let last_word_text_top = d3.select('#text-item-g-' + (index - 1));
      let last_word_text_bottom = d3.select('#text-item-g2-' + (index - 1));
      let current_word_text_top = d3.select('#text-item-g-' + index);
      let current_word_text_bottom = d3.select('#text-item-g2-' + index);
      // console.log('now', (index - 1))
      // console.log('down', index);

      //rotate out
      last_word_text_top
        .style('transform-origin', '0px 0px')
        .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(-180deg)`)
        .style('opacity', 0)
      last_word_text_bottom
        .style('transform-origin', '0px 0px')
        .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(-180deg)`)
        .style('opacity', 0)
      //rotate in
      current_word_text_top
        .style('transform-origin', '0px 0px')
        .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(0deg)`)
        .style('opacity', 1)
      current_word_text_bottom
        .style('transform-origin', '0px 0px')
        .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(0deg)`)
        .style('opacity', 1)

      // two consecutive dots have the same year
      if ((index + 1) < degrees.length) {
        // index: 0—(length-2)
        if (data[index].year === data[index + 1].year) {
          //other dots keep original color and size
          for (i = 0; i < degrees.length && i !== index; i++) {
            d3.select('#d-' + i)
              .attr('r', dot_radius)
              .style('transition-delay', '0.7s')
              .style('fill', 'rgb(255,255,255)');
          }
          // current dot is black
          d3.select('#d-' + index)
            .attr('r', 4)
            .style('fill', 'rgb(0,0,0)');
        } else {
          //other dots keep original color and size
          currentDots.style('fill', 'rgb(255,255,255)')
            .attr('r', dot_radius)
            .style('transition-delay', 'none');
          //current dot is black
          d3.select('#d-' + index)
            .attr('r', 4)
            .style('fill', 'rgb(0,0,0)');
        }
        // index: length-1
      } else if ((index + 1) == degrees.length) {
        //other dots keep original color and size
        currentDots.style('fill', 'rgb(255,255,255)')
          .attr('r', dot_radius)
          .style('transition-delay', 'none');
        //current dot is black
        d3.select('#d-' + index)
          .attr('r', 4)
          .style('fill', 'rgb(0,0,0)');
      }

      //change URL path?
      let new_url = old_url + `#/${data[index].spot_id}`;
      window.history.pushState({}, 0, new_url);
    }

    // rotate to previous dot
    if (up_down == 'down') {
      //clear onboarding delay
      // first_label.style('transition-delay', '0s');
      // first_dot.style('transition-delay', '0s');

      rotationAngle = degrees[index + 1];
      wheelAngle = 18;

      //switch text items
      let last_word_text_top = d3.select('#text-item-g-' + (index + 1))
      let last_word_text_bottom = d3.select('#text-item-g2-' + (index + 1))
      let current_word_text_top = d3.select('#text-item-g-' + (index))
      let current_word_text_bottom = d3.select('#text-item-g2-' + (index))
      // console.log('now', (index + 1))
      // console.log('up', (index));

      //rotate out
      last_word_text_top
        .style('transform-origin', '0px 0px')
        .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(180deg)`)
        .style('opacity', 0)
      last_word_text_bottom
        .style('transform-origin', '0px 0px')
        .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(180deg)`)
        .style('opacity', 0)
      //rotate in
      current_word_text_top
        .style('transform-origin', '0px 0px')
        .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(0deg)`)
        .style('opacity', 1)
      current_word_text_bottom
        .style('transform-origin', '0px 0px')
        .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(0deg)`)
        .style('opacity', 1)

      // two consecutive dots have the same year
      if (data[index].year === data[index + 1].year) {
        //other dots keep original color and size
        for (i = 0; i < degrees.length && i !== index; i++) {
          d3.select('#d-' + i)
            .attr('r', dot_radius)
            .style('transition-delay', 'none')
            .style('fill', 'rgb(255,255,255)');
        }
        //current dot is black
        d3.select('#d-' + index)
          .attr('r', 4)
          .style('fill', 'rgb(0,0,0)');
        d3.select('#d-' + (index + 1))
          .attr('r', dot_radius)
          .style('fill', 'rgb(255,255,255)');
      } else {
        //other dots keep original color and size
        currentDots.style('fill', 'rgb(255,255,255)')
          .attr('r', dot_radius)
          .style('transition-delay', 'none');
        //current dot is black
        d3.select('#d-' + index)
          .attr('r', 4)
          .style('fill', 'rgb(0,0,0)');
      }

      //change URL path?
      let new_url = old_url + `#/${data[index].spot_id}`;
      window.history.pushState({}, 0, new_url);
      // console.log(new_url);
      // console.log(data[index].spot_id);
    }

    currentLabels.style('opacity', 0.3)
      .style('font-family', 'Trade')
      .style('transition-delay', 'none');
    //current label is bold
    d3.select('#label-' + index)
      .style('opacity', .8)
      .style('font-family', 'Trade Bold');

    wheel_sumAngle += wheelAngle;
    sumAngle += rotationAngle;

    timeline.style('transform-origin', `0px ${start_dot_originalY}px`)
      .style('transform', `translate3d(0,0,0) rotate(${sumAngle}deg)`);
    currentWheel
      .style('transform-origin', `${wheel_radius}px ${wheel_radius}px`)
      .style('transform', `translate3d(-${wheel_radius}px, 50px,0) rotate(${wheel_sumAngle}deg)`);

    cityID = dataArray[index].id;
    // console.log("dataArray[index]:", dataArray[index]);
  }

  var cityID = 1;
  // console.log("cityid:", cityID);

  // get modal data
  // More button
  $('#btn_more').on('click', function () {
    // $('#exampleModal1').modal({show:true});
    $.ajax({
      type: "GET",
      url: `data/${switch_to_city}/data.json`,
      dataType: 'json',
      success: function (response) {
        $.each(response, function (i, e) {
          if (e.id == cityID) {
            // console.log(e.event);
            // console.log('cityID='+ cityID);
            // console.log(e.id+"+"+e.note);

            $("#exampleModal1").find('#more-main').html(e.more_text);
            
            // Durham-clickable text
            const obj1 = document.getElementById("more_desc_extra_durham");
            if (switch_to_city !== "Durham") {
              //obj1.remove();
              obj1.style.display = 'none';
            }
            
            //Arlington-clickable text
            if (switch_to_city === "Arlington") {
              $('#more-main').append(`
                <a href="${e.link}" target="_blank">${e.link}</a>
                <span>${e.more_text2}</span>`);
            }
            
            //notes
            if (!e.note) {
              $("hr").css("visibility", "hidden");
            } else {
              $("hr").css("visibility", "visible");
            }
            $("#exampleModal1").find('#notes').html(e.note);
            
            // display URL in notes
            $('#notes').html($('#notes').html().replace(/((http:|https:)[^\s]+[\w])/g, '<a href="$1" target="_blank">$1</a>'));
 
          }
        })
      }
    })
  })

  // get modal data
  // About button
  $(document).ready(function () {
    $('#btn_about').on('click', function () {
      $.ajax({
        type: "GET",
        url: `data/${switch_to_city}/about.json`,
        dataType: 'json',
        success: function (response) {
          $.each(response, function (i, e) {
            // console.log(e.head);
            // page title
            $("#exampleModal2").find('#about-head').text(e.head);
            // 1st paragraph
            $("#exampleModal2").find('#about-body-1').text(e.body1);
            //Durham-clickable text
            if ((switch_to_city === "Durham") || (switch_to_city === "Essex")) {
              $('#about-body-1').append(`<a href="${e.link}" target="_blank">plans to mitigate and adapt to the effects of climate change.</a>`);
            }
            //Trustees-clickable text
            if (switch_to_city === "Trustees") {
              $('#about-body-1').append(`<a href="${e.link}" target="_blank">The Trustees has responded</a> <span>${e.body1a}</span>`);
            }
            //Salem-clickable text
            if (switch_to_city === "Salem") {
              $('#about-body-1').append(`
                <a href="${e.link1}" target="_blank">City of Salem,</a> 
                <a href="${e.link2}" target="_blank">Salem Maritime NHS,</a>
                <span>${e.body1a}</span>
                <a href="${e.link3}" target="_blank">Salem State University</a>
                <span>${e.body1b}</span>
              `);
            }
            //Saugus-clickable text
            if (switch_to_city === "Saugus") {
              $('#about-body-1').append(`<a href="${e.link}" target="_blank">Saugus Iron Works NHS</a> <span>${e.body1a}</span>`);
            }
            //Arlington-clickable text
            if (switch_to_city === "Arlington") {
              $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">Town of Arlington</a> 
                <span>${e.body1a}</span>
                <a href="${e.link1a}" target="_blank">Arlington Commission for Arts & Culture</a> 
                <span>${e.body1b}</span>
                `);
            }
            //Lynn-clickable text
            if (switch_to_city === "Lynn") {
              $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">City of Lynn</a> 
                <span>${e.body1a}</span>
                `);
            }
            //Ipswich-clickable text
            if (switch_to_city === "Ipswich") {
              $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">Town of Ipswich</a> 
                <span>${e.body1a}</span>
                `);
            }

            //Sailsbury-clickable text
            if (switch_to_city === "Salisbury") {
              $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">Town of Salisbury</a> 
                <span>${e.body1a}</span>
                `);
            }

            //Sailsbury-clickable text
            if (switch_to_city === "Beverly") {
              $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">City of Beverly</a>
                <span>${e.body1a}</span>
            `);
            }
            

            // 2nd paragraph
            $("#exampleModal2").find('#about-body-2').text(e.body2);
            //Newburyport-clickable text
            if (switch_to_city === "Newburyport") {
              $('#about-body-2').append(`<a href="${e.link}" target="_blank">planned projects to deal with them.</a> <span>${e.body2a}</span>`);
              //$('#about-body-2').append().text(e.body2a);
            } 
            //Rockport-clickable text
            else if (switch_to_city === "Rockport") {
              $('#about-body-2').append(`<a href="${e.link}" target="_blank">planned projects to deal with them.</a> <span>${e.body2a}</span>`);
            }
            //text below the separated line
            $("#exampleModal2").find('#about-body-3').text(e.body3);
            if (switch_to_city === "Arlington" ) {
              $('#about-body-3').append(`
                <a href="${e.link3a}" target="_blank">twelve Arlington High School interns</a> 
                <span>${e.body3a}</span>
                <a href="${e.link3b}" target="_blank">Remembrance of Climate Futures</a> 
                <span>${e.body3b}</span>
                `);
            }else{
              $('#about-body-3').append(`<a href="${e.link3a}" target="_blank">Remembrance of Climate Futures,</a> <span>${e.body3a}</span>`);
            }
            
            
            //customize for the Trustees 
            // if (switch_to_city === "Trustees") {
            //   $('#separating-line').attr("style", "visibility: hidden");
            //   $('#about-body-4').attr("style", "visibility: hidden");
            // }
          })
        }
      })
    })
  })

  // enable keydown-scroll
  document.addEventListener("keydown", function (event) {
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

  function keyUp() {
    if (index - 1 >= 0) {
      index--;
      rotation_def(index, 'down', dataArray);
    }
  }

  function keyDown() {
    if (index + 1 < degrees.length) {
      index++;
      rotation_def(index, 'up', dataArray);
    }
  }

  // fire scrolling
  function move(delta) {
    if (delta > 0) {
      if (index - 1 >= 0) {
        index--;
        rotation_def(index, 'down', dataArray);

      }
    } else if (delta < 0) {
      if (index + 1 < degrees.length) {
        index++;
        rotation_def(index, 'up', dataArray);
        // console.log(index);
      }
    }
  }

  // fire scrolling by url hash
  $(document).ready(function () {
    var hashTag = location.hash.replace('#/', '');
    dataArray.forEach(function (item) {
      if (item.spot_id == hashTag) {
        index = item.id - 1;
        // console.log("hashTag:" + hashTag);
        // console.log("index:" + index);
        // console.log("degree:" + degrees);
      }
    });
    for (var i = 0; i < index; i++) {
      rotation_def(i + 1, "up", dataArray);
    }
    // index--;
  });

  var num_m = 0;

  var scrollFunc = function (e) {
    if (topRight) return;

    e = e || window.event;
    var delta = 0;

    if (!event) {
      event = window.event;
    }
    if (event.wheelDelta) {
      delta = event.wheelDelta / 10000;
      if (window.opera) {
        delta = -delta;
      }
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

  // control scrolling/tracking speed
  function throttle(fn, wait) {
    var time = Date.now();
    return function () {
      if (time + wait - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    }
  }

  if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', throttle(scrollFunc, 475), false);
  }
  window.onmousewheel = document.onmousewheel = throttle(scrollFunc, 475);

  //disable scroll after clicking the button
  $('#exampleModal1').on('shown.bs.modal', function () {
    topRight = true;
  })
  $('#exampleModal2').on('shown.bs.modal', function () {
    topRight = true;
  })
  $('#exampleModal1').on('hidden.bs.modal', function () {
    topRight = false;
  })
  $('#exampleModal2').on('hidden.bs.modal', function () {
    topRight = false;
  })

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
  bindTouch('#scroll', _.debounce(function (type) {
    if (type === 'up' || type === 'left') {
      keyDown();
    } else {
      keyUp();
    }
  }, 100))

})