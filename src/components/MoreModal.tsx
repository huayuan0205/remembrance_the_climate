function MoreModal() {
    return (
        <>
            <div class="modal fade" id="exampleModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable" id="dialog1">
                    <div class="modal-content" id="content1">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col"></div>
                                <div class="col-9">
                                    <div class="more_desc">
                                        <p class='about-body' id="more-main"></p>
                                    </div>
                                    <br>
                                        <div id="more_desc_extra_durham">
                                            <a class='about-body'
                                                href="https://www.ci.durham.nh.us/administration/responding-climate-change"
                                                target="_blank">Learn more about how Durham is addressing climate change here.</a>
                                            <br><br>
                                                <p class='about-body' id="seacoast">#seacoastremembranceproject</p>
                                                <br>
                                                </div>
                                                <hr>
                                                    <p id="notes">
                                                        <!-- deliver dynamic content -->
                                                    </p>
                                                </div>
                                                <div class="col"></div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </>
                    )
}