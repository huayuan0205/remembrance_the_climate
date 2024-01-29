import {useState} from 'react';
import {Button, Dropdown, Nav, Navbar} from 'react-bootstrap';
import MoreModal from "./MoreModal.tsx";
import AboutModal from "./AboutModal.tsx";

function ModalNav({cities}: { cities: string[] }) {
    const [showMore, setShowMore] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const handleMoreModal = () => setShowMore(true);
    const closeMoreModal = () => setShowMore(false);
    const handleAboutModal = () => setShowAbout(true);
    const closeAboutModal = () => setShowAbout(false);

    return (
        <>
            <Navbar fixed="top">
                <Navbar.Toggle />
                <Nav>
                    <Nav.Item>
                        <Button variant="light" onClick={handleMoreModal}>
                            MORE
                        </Button>
                    </Nav.Item>

                    <Nav.Item>
                        <Button variant="light" onClick={handleAboutModal}>
                            ABOUT
                        </Button>
                    </Nav.Item>

                    <Nav.Item>
                        <Dropdown>
                            <Dropdown.Toggle variant="light">
                                LOCALITY
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {
                                    cities.map((c, i) => (
                                        <Dropdown.Item href={`/${c}`} key={i}>
                                            {c}
                                        </Dropdown.Item>
                                    ))
                                }
                            </Dropdown.Menu>
                        </Dropdown>

                    </Nav.Item>
                </Nav>
            </Navbar>

            <MoreModal showModal={showMore} closeModal={closeMoreModal}/>
            <AboutModal showModal={showAbout} closeModal={closeAboutModal}/>

        </>
    )
}

export default ModalNav;