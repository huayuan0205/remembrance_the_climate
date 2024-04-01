import * as d3 from "d3";
import {useEffect, useState} from "react";

type dataEntry = {
    id: number,
    date: String,
    subdomain: String,
    spotId: number,
    event: String,
    link: String,
    desc: String,
    moreText: String,
}

// SPOT key ? how is this ordered

function Timeline({ city }: { city: String }) {
    const [data, setData] = useState([]);
    const [ degrees, setDegrees ] = useState([])

    const width: number = 1140;
    const height: number = 1351

    // Load the data file into the component
    useEffect(() => {
        d3.json(`/data/${city}/data.json`).then((d: any) => {
            // Sort function ensures data is sorted earliest to latest by year
            setData(d.sort((a: any, b: any) => a.year - b.year))
        })
    }, []);


    // Variables for counting rotating degrees

    // I want to get the "year" key from the first index, but the code cannot fnd the key "year"
    const startYear: number = data[0].year;
    // const amtYears: number = data[data.length - 1].year - startYear
    // const avgDegree: number = 270 / amtYears;


    // for (let i: number = 0; i < data.length; i++) {
    //     setDegrees(degrees.push(avgDegree * (data[i].year - data[i - 1].year)))
    // }

    /**
     * Calculates the x-axis coordinate of the center of the circle
     * @param dot
     * @param index
     */
    function calcCx(dot: any, index: number) {
        // Retrieves the entry before the current entry
        const prevEntry = data[index - 1]

    }


    return (
        <>
                <div className='canvas'>
                    <svg width={width} height={height}>
                        <g className="g-wheel">
                            <image className="wheel-img" id="wheel-img" xlinkHref="/img/wheel-dark.png"/>
                        </g>

                        <g id="timeline">
                            {
                                data.map((dot,  i) => (
                                    <circle className="dot"
                                            key={i}
                                            id={`d-${i}`}
                                            cx={calcCx(dot, i)}
                                    />
                                ))
                            }
                        </g>
                    </svg>
                </div>
        </>
    )
}
export default Timeline;