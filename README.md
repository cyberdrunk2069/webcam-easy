# Fork webcam-easy

I made a fork which applies the PRs of the main repo, since it was unmaintained.


## Changelist:

- Merge pr [Snap bug fix and a few enhancements](https://github.com/bensonruan/webcam-easy/pull/2)
  - Rename: `flip` method to `switchCamera`
  - Add: `flip` method which flips the screen horizontal
  - Fix: Duplicate calls to navigator.getUserMedia
  - Fix: Unnecessary async calls
- Merge pr [Removed the need for a canvas element to use the snap function](https://github.com/bensonruan/webcam-easy/pull/9)
  - Instead of throwing an error when not provided with a canvas element, creates one instead
  - Snap now takes an argument for the format of the image, defaults to `image/png`
- Merge pr [Allow to get high quality pictures](https://github.com/bensonruan/webcam-easy/pull/29)
  - Change quality of the picture was taken from the video
    html component to the one of the stream
- Bump dependencies
- Update demo to reflect changes
- Fix issues caused by typos: such as `enviroment` to `environment` and `caliberateWebCamElement()` to `calibrateWebCamElement()`

*Note all links below have not been modified*

# Webcam Easy JS



This is a javascript library for accessing webcam stream and taking photos.

You can easily add it as a module to your own app.

- Streaming webcam on desktop computer or mobile
- Switch back or front cameras on mobile
- Take pictures and be able to download.

## Live Demo
**[https://bensonruan.com/how-to-access-webcam-and-take-photo-with-javascript/](https://bensonruan.com/how-to-access-webcam-and-take-photo-with-javascript/)**

![webcam-easy-demo](https://bensonruan.com/wp-content/uploads/2020/04/webcam-easy-demo-ok.gif)

## Installation

#### Use Git Clone
``` shell
git clone https://github.com/bensonruan/webcam-easy.git
```

#### OR Use NPM
[![NPM](https://nodei.co/npm/webcam-easy.png?compact=true)](https://nodei.co/npm/webcam-easy/)
``` shell
npm install webcam-easy
```

## Usage

#### 1. Include script tag in html <head>
```html
<script type="text/javascript" src="https://unpkg.com/webcam-easy/dist/webcam-easy.min.js"></script>
```
    or Import into javascript
``` js
import Webcam from 'webcam-easy';
```


#### 2. Place elements in HTML
```html
<video id="webcam" autoplay playsinline width="640" height="480"></video>
<canvas id="canvas" class="d-none"></canvas>
<audio id="snapSound" src="audio/snap.wav" preload = "auto"></audio>
```

#### 3. Call constructor in javascript
``` js
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const snapSoundElement = document.getElementById('snapSound');
const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);
```

#### 4. Start Webcam 
``` js
webcam.start()
   .then(result =>{
      console.log("webcam started");
   })
   .catch(err => {
       console.log(err);
   });
```

#### 5. Take Photo
``` js
var picture = webcam.snap();
``` 

#### 6. Stop Webcam 
``` js
webcam.stop();
```

## Functions
- start(startStream) : start streaming webcam 
  - get permission from user
  - get all video input devices info
  - select camera based on facingMode 
  - start stream
  
  startStream is optional parameter, default value is true
      
- stop() : stop streaming webcam
  
- stream() : start streaming webcam to video element
  
- snap() : take photo from webcam
  
- flip() : change Facing mode and selected camera

## Properties

- facingMode : 'user' or 'enviroment'
- webcamList : all available camera device
- webcamCount : number of available camera device
