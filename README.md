# Video.js Remember

A plugin for video.js to remember the last place you were at when watching a video.

## Getting Started

Once you've added the plugin script to your page, you can use it with any video:

```html
<script src="video.js"></script>
<script src="videojs-remember.js"></script>
<script>
  videojs(document.querySelector('video')).remember({"localStorageKey": "videojs.remember.myvideo"});
</script>
```

If used with [videojs-playlist](https://github.com/brightcove/videojs-playlist), you can remember the playlist position using:
```html
<script src="video.js"></script>
<script src="videojs-playlist.js"></script>
<script src="videojs-remember.js"></script>
<script>
  videojs(document.querySelector('video')).remember({"localStorageKey": "videojs.remember.myvideo", "playlist": true});
</script>
```


## Documentation
### Plugin Options

#### localStorageKey
Desc: The key name to read and write the current time of the current video in local storage.
Type: `string`

#### sessionStorageKey
Desc: The key name to read and write the current time of the current video in session storage.
Type: `string`

#### playlist
Desc: Wether or not the current videojs player is handling a playlist (video videojs-playlist)
Type: `boolean`

### IFRAME postMessage

In order to support Brightcove IFRAME-embedded video, this plugin can listen for `postMessage`.

```javascript
iframe = document.querySelector('iframe#player');
iframe.contentWindow.postMessage("localStorageKey:video.js.remember.myvideo", "*");
```

## Release History

 - 0.1.1: zefie's patch for playlists
 - 0.1.0: Initial release
