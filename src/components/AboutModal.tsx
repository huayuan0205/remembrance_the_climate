import {Modal} from "react-bootstrap";

function AboutModal({showModal, closeModal}: { showModal: boolean, closeModal: () => void }) {
    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <p id='about-head' className="about-head"></p>
                <p id='about-body-1' className="about-body"></p>
                <p id='about-body-2' className="about-body"></p>
                <br/>
                <hr id="separating-line"/>
                <p id='about-body-3' className="about-body"></p>
                <p id='about-body-4' className="about-body-right">
                    <a
                    href="https://camd.northeastern.edu/research-scholarship-creative-practice/co-laboratory-for-data-impact/"
                    target="_blank">— Co-Lab for Data Impact</a>
                </p>
            </Modal.Body>
        </Modal>
)
}

export default AboutModal;