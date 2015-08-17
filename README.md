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

## Documentation
### Plugin Options

#### localStorageKey
Desc: The key name to read and write the current time of the current video in local storage.
Type: `string`

#### sessionStorageKey
Desc: The key name to read and write the current time of the current video in session storage.
Type: `string`

## Release History

 - 0.1.0: Initial release
