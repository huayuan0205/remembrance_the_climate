import {Modal} from 'react-bootstrap';

function MoreModal({showModal, closeModal}: { showModal: boolean, closeModal: () => void }) {
    return (
        <>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                </Modal.Header>

                <Modal.Body>
                    <div className="more_desc">
                        <p className='about-body' id="more-main"></p>
                    </div>
                    <br/>
                    <div>
                        <a className='about-body'
                           href="https://www.ci.durham.nh.us/administration/responding-climate-change"
                           target="_blank">Learn more about how Durham is addressing climate change here.</a>
                        <br/>
                        <br/>
                        <p className='about-body' id="seacoast">#seacoastremembranceproject</p>
                        <br/>
                    </div>
                    <hr/>
                    <p id="notes">
                    </p>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default MoreModal;