function ModalNav({ cities }: { cities: string[] }) {
    return (
        <div>
            <button>MORE</button>

            <button>ABOUT</button>

            <button className="btn btn-secondary dropdown-toggle" id="btn_switch" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                LOCALITY
            </button>

            <div className="dropdown-menu" aria-labelledby="btn_switch">
                {
                    <ul>
                        {
                            cities.map((c) => (
                                <li>
                                    <a href={`/${c}`}>{ c }</a>
                                </li>
                            ))}
                    </ul>
                }
            </div>
        </div>
    )
}

export default ModalNav;