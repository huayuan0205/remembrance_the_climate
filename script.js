//import csv
const dataPromise = d3.csv('./data/seacoast.csv', parseData);
// console.log("Json")
// d3.json('./data/data.json').then(function(data){
// 	console.log(data)
// })

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
console.log(`W,H:${W},${H}`);

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

//parse csv
function parseData(d) {
  // set format for time data
  var formatMonDay = d3.timeFormat("%B %d");
  var formatYear = d3.timeFormat("%Y");

  return {
    year: +formatYear(new Date(d.date)),
    monday: formatMonDay(new Date(d.date)),
    //year: +d.Year,
    city: d.spot_id,
    title: d.event,
    desc: d.description,
  }
}

// disable scrolling after clicing the button
// $('#exampleModal1').on('shown.bs.modal', function (e) {
// 	document.getElementsById("scroll").disabled = true;
// 	// document.getElementById("g-wheel").disabled = true;
// 	});

// $('#exampleModal2').on('shown.bs.modal', function (e) {
// 	document.getElementsById("scroll").disabled = true;
// 	// document.getElementById("g-wheel").disabled = true;
// 	})

var topRight = false;

//d3.json("data-sample.json").then(data=>{})
dataPromise.then(function(rows) {

  //console.log(rows);


  //data manipulation
  //get sorted data by year
  var data_by_year = rows.slice().sort((a, b) => d3.ascending(a.year, b.year));
  console.log(data_by_year);

  var wheel_radius = 412;
  var dot_radius = 2;
  var start_dot_originalX = 425;
  var start_dot_originalY = 462;

  var text_item_width = 400;
  var text_item_height = 400;
  var text_wrap_width_title = 200;
  var text_wrap_width_desc = 314;

  var startYear = data_by_year[0].year;
  var count_year = data_by_year[data_by_year.length - 1].year - startYear;

  var avg_degree = 180 / count_year;
  var rotating_degrees = [];
  var degrees = [0];
  var year_sub = [0]

  //calculate rotating degrees
  for (i = 1; i < data_by_year.length; i++) {
    var interval_year = data_by_year[i].year - startYear;
    var new_element = d3.format(".1f")(avg_degree * interval_year);
    rotating_degrees.push(new_element);
    degrees.push(avg_degree * (data_by_year[i].year - data_by_year[i - 1].year));
    year_sub.push(data_by_year[i].year - data_by_year[i - 1].year);
  }
  console.log('each rotatiion degree=' + degrees)

  //add svg
  var canvas = d3.select('.canvas')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  //add wheel image
  var wheel = canvas.append('g')
    .attr('class', 'g-wheel')
    .append('image')
    .attr('class', 'wheel-img')
    .attr('id', 'wheel-img')
    .attr('xlink:href', "./img/wheel-dark.png")
    .style('transition', 'transform 1s ease 0s')
    //safari
    .style('transform-origin', '412px 412px')
    .style('transform', `translate(-412px, 50px)`)

  //dots & labels
  //dots
  var timeline = canvas.append('g')
    .attr('id', 'timeline')
    .style('transition', 'all 1s ease 0s')
    //set start position
    .style('transform-origin', `0 ${start_dot_originalY}px`) //(0,462)
    .style('transform', `translate(0,0) rotate(-90deg)`)

  var dots = timeline.selectAll('.dot')
    .data(data_by_year)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('id', (d, i) => {
      return `d-${i}`
    })
  dots
    .attr('cx', (d, i) => {
      var prevData = dots.data()[i - 1];
      var rotate_degree = avg_degree * (d.year - startYear);
      if (i > 0) {
        if (d.year == prevData['year']) {
          return ((start_dot_originalX + 10) * Math.cos(toRadians(rotate_degree)));
        } else {
          return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));
        }
      } else {
        return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));
      }
    })
    .attr('cy', (d, i) => {
      var prevData = dots.data()[i - 1];
      var rotate_degree = avg_degree * (d.year - startYear);
      if (rotate_degree <= 90) {
        if (i > 0) {
          if (d.year == prevData['year']) {
            return (start_dot_originalX + 10) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
          } else {
            return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
          }
        } else {
          return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
        }
      } else if (rotate_degree <= 180) {
        if (i > 0) {
          if (d.year == prevData['year']) {
            return (start_dot_originalX + 10) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
          } else {
            return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
          }
        } else {
          return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
        }
      }
    })
    .attr('r', dot_radius)
    .style('transition', 'all 1s ease 0s')
    .style('fill', 'rgb(255,255,255)');

  //labels
  var labels = timeline.append('g')
    .selectAll('.label-text')
    .data(data_by_year)
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

      trans_x = (wheel_radius - 5) * Math.cos(toRadians(rotate_degree));
      if (rotate_degree <= 90) {
        trans_y = (wheel_radius - 5) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
      } else if (rotate_degree <= 180) {
        trans_y = (wheel_radius - 5) * Math.sin(toRadians(180 - rotate_degree)) + start_dot_originalY;
      }
      return `translate(${trans_x},${trans_y}) rotate(${rotate_degree})`
    })
    .style('text-anchor', 'end')
    .style('transition', 'all 1s ease 0s')
    .text((d) => {
      return d.year;
    })

  //text items
  var text_item = canvas.append('g')
    .selectAll('.text-item-g')
    .data(data_by_year)
    .enter()
    .append('g')
    .attr('class', 'text-item-g')
    .attr('id', (d, i) => {
      return `text-item-g-${i}`
    })
    .style('transition', 'transform .8s ease 0s, opacity .5s ease 0s')
    .style('transform-origin', '0px 0px')
    .style('transform', `translate(20px, 360px) rotate(90deg)`)
    .style('opacity', 0)
    .append('text')
    .attr('class', 'text-item')
    .attr('id', (d, i) => {
      return `text-item-${i}`
    })
    .attr('width', `${text_item_width}px`)
    .attr('height', `${text_item_height}px`)
    .style('transition', 'transform .8s ease 0s, opacity .5s ease 0s')

  text_item.append("tspan")
    .text(d => d.title)
    .attr('class', 'tspan-top')
    .attr('id', 'text-title')
    .attr('x', 0)
    .attr('dy', '2em')
    .call(wrapUpper, 2, 0.85, text_wrap_width_title)

  text_item.append("tspan")
    .text(d => d.city)
    .attr('class', 'tspan-top')
    .attr('id', 'text-id')
    .attr('x', 0)
    .attr('dy', '-2em')
    .call(reposition)

  text_item.append("tspan")
    .attr('class', 'tspan-bottom')
    .text(d => d.monday)
    .attr('id', 'text-date')
    .attr('x', 0)
    .attr('y', '5em')

  text_item.append("tspan")
    .attr('class', 'tspan-bottom')
    .text(d => d.desc)
    .attr('id', 'text-desc')
    .attr('x', 0)
    .call(wrapBelow, 1.7, 1.2, text_wrap_width_desc)

  // realign text id with text description
  function reposition(text) {
    text.each(function() {
      if ($(this).prev("tspan").find("#wrap").length != 0) {
        console.log('hello');
        $(this).attr("dy", "-3.5em");
      }
    })
  }

  //fix the description part above the middle line in a given width
  function wrapUpper(text, dy1, dy, width) {
    text.each(function() {
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

  //fix the description part in a given width
  function wrapBelow(text, dy1, dy, width) {
    text.each(function() {
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
  //wheel.attr('transform','translate(-412,50) rotate(90 412 412)')
  wheel.style('transform-origin', '412px 412px')
    .style('transform', `translate(-412px, 50px) rotate(90deg)`);
  //dots and labels
  timeline
    //.attr('transform', `translate(0 0) rotate(0 0 462)`);
    .style('transform-origin', '0 462px')
    .style('transform', `translate(0,0)`);
  //first dot
  let first_dot = d3.select('#d-0');
  first_dot
    .attr('r', 4)
    .style('transition-delay', '1s')
    .style('fill', 'rgb(0,0,0)');
  //first label 2018
  let first_label = d3.select('#label-0');
  first_label
    .attr('r', 4)
    .style('transition-delay', '1s')
    .style('opacity', .7)
    .style('font-family', 'Trade Bold');
  //first text item
  let fisrt_content = d3.select('#text-item-g-0');
  fisrt_content
    .style('transform-origin', '0 0')
    .style('transform', `translate(20px,360px) rotate(0deg)`)
    .style('opacity', 1)

  //rotation
  var currentWheel = d3.select('#wheel-img');
  var currentDots = timeline.selectAll('.dot');
  var currentLabels = timeline.selectAll('.label-text')

  var index = 0;
  var sumAngle = 0
  var wheel_sumAngle = 90;
  let old_url = window.location.pathname;

  function rotation_def(index, up_down, data) {

    let rotationAngle = 0;
    let wheelAngle = 0;

    // rotate to next dot
    if (up_down == 'up') {
      //clear onboarding delay
      first_label.style('transition-delay', '0s');
      first_dot.style('transition-delay', '0s');

      rotationAngle = 0 - degrees[index]; //counter-clockwise
      wheelAngle = 0 - 18; //counter-clockwise

      // switch text items
      let last_word_label = d3.select('#text-item-g-' + (index - 1));
      let current_word_label = d3.select('#text-item-g-' + index);
      console.log('now', (index - 1))
      console.log('down', index);

      last_word_label //rotate out
        .style('transform-origin', '0px 0px')
        .style('transform', `translate(20px, 360px) rotate(-180deg)`)
        .style('opacity', 0)
      current_word_label //rotate in
        .style('transform-origin', '0px 0px')
        .style('transform', `translate(20px, 360px) rotate(0deg)`)
        .style('opacity', 1)

      // two consecutive dots have the same year
      if ((index + 1) < degrees.length) {
        // index: 0—(length-2)
        if (data[index].year === data[index + 1].year) {
          //other dots keep original color and size
          for (i = 0; i < degrees.length && i !== index; i++) {
            d3.select('#d-' + i)
              .attr('r', dot_radius)
              .style('transition-delay', 'none')
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
      let new_url = old_url + '#/' + data[index].city;
      window.history.pushState({}, 0, new_url);
      //console.log(data[index].city);
    }

    // rotate to previous dot
    if (up_down == 'down') {
      //clear onboarding delay
      first_label.style('transition-delay', '0s');
      first_dot.style('transition-delay', '0s');

      rotationAngle = degrees[index + 1];
      wheelAngle = 18;

      //switch text items
      let last_word_label = d3.select('#text-item-g-' + (index + 1))
      let current_word_label = d3.select('#text-item-g-' + (index))
      console.log('now', (index + 1))
      console.log('up', (index));

      last_word_label //rotate out
        .style('transform-origin', '0px 0px')
        .style('transform', `translate(20px, 360px) rotate(180deg)`)
        .style('opacity', 0)
      current_word_label //rotate in
        .style('transform-origin', '0px 0px')
        .style('transform', `translate(20px, 360px) rotate(0deg)`)
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
          .attr('r', 4)
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
      let new_url = old_url + `#/${data[index].city}`;
      window.history.pushState({}, 0, new_url);
      //console.log(data[index].city);
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

    timeline.style('transform-origin', '0px 462px')
      .style('transform', `translate(0,0) rotate(${sumAngle}deg)`);
    currentWheel
      .style('transform-origin', '412px 412px')
      .style('transform', `translate(-412px, 50px) rotate(${wheel_sumAngle}deg)`);

    var new_title = data[index].title
    $(document).ready(function() {
      $('#btn_more').on('click', function() {
        // $('#exampleModal1').modal({show:true});
        $.ajax({
          type: "GET",
          url: "data/data.json",
          dataType: 'json',
          success: function(response) {
            $.each(response.result, function(i, event) {
              if (event.title == new_title) {
                console.log(new_title);
                // var url = "<a target='_blank' href='" + event.url + "' >" + event.url + "</a>";
                $("#exampleModal1").find('#more-main').text(event.main);
                $("#exampleModal1").find('#notes').html(event.note);
                $('#notes').html($('#notes').html().replace(/((http:|https:)[^\s]+[\w])/g, '<a href="$1" target="_blank">$1</a>'));
                if (event.note == "") {
                  $("hr").css("visibility", "hidden")
                } else {
                  $("hr").css("visibility", "visible")
                }
              }
            })
          }
        })
      })
    })

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

  function keyUp() {
    if (index - 1 >= 0) {
      index--;
      rotation_def(index, 'down', data_by_year);
    }
  }

  function keyDown() {
    if (index + 1 < degrees.length) {
      index++;
      rotation_def(index, 'up', data_by_year);
    }
  }

  //fire scrolling
  function move(delta) {
    if (delta > 0) {
      if (index - 1 >= 0) {
        index--;
        rotation_def(index, 'down', data_by_year);

      }
    } else if (delta < 0) {
      if (index + 1 < degrees.length) {
        index++;
        rotation_def(index, 'up', data_by_year);
        //console.log(index);
      }
    }
  }

  var num_m = 0;

  var scrollFunc = function(e) {
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

  function throttle(fn, wait) {
    var time = Date.now();
    return function() {
      if (time + wait - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    }
  }

  if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', throttle(scrollFunc, 200), false);
  }
  window.onmousewheel = document.onmousewheel = throttle(scrollFunc, 200);

  //disable scroll after clicking the button
  $('#exampleModal1').on('shown.bs.modal', function() {
    topRight = true;
  })

  $('#exampleModal2').on('shown.bs.modal', function() {
    topRight = true;
  })

  $('#exampleModal1').on('hidden.bs.modal', function() {
    topRight = false;
  })

  $('#exampleModal2').on('hidden.bs.modal', function() {
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
  bindTouch('#scroll', _.debounce(function(type) {
    if (type === 'up' || type === 'left') {
      keyDown();
    } else {
      keyUp();
    }
  }, 500))

})
