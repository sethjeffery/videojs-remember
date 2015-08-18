(function(window, videojs) {
  'use strict';

  var plugin = function(options) {
    var player = this;
    if (!options) options = {};

    player.on('timeupdate', time_updated);
    player.on('ended', time_updated);

    function time_updated(time_update_event){
      var current_time = this.currentTime();
      var duration = this.duration();
      var time = Math.floor(current_time);

      if(time > duration || time_update_event.type === "ended") {
        time = 0;
      }

      if (options.localStorageKey) {
        localStorage[options.localStorageKey] = time;
      }

      if (options.sessionStorageKey) {
        sessionStorage[options.sessionStorageKey] = time;
      }
    }

    var isLoaded, isSought;
    player.ready(function() {
      if (isLoaded) return;
      isLoaded = true;

      var seekFunction = function() {
        if (isSought) return;
        isSought = true;
        var seek;

        if (options.localStorageKey) {
          seek = parseInt(localStorage[options.localStorageKey]);
        }

        if (options.sessionStorageKey) {
          seek = parseInt(sessionStorage[options.sessionStorageKey]);
        }

        player.currentTime(seek);
      };

      player.one('playing', seekFunction);
      player.one('play', seekFunction);
      player.one('loadedmetadata', seekFunction);
    });

    window.addEventListener("message", function(evt) {
      var seek;

      if (evt.data.slice(0, 16) == "localStorageKey:") {
        options.localStorageKey = evt.data.slice(16);
        seek = parseInt(localStorage[options.localStorageKey]);
      }

      if (evt.data.slice(0, 18) == "sessionStorageKey:") {
        options.sessionStorageKey = evt.data.slice(18);
        seek = parseInt(sessionStorage[options.sessionStorageKey]);
      }

      if (seek && isLoaded) {
        player.currentTime(seek);
      }
    });
  };

  // register the plugin
  videojs.plugin('remember', plugin);
})(window, window.videojs);
