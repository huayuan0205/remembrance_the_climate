import * as d3 from "d3";
import { useEffect, useState } from "react";
function Timeline() {
    // THE RESULTING ARRAY
    const [dataArray, setDataArray] = useState([]);


    // SET WIDTH AND HEIGHT OF CANVAS
    const W = d3.select('.canvas').node().clientWidth;
    const H = d3.select('.canvas').node().clientHeight;

    // Margins of canvas
    const m = {
        t: 50,
        r: 50,
        b: 50,
        l: 50
    };

    // Width and height variables
    const w = W - m.r - m.l;
    const h = H - m.t - m.b;

    /**
     * Converts an angle from degrees to radians
     * @param angle
     */
    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    const switch_to_city = getQueryVariable("city");
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return null;
    }

    // RENDERING WHEEL
    const wheel_radius = 480;
    const dot_radius = 2;
    const start_dot_originalX = wheel_radius + 13; //493
    const start_dot_originalY = wheel_radius + 50; //530

    // TEXTBOX VARIABLES ON WHEEL
    const text_item_width = 400;
    let text_wrap_width_title = 375;
    let text_wrap_width_desc = 390;
    let text_item_height = 459;

    // consitionals based on screen size
    if (screen.width <= 375) {
        text_item_height = 444.5;
        text_wrap_width_title = 255;
        text_wrap_width_desc = 340;
    } else if (screen.width <= 505) {
        text_item_height = 438.5;
        text_wrap_width_title = 255;
        text_wrap_width_desc = 340;
    }

    const avg_degree = 270 / count_year;
    const rotating_degrees = [];
    const degrees = [0];
    const year_sub = [0];

    //calculate rotating degrees
    const startYear = dataArray[0].year;

    for (let i = 1; i < dataArray.length; i++) {
        const interval_year = dataArray[i].year - startYear;
        const new_element = d3.format(".1f")(avg_degree * interval_year);
        rotating_degrees.push(new_element);
        degrees.push(avg_degree * (dataArray[i].year - dataArray[i - 1].year));
        year_sub.push(dataArray[i].year - dataArray[i - 1].year);
    }

    let index = 0;
    let sumAngle = 0
    let wheel_sumAngle = 90;
    let old_url = window.location.pathname + "?city=" + switch_to_city;


    // Use d3 JSON function to set the dataArray to corresponding JSON data for city.
    useEffect(() => {
        d3.json(`../data/${switch_to_city}/data.json`).then((json) => {
            console.log(json);

            for (const key in json) {
                const entry = json[key]
                dataArray.push(entry)
            }

            setDataArray(json)
        }).catch((error: any) => {
            console.log(error);
        });
    })

    const transTime = {
        normal: ' 700ms ease 0s',
        slow: ' 1.5s ease 0s'
    }

    // MAIN TRANSITION TIME
    var transitionTimeFaster = ' 500ms ease 0s';
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
                console.log('hello');
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

    // QR codes
    const dealWithHashChange = () => {
        window.location.reload();
    }
    window.addEventListener('hashchange', dealWithHashChange, true);
    window.onbeforeunload = function(){
        window.removeEventListener('hashchange',dealWithHashChange, true);
    }
    // console.log(window.location.pathname);

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
            console.log('now', (index - 1))
            console.log('down', index);

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
            window.history.pushState({}, new_url);
            console.log(new_url);
            //console.log(data[index].spot_id);
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
            console.log('now', (index + 1))
            console.log('up', (index));

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
            window.history.pushState({}, new_url);
            console.log(new_url);
            //console.log(data[index].spot_id);
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
    console.log("cityid:", cityID);

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
                        console.log(e.event);
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
                        console.log(e.head);
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
                console.log("hashTag:" + hashTag);
                console.log("index:" + index);
                console.log("degree:" + degrees);
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

    //mobile touch
    bindTouch('#scroll', _.debounce(function (type) {
        if (type === 'up' || type === 'left') {
            keyDown();
        } else {
            keyUp();
        }
    }, 100))


    function circleCxPos(d, i) {
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
    }

    function transformLabel(d) {
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
    }

    // realign text id with text description
    function reposition(text) {
        text.each(function () {
            if ($(this).prev("tspan").find("#wrap").length != 0) {
                console.log('hello');
                $(this).attr("dy", "-3.15em");//distance between spot and event
            }
        })
    }

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



    return (
        <>
            <div className={'container'}>
                <div className={'canvas'}>
                    <svg width={w} height={h}>
                        <g className={'g-wheel'}>
                            <image className={'wheel-img'}
                                   xlink:href={'../img/wheel-dark.png'}
                            />
                        </g>
                        <g id={'timeline'}>
                            {/*add dots*/}
                            {
                                dataArray.map((item, index) => (
                                    <circle
                                        className={'dot'}
                                        id={`d-${index}`}
                                        r={dot_radius}
                                        cx={circleCxPos(item, index)}
                                    />
                                ))
                            }

                            {/*add labels*/}
                            {
                                dataArray.map((item, index) => (
                                    <g>
                                        <text className={'label-text'}
                                              id={`label-${index}`}
                                              dy={'0.35em'}
                                              transform={transformLabel(item)}
                                        >
                                            {item.year}
                                        </text>
                                    </g>
                                ))
                            }

                            {/*render text items*/}
                            {
                                dataArray.map((item, index) => (
                                    <g className={'text-item-g'}
                                       id={`text-item-g-${index}`}>
                                        <text className={'text-item-top'}
                                        id={`text-item-top-${index}`}
                                        width={`${text_item_width}px`}
                                        height={`${text_item_height}px`}>
                                            <tspan className={'tspan-top'}
                                                    id={'text-title'}
                                                    x={0}
                                                    dy={'1em'}>
                                                { item.event }
                                            </tspan>
                                            <tspan className={'tspan-top'}
                                                    id={'text-id'}
                                                    x={0}
                                                    dy={'-1.55em'}>
                                                {item.spot}
                                            </tspan>
                                        </text>
                                    </g>
                                ))
                            }

                            {/*render second text items, text_item_2*/}
                            {
                                dataArray.map((item, index) => (
                                    <g className={'text-item-g2'}
                                       id={`text-item-g2-${index}`}>
                                        <text className={'text-item-bottom'}
                                        id={`text-item-bottom-${index}`}
                                        width={`${text_item_width}px`}
                                        height={`${text_item_height}px`}>

                                        </text>
                                    </g>
                                ))
                            }
                        </g>
                    </svg>
                </div>
            </div>
        </>
    )
}
export default Timeline;