// This event listener ensures that the script runs only after the entire
// HTML document has been loaded and parsed.
document.addEventListener('DOMContentLoaded', function() {

    // --- ADDED SECTION START: New Locality Menu Logic ---
    // This is the new code for the full-screen locality menu.

    const localities = {
        "United States": [
            "Durham", "Essex", "Newburyport", "Rockport", "Arlington",
            "Trustees", "Salem", "Saugus", "Ipswich", "Salisbury", "Lynn", "Beverly"
        ],
        "Switzerland": ["Comano"]
    };

    // Get references to all the necessary HTML elements for the menu
    const localityButton = document.getElementById('btn_locality');
    const overlay = document.getElementById('locality-overlay');
    const closeButton = document.getElementById('close-locality-btn');
    const countryView = document.getElementById('country-view');
    const cityView = document.getElementById('city-view');
    const countryContainer = document.getElementById('country-list-container');

    // Dynamically create and add the country buttons to the menu
    if (countryContainer) {
        Object.keys(localities).forEach(countryName => {
            const button = document.createElement('button');
            button.className = 'country-btn';
            button.textContent = countryName;
            button.dataset.country = countryName; // Store country name in data attribute
            countryContainer.appendChild(button);
        });
    }

    // Function to open the overlay with a sliding animation
    function openOverlay() {
        if (overlay) overlay.classList.add('is-visible');
    }

    // Function to close the overlay
    function closeOverlay() {
        if (overlay) {
            overlay.classList.remove('is-visible');
            // Reset to the country selection screen after the closing animation finishes
            setTimeout(() => {
                if (cityView) cityView.style.display = 'none';
                if (countryView) countryView.style.display = 'block';
            }, 500); // This delay should match the CSS transition duration
        }
    }

    // Function to display the cities for a selected country
    function showCities(countryName) {
        const cities = localities[countryName];
        let cityHTML = `<h2>${countryName}</h2><div class="city-list-container">`;

        cities.forEach(city => {
            // This creates a link that reloads the page with a query parameter.
            // Example: index.html?city=Durham
            cityHTML += `<a href="?city=${encodeURIComponent(city)}" class="city-link">${city}</a>`;
        });

        cityHTML += `</div>`;

        if (cityView) cityView.innerHTML = cityHTML;

        // Switch from the country view to the city view
        if (countryView) countryView.style.display = 'none';
        if (cityView) cityView.style.display = 'block';
    }

    // Attach the event listener to the main "LOCALITY" button
    if (localityButton) localityButton.addEventListener('click', openOverlay);

    // Attach the event listener to the close button inside the menu
    if (closeButton) closeButton.addEventListener('click', closeOverlay);

    // Use event delegation to handle clicks on any of the country buttons
    if (countryContainer) {
        countryContainer.addEventListener('click', function(e) {
            // Check if a country button was clicked
            if (e.target && e.target.classList.contains('country-btn')) {
                showCities(e.target.dataset.country);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        const backBtn = document.getElementById('back-to-countries-btn');
        const countryView = document.getElementById('country-view');
        const cityView = document.getElementById('city-view');
        const closeBtn = document.getElementById('close-locality-btn');

        // 1. Handle clicking the "Back" button
        backBtn.addEventListener('click', () => {
            cityView.style.display = 'none';
            countryView.style.display = 'block';
        });

        // 2. Use a MutationObserver to show/hide the back button automatically
        // This watches for when the city list becomes visible or hidden.
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const cityViewIsVisible = cityView.style.display !== 'none';
                    backBtn.style.display = cityViewIsVisible ? 'block' : 'none';
                }
            }
        });

        // Start observing the city-view div for changes to its style attribute
        observer.observe(cityView, { attributes: true });

        // 3. Also ensure the back button is hidden when the whole menu is closed
        closeBtn.addEventListener('click', () => {
            backBtn.style.display = 'none';
        });
    });

    // --- ADDED SECTION END ---


    // --- EXISTING SCRIPT LOGIC START ---
    // Your original code for the D3 wheel visualization and modals is below.

    // get city name from URL
    var switch_to_city = getQueryVariable("city");

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
    }

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

    var topRight = false;

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    d3.json(`./data/${switch_to_city}/data.json`).then(function (json) {

        var dataArray = []; // This will be the resulting array
        for (var key in json) {
            var entry = json[key]
            dataArray.push(entry)
        }

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

        // set the transition var
        var transitionTimeNormal = ' 700ms ease 0s';
        var transitionTimeFaster = ' 500ms ease 0s';
        var transitionTimeSlower = ' 1.5s ease 0s';

        //add svg
        var svg = d3.select('.canvas')
            .append('svg')
            .attr('width', w)
            .attr('height', h)

        //add wheel image
        var wheel = svg.append('g')
            .attr('class', 'g-wheel')
            .append('image')
            .attr('class', 'wheel-img')
            .attr('id', 'wheel-img')
            .attr('xlink:href', "./img/wheel-dark.png")
            .style('transition', 'transform 1s ease 0s')
            .style('transform-origin', `${wheel_radius}px ${wheel_radius}px`)
            .style('transform', `translate3d(-${wheel_radius}px, 50px,0)`)

        // add dots and labels
        var timeline = svg.append('g')
            .attr('id', 'timeline')
            .style('transition', 'all' + transitionTimeFaster)
            .style('transform-origin', `0 ${start_dot_originalY}px`)
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
                        if (d.year == prevData['year'] && d.year == prevData2['year']) { //three dots with the same year
                            return ((start_dot_originalX + 20) * Math.cos(toRadians(rotate_degree)));
                        } else if (d.year == prevData['year']) { //two dots with the same year
                            return ((start_dot_originalX + 10) * Math.cos(toRadians(rotate_degree)));
                        } else { //others
                            return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));
                        }
                    } else if (i > 0) { //the 2nd dot
                        if (d.year == prevData['year']) { //two dots with the same year
                            return ((start_dot_originalX + 10) * Math.cos(toRadians(rotate_degree)));
                        } else {
                            return (start_dot_originalX * Math.cos(toRadians(rotate_degree)));
                        }
                    } else { //the 1st dot
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
                        if (d.year == prevData['year'] && d.year == prevData2['year']) {
                            return (start_dot_originalX + 20) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
                        } else if (d.year == prevData['year']) {
                            return (start_dot_originalX + 10) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
                        } else {
                            return start_dot_originalX * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
                        }
                    } else if (i > 0) {
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
                        if (d.year == prevData['year'] && d.year == prevData2['year']) {
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
            .attr('dy', '.35em')
            .attr('transform', (d) => {
                var trans_x, trans_y = 0;
                var rotate_degree = avg_degree * (d.year - startYear);

                if (rotate_degree <= 180) {
                    trans_x = (wheel_radius - 5) * Math.cos(toRadians(rotate_degree));
                } else if (rotate_degree <= 270) {
                    trans_x = (-1) * (wheel_radius - 5) * Math.cos(toRadians(rotate_degree - 180));
                }
                if (rotate_degree <= 180) {
                    trans_y = (wheel_radius - 5) * Math.sin(toRadians(rotate_degree)) + start_dot_originalY;
                } else if (rotate_degree <= 270) {
                    trans_y = start_dot_originalY - (wheel_radius - 5) * Math.sin(toRadians(rotate_degree - 180));
                }
                return `translate(${trans_x},${trans_y}) rotate(${rotate_degree})`
            })
            .style('text-anchor', 'end')
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
            .attr('class', 'text-item-bottom')
            .attr('id', (d, i) => {
                return `text-item-bottom-${i}`
            })
            .attr('width', `${text_item_width}px`)
            .attr('height', `${text_item_height}px`)

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

        var desc = text_bottom.append("tspan")
            .attr('class', 'tspan-bottom')
            .text(d => d.desc)
            .attr('id', 'text-desc')
            .attr('x', 0)
            .call(wrapBelow, 1.7, 1.2, text_wrap_width_desc)

        function reposition(text) {
            text.each(function () {
                if ($(this).prev("tspan").find("#wrap").length != 0) {
                    $(this).attr("dy", "-3.15em"); //distance between spot and event
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
                    .attr("dy", dy1 + "em");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        tspan = text.text(null)
                            .append("tspan")
                            .attr("x", x)
                            .attr("y", y)
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
                    }
                }
            });
        }

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
        wheel.style('transform-origin', `${wheel_radius}px ${wheel_radius}px`)
            .style('transform', `translate3d(-${wheel_radius}px, 50px,0) rotate(90deg)`);
        timeline
            .style('transform-origin', `0 ${start_dot_originalY}px`)
            .style('transform', `translate3d(0,0,0)`);
        let first_dot = d3.select('#d-0');
        first_dot
            .attr('r', 4)
            .style('transition-delay', '0.7s')
            .style('fill', 'rgb(0,0,0)');
        let first_label = d3.select('#label-0');
        first_label
            .attr('r', 4)
            .style('transition-delay', '0.7s')
            .style('opacity', .7)
            .style('font-family', 'Trade Bold');
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

        const dealWithHashChange = () => {
            window.location.reload();
        }
        window.addEventListener('hashchange', dealWithHashChange, true);
        window.onbeforeunload = function () {
            window.removeEventListener('hashchange', dealWithHashChange, true);
        }

        function rotation_def(index, up_down, data) {

            let rotationAngle = 0;
            let wheelAngle = 0;

            if (up_down == 'up') {
                rotationAngle = 0 - degrees[index];
                wheelAngle = 0 - 18;

                let last_word_text_top = d3.select('#text-item-g-' + (index - 1));
                let last_word_text_bottom = d3.select('#text-item-g2-' + (index - 1));
                let current_word_text_top = d3.select('#text-item-g-' + index);
                let current_word_text_bottom = d3.select('#text-item-g2-' + index);

                last_word_text_top
                    .style('transform-origin', '0px 0px')
                    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(-180deg)`)
                    .style('opacity', 0)
                last_word_text_bottom
                    .style('transform-origin', '0px 0px')
                    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(-180deg)`)
                    .style('opacity', 0)
                current_word_text_top
                    .style('transform-origin', '0px 0px')
                    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(0deg)`)
                    .style('opacity', 1)
                current_word_text_bottom
                    .style('transform-origin', '0px 0px')
                    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(0deg)`)
                    .style('opacity', 1)

                if ((index + 1) < degrees.length) {
                    if (data[index].year === data[index + 1].year) {
                        for (i = 0; i < degrees.length && i !== index; i++) {
                            d3.select('#d-' + i)
                                .attr('r', dot_radius)
                                .style('transition-delay', '0.7s')
                                .style('fill', 'rgb(255,255,255)');
                        }
                        d3.select('#d-' + index)
                            .attr('r', 4)
                            .style('fill', 'rgb(0,0,0)');
                    } else {
                        currentDots.style('fill', 'rgb(255,255,255)')
                            .attr('r', dot_radius)
                            .style('transition-delay', 'none');
                        d3.select('#d-' + index)
                            .attr('r', 4)
                            .style('fill', 'rgb(0,0,0)');
                    }
                } else if ((index + 1) == degrees.length) {
                    currentDots.style('fill', 'rgb(255,255,255)')
                        .attr('r', dot_radius)
                        .style('transition-delay', 'none');
                    d3.select('#d-' + index)
                        .attr('r', 4)
                        .style('fill', 'rgb(0,0,0)');
                }

                let new_url = old_url + `#/${data[index].spot_id}`;
                window.history.pushState({}, 0, new_url);
            }

            if (up_down == 'down') {
                rotationAngle = degrees[index + 1];
                wheelAngle = 18;

                let last_word_text_top = d3.select('#text-item-g-' + (index + 1))
                let last_word_text_bottom = d3.select('#text-item-g2-' + (index + 1))
                let current_word_text_top = d3.select('#text-item-g-' + (index))
                let current_word_text_bottom = d3.select('#text-item-g2-' + (index))

                last_word_text_top
                    .style('transform-origin', '0px 0px')
                    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(180deg)`)
                    .style('opacity', 0)
                last_word_text_bottom
                    .style('transform-origin', '0px 0px')
                    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(180deg)`)
                    .style('opacity', 0)
                current_word_text_top
                    .style('transform-origin', '0px 0px')
                    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(0deg)`)
                    .style('opacity', 1)
                current_word_text_bottom
                    .style('transform-origin', '0px 0px')
                    .style('transform', `translate3d(20px, ${text_item_height}px,0) rotate(0deg)`)
                    .style('opacity', 1)

                if (data[index].year === data[index + 1].year) {
                    for (i = 0; i < degrees.length && i !== index; i++) {
                        d3.select('#d-' + i)
                            .attr('r', dot_radius)
                            .style('transition-delay', 'none')
                            .style('fill', 'rgb(255,255,255)');
                    }
                    d3.select('#d-' + index)
                        .attr('r', 4)
                        .style('fill', 'rgb(0,0,0)');
                    d3.select('#d-' + (index + 1))
                        .attr('r', dot_radius)
                        .style('fill', 'rgb(255,255,255)');
                } else {
                    currentDots.style('fill', 'rgb(255,255,255)')
                        .attr('r', dot_radius)
                        .style('transition-delay', 'none');
                    d3.select('#d-' + index)
                        .attr('r', 4)
                        .style('fill', 'rgb(0,0,0)');
                }

                let new_url = old_url + `#/${data[index].spot_id}`;
                window.history.pushState({}, 0, new_url);
            }

            currentLabels.style('opacity', 0.3)
                .style('font-family', 'Trade')
                .style('transition-delay', 'none');
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
        }

        var cityID = 1;

        $('#btn_more').on('click', function () {
            $.ajax({
                type: "GET",
                url: `data/${switch_to_city}/data.json`,
                dataType: 'json',
                success: function (response) {
                    $.each(response, function (i, e) {
                        if (e.id == cityID) {
                            $("#exampleModal1").find('#more-main').html(e.more_text);
                            const obj1 = document.getElementById("more_desc_extra_durham");
                            if (switch_to_city !== "Durham") {
                                obj1.style.display = 'none';
                            }
                            if (switch_to_city === "Arlington") {
                                $('#more-main').append(`
                <a href="${e.link}" target="_blank">${e.link}</a>
                <span>${e.more_text2}</span>`);
                            }
                            if (!e.note) {
                                $("hr").css("visibility", "hidden");
                            } else {
                                $("hr").css("visibility", "visible");
                            }
                            $("#exampleModal1").find('#notes').html(e.note);
                            $('#notes').html($('#notes').html().replace(/((http:|https:)[^\s]+[\w])/g, '<a href="$1" target="_blank">$1</a>'));
                        }
                    })
                }
            })
        })

        $('#btn_about').on('click', function () {
            $.ajax({
                type: "GET",
                url: `data/${switch_to_city}/about.json`,
                dataType: 'json',
                success: function (response) {
                    $.each(response, function (i, e) {
                        $("#exampleModal2").find('#about-head').text(e.head);
                        $("#exampleModal2").find('#about-body-1').text(e.body1);
                        if ((switch_to_city === "Durham") || (switch_to_city === "Essex")) {
                            $('#about-body-1').append(`<a href="${e.link}" target="_blank">plans to mitigate and adapt to the effects of climate change.</a>`);
                        }
                        if (switch_to_city === "Trustees") {
                            $('#about-body-1').append(`<a href="${e.link}" target="_blank">The Trustees has responded</a> <span>${e.body1a}</span>`);
                        }
                        if (switch_to_city === "Salem") {
                            $('#about-body-1').append(`
                <a href="${e.link1}" target="_blank">City of Salem,</a> 
                <a href="${e.link2}" target="_blank">Salem Maritime NHS,</a>
                <span>${e.body1a}</span>
                <a href="${e.link3}" target="_blank">Salem State University</a>
                <span>${e.body1b}</span>
              `);
                        }
                        if (switch_to_city === "Saugus") {
                            $('#about-body-1').append(`<a href="${e.link}" target="_blank">Saugus Iron Works NHS</a> <span>${e.body1a}</span>`);
                        }
                        if (switch_to_city === "Arlington") {
                            $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">Town of Arlington</a> 
                <span>${e.body1a}</span>
                <a href="${e.link1a}" target="_blank">Arlington Commission for Arts & Culture</a> 
                <span>${e.body1b}</span>
                `);
                        }
                        if (switch_to_city === "Lynn") {
                            $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">City of Lynn</a> 
                <span>${e.body1a}</span>
                `);
                        }
                        if (switch_to_city === "Ipswich") {
                            $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">Town of Ipswich</a> 
                <span>${e.body1a}</span>
                `);
                        }
                        if (switch_to_city === "Salisbury") {
                            $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">Town of Salisbury</a> 
                <span>${e.body1a}</span>
                `);
                        }
                        if (switch_to_city === "Beverly") {
                            $('#about-body-1').append(`
                <a href="${e.link}" target="_blank">City of Beverly</a>
                <span>${e.body1a}</span>
            `);
                        }
                        $("#exampleModal2").find('#about-body-2').text(e.body2);
                        if (switch_to_city === "Newburyport") {
                            $('#about-body-2').append(`<a href="${e.link}" target="_blank">planned projects to deal with them.</a> <span>${e.body2a}</span>`);
                        } else if (switch_to_city === "Rockport") {
                            $('#about-body-2').append(`<a href="${e.link}" target="_blank">planned projects to deal with them.</a> <span>${e.body2a}</span>`);
                        }
                        $("#exampleModal2").find('#about-body-3').text(e.body3);
                        if (switch_to_city === "Arlington") {
                            $('#about-body-3').append(`
                <a href="${e.link3a}" target="_blank">twelve Arlington High School interns</a>
                <span>${e.body3a}</span>
                <a href="${e.link3b}" target="_blank">Remembrance of Climate Futures</a>
                <span>${e.body3b}</span>
                `);
                            $('#separating-line').show();
                            $('#about-body-4').show();
                        } else if (switch_to_city === "Comano") {
                            // For Comano, don't append Remembrance link and hide Co-Lab link
                            $('#separating-line').show();
                            $('#about-body-4').hide();
                        } else {
                            $('#about-body-3').append(`<a href="${e.link3a}" target="_blank">Remembrance of Climate Futures,</a> <span>${e.body3a}</span>`);
                            $('#separating-line').show();
                            $('#about-body-4').show();
                        }
                    })
                }
            })
        })

        document.addEventListener("keydown", function (event) {
            event.preventDefault();
            const key = event.key;
            switch (key) {
                case "ArrowUp":
                    keyUp();
                    break;
                case "ArrowDown":
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
                }
            }
        }

        $(document).ready(function () {
            var hashTag = location.hash.replace('#/', '');
            dataArray.forEach(function (item) {
                if (item.spot_id == hashTag) {
                    index = item.id - 1;
                }
            });
            for (var i = 0; i < index; i++) {
                rotation_def(i + 1, "up", dataArray);
            }
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
                if (num_m % 2 == 0) {
                    move(delta);
                }
            }
        }

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

        bindTouch('#scroll', _.debounce(function (type) {
            if (type === 'up' || type === 'left') {
                keyDown();
            } else {
                keyUp();
            }
        }, 100))
    });
    // --- EXISTING SCRIPT LOGIC END ---

}); // End of DOMContentLoaded

