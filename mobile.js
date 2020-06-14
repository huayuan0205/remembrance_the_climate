function bindTouch(el, callBack) {

  var slider = $(el);

  $('body').on('touchstart', el, function (e) {
    var touch = e.originalEvent,
    startX = touch.changedTouches[0].pageX;
    startY = touch.changedTouches[0].pageY;

    slider.on('touchmove', function (e) {
      e.preventDefault();
      touch = e.originalEvent.touches[0] ||
        e.originalEvent.changedTouches[0];

      // if (touch.pageX - startX > 10) {
      //   console.log("scroll right");
      //   slider.off('touchmove');
      //   return callBack('right')
      // } else if (touch.pageX - startX < -10) {
      //   console.log("scroll left");
      //   slider.off('touchmove');
      //   return callBack('left')
      // };
      if (touch.pageY - startY > 10) {
        console.log("scroll down");
        return callBack('dowm')
      } else if (touch.pageY - startY < -10) {
        console.log("scroll up");
        return callBack('up')
      };
    });
    return false;

  }).on('touchend', function () {
    slider.off('touchmove');
  });
}

// detect current device
if (navigator.userAgent.match(/IEMobile|BlackBerry|Android|iPod|iPhone|iPad/i)) {
  $('body').addClass('mobile');
  window.$isMobile = true;
}