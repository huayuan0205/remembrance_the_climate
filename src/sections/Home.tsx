import { useEffect } from "react";
function Home() {
    const cities = [
        'Arlington',
        'Durham',
        'Essex',
        'Ipswich',
        'Lynn',
        'Newburyport',
        'Rockport',
        'Salem',
        'Sailsbury',
        'Saugus',
        'Trustees'
    ]
    return (
        <>
            <div>
                <ul>
                    {
                        cities.map((c) => (
                            <li>
                                <a href={`/${c}`}>{ c }</a>
                            </li>
                        ))}
                </ul>
            </div>
        </>
    )
}

export default Home