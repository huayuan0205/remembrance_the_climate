function AboutModal() {
    return (
        <div className="modal fade" id="exampleModal2"
             role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable" id="dialog2">
                <div className="modal-content" id="content2">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <img src="img/wheel-blur.png" className="modal-img" alt="" id="backgear" />
                                <div className="col"></div>
                                <div className="col-8">
                                    <p id='about-head' className="about-head"></p>
                                    <p id='about-body-1' className="about-body"></p>
                                    <p id='about-body-2' className="about-body"></p>
                                    <br />
                                        <hr id="separating-line"/>
                                            <p id='about-body-3' className="about-body">
                                                <p id='about-body-4' className="about-body-right"><a
                                                    href="https://camd.northeastern.edu/research-scholarship-creative-practice/co-laboratory-for-data-impact/"
                                                    target="_blank">— Co-Lab for Data Impact</a></p>
                                            </p>
                                </div>
                                <div className="col"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutModal;