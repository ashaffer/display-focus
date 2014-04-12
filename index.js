var wmctrl = require('wmctrl');
var es = require('event-stream');

module.exports = function(direction) {
  wmctrl.desktops()
    .pipe(es.map(function(desktop, callback) {
      if(desktop.current)
        callback(null, desktop);
      else
        callback();
    }))
    .pipe(es.mapSync(function(currentDesktop) {
      var bbox = bboxForDirection(currentDesktop, direction);
      var wnds = [];
      wmctrl.list()
        .pipe(es.map(function(wnd, callback) {
          if(wnd.title.indexOf('unity-') !== 0)
            callback(null, wnd);
          else
            callback();
        }))
        .pipe(es.map(function(wnd, callback) {
          if(isWithin(bbox, wnd))
            callback(null, wnd);
          else
            callback();
        }))
        .pipe(es.mapSync(function(wnd) {
          wnds.push(wnd);
          return wnd;
        }))
        .on('end', function() {
          var sorted = wnds.sort(function(a, b) {
            return a.order - b.order;
          });

          console.log('sorted', sorted);
          wmctrl.activate(sorted[0].id);
        });
    }));
};

function isWithin(box, wnd) {
  return box.x <= wnd.x && box.y <= wnd.y
    && box.height >= wnd.height && box.width >= wnd.width
    && (box.x + box.width) > wnd.x && (box.y + box.height) > wnd.height;
}

function bboxForDirection(screen, direction) {
  return splitScreen(screen, 2)[direction === 'left' ? 0 : 1];
}

function splitScreen(screen, n) {
  var screens = [];
  var width = Math.floor(screen.geometry[0] / n);
  for(var x = 0; x < screen.geometry[0]; x += width) {
    screens.push({
      x: x,
      y: 0,
      width: width,
      height: screen.geometry[1]
    });
  }
  return screens;
}