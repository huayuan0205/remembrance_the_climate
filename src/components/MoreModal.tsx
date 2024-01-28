function MoreModal() {
    return (
        <div className="modal fade"
             id="exampleModal1"
             role="dialog"
             aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable" id="dialog1">
                <div className="modal-content" id="content1">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col"></div>
                            <div className="col-9">
                                <div className="more_desc">
                                    <p className='about-body' id="more-main"></p>
                                </div>
                                <br />
                                    <div id="more_desc_extra_durham">
                                        <a className='about-body'
                                           href="https://www.ci.durham.nh.us/administration/responding-climate-change"
                                           target="_blank">Learn more about how Durham is addressing climate change here.</a>
                                        <br />
                                        <br />
                                            <p className='about-body' id="seacoast">#seacoastremembranceproject</p>
                                            <br />
                                    </div>
                                    <hr />
                                    <p id="notes">
                                    </p>
                            </div>
                            <div className="col" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MoreModal;