(function(window, videojs) {
  'use strict';

  var plugin = function(options) {
    var player = this;
    var prefix = (options.localStorageKey ? localStorage['videojs.remember.prefix'] : sessionStorage['videojs.remember.prefix']) || '';

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
        localStorage[prefix + options.localStorageKey] = time;
      }

      if (options.sessionStorageKey) {
        sessionStorage[prefix + options.sessionStorageKey] = time;
      }
    }

    player.ready(function() {
      if (!player.initialSeek) {
        if (options.localStorageKey) {
          player.initialSeek = parseInt(localStorage[prefix + options.localStorageKey]);
        }

        if (options.sessionStorageKey) {
          player.initialSeek = parseInt(sessionStorage[prefix + options.sessionStorageKey]);
        }

        player.one('playing', function() {
          player.currentTime(player.initialSeek);
        });
      }
    });
  };

  // register the plugin
  videojs.plugin('remember', plugin);
})(window, window.videojs);
