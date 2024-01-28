import citiesDirectory from '../data/citiesDirectory.ts'
import ModalNav from "../components/ModalNav.tsx";
import "./home.scss";
function Home() {
    return (
        <>
            <section className="rtc-home">
                <p>something</p>
                <ModalNav cities={citiesDirectory} />
            </section>
        </>
    )
}

export default Home