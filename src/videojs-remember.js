(function(window, videojs) {
  'use strict';

  function loadJSON(str) {
	var res;
	if (!isNaN(str)) {
		// backwards compatible
		res = {'seek_pos': str};
	} else {
	    try {
			res = JSON.parse(str);
		} catch (e) {
			res = {};
		}
	}
    return res;
  }

  var plugin = function(options) {
    var player = this, isLoaded;
    if (!options) options = {};

	player.on('timeupdate', time_updated);
    player.on('ended', time_updated);
	
	if (options.playlist) {
		player.on('canplay', updateplaylist);
	}

    function time_updated(time_update_event){
      var current_time = this.currentTime();
      var duration = this.duration();
      var time = Math.floor(current_time);
	  var json;

      if(time > duration || time_update_event.type === "ended") {
        time = 0;
      }

      if (isLoaded) {
        if (options.localStorageKey) {
			json = loadJSON(localStorage[options.localStorageKey]);
			json.seek_pos = time;
			localStorage[options.localStorageKey] = JSON.stringify(json);
        }

        if (options.sessionStorageKey) {
			json = loadJSON(sessionStorage[options.sessionStorageKey]);
			json.seek_pos = time;
			sessionStorage[options.sessionStorageKey] = JSON.stringify(json);
        }
      }
    }
	
	function updateplaylist(playlist_event) {
		var json;
		var curitem = playlist_event.target.player.playlist.currentItem();
			
		if (isLoaded) {
			if (options.localStorageKey) {
				json = loadJSON(localStorage[options.localStorageKey]);
				json.playlist_index = curitem;
				localStorage[options.localStorageKey] = JSON.stringify(json);
			}

			if (options.sessionStorageKey) {
				json = loadJSON(sessionStorage[options.sessionStorageKey]);
				json.playlist_index = curitem;
				sessionStorage[options.sessionStorageKey] = JSON.stringify(json);
			}
		}
		
	}

    player.ready(function() {
      var seekFunction = function() {
        if (isLoaded) return;
        isLoaded = true;
        var json;

		if (options.localStorageKey) {
			json = loadJSON(localStorage[options.localStorageKey]);
		}
		if (options.sessionStorageKey) {
			json = loadJSON(sessionStorage[options.sessionStorageKey]);
		}

		if (options.playlist && json.playlist_index) {
			player.playlist.currentItem(json.playlist_index);
		}
		
		if (json.seek_pos) {
			player.currentTime(json.seek_pos);
		}
      };

      player.one('playing', seekFunction);
      player.one('play', seekFunction);
      player.one('loadedmetadata', seekFunction);
    });

    window.addEventListener("message", function(evt) {
      if (evt.data.slice(0, 16) == "localStorageKey:") {
        options.localStorageKey = evt.data.slice(16);
		json = loadJSON(localStorage[options.localStorageKey]);
      }

      if (evt.data.slice(0, 18) == "sessionStorageKey:") {
        options.sessionStorageKey = evt.data.slice(18);
		json = loadJSON(sessionStorage[options.sessionStorageKey]);
      }

  	  if (options.playlist && json.playlist_index) {
	    player.playlist.currentItem(json.playlist_index);
	  }	  
      if (json.seek_pos && isLoaded) {
        player.currentTime(json.seek_pos);
      }
    });
  };

  // register the plugin
  videojs.plugin('remember', plugin);
})(window, window.videojs);