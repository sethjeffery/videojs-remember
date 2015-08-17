(function(window, videojs) {
  'use strict';

  var plugin = function(options) {
    var player = this;

    this.on('timeupdate', time_updated);
    this.on('ended', time_updated);

    function time_updated(time_update_event){
      var current_time = this.currentTime();
      var duration = this.duration();
      var time = Math.floor(current_time);

      if(time > duration || time_update_event.type === "ended") {
        time = 0;
      }

      if (options.localStorageKey) {
        localStorage[options.localStorageKey] = time;
        console.log(localStorage[options.localStorageKey], time);
      }

      if (options.sessionStorageKey) {
        sessionStorage[options.sessionStorageKey] = time;
      }
    }

    player.ready(function() {
      if (!player.initialSeek) {
        if (options.localStorageKey) {
          player.initialSeek = parseInt(localStorage[options.localStorageKey]);
        }

        if (options.sessionStorageKey) {
          player.initialSeek = parseInt(sessionStorage[options.sessionStorageKey]);
        }

        player.one('playing', function() {
          player.currentTime(player.initialSeek);
        });
      }
    });

    window.addEventListener("message", function(evt) {
      var seek;

      if (evt.data.slice(0, 16) == "localStorageKey:") {
        options.localStorageKey = evt.data.slice(16);
        seek = parseInt(localStorage[options.localStorageKey]);
        console.log(options.localStorageKey, seek);
      }

      if (evt.data.slice(0, 18) == "sessionStorageKey:") {
        options.sessionStorageKey = evt.data.slice(18);
        seek = parseInt(sessionStorage[options.sessionStorageKey]);
      }

      if (seek && player.initialSeek) {
        player.initialSeek = seek;
        player.currentTime(seek);
      }
    });
  };

  // register the plugin
  videojs.plugin('remember', plugin);
})(window, window.videojs);
