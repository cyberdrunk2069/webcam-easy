export default class Webcam {
    constructor(webcamElement, facingMode = 'user', canvasElement = null, snapSoundElement = null) {
        this._webcamElement = webcamElement;
        this._webcamElement.width = this._webcamElement.width || screen.availWidth;
        this._webcamElement.height = this._webcamElement.height || screen.availHeight;
        this._facingMode = facingMode;
        this._webcamList = [];
        this._streamList = [];
        this._selectedDeviceId = '';
        this._canvasElement = canvasElement;
        this._snapSoundElement = snapSoundElement;
        this._horizontalFlipFactor = 1;

        window.addEventListener("resize", () => {
            this._webcamElement.width = screen.availWidth;
            this._webcamElement.height = screen.availHeight;
        }, false);
    }

    get facingMode() {
        return this._facingMode;
    }

    set facingMode(value) {
        this._facingMode = value;
    }

    get webcamList() {
        return this._webcamList;
    }

    get webcamCount() {
        return this._webcamList.length;
    }

    get selectedDeviceId() {
        return this._selectedDeviceId;
    }

    /* Get all video input devices info */
    getVideoInputs(mediaDevices) {
        this._webcamList = [];
        mediaDevices
            .filter(mediaDevice => mediaDevice.kind === 'videoinput')
            .forEach(mediaDevice => this._webcamList.push(mediaDevice));

        if (this._webcamList.length === 1) {
            this._facingMode = 'user';
        }
        return this._webcamList;
    }

    /* Get media constraints */
    getMediaConstraints() {
        /* Try to get a media stream that takes at least 1080p pictures */
        const videoConstraints = {height: {min: 1080}};

        if (this._selectedDeviceId === '') {
            videoConstraints.facingMode = this._facingMode;
        } else {
            videoConstraints.deviceId = {exact: this._selectedDeviceId};
        }
        return {
            video: videoConstraints,
            audio: false
        };
    }

    /* Select camera based on facingMode */
    selectCamera() {
        for (let webcam of this._webcamList) {
            if ((this._facingMode === 'user' && webcam.label.toLowerCase().includes('front')) || (this._facingMode === 'environment' && webcam.label.toLowerCase().includes('back'))) {
                this._selectedDeviceId = webcam.deviceId;
                break;
            }
        }
    }

    /* Horizontally flip the current streaming camera */
    flip() {
        this._horizontalFlipFactor *= -1;
        this.calibrateWebCamElement();
    }

    calibrateWebCamElement() {
        this._webcamElement.style.transform = this._horizontalFlipFactor === -1 ? `scale(-1, 1)` : '';
    }

    /* Change Facing mode and selected camera */
    switchCamera() {
        this._facingMode = this._facingMode === 'user' ? 'environment' : 'user';
        this._webcamElement.style.transform = "";
        this.selectCamera();
    }

    /*
        1. Get permission from user
        2. Get all video input devices info
        3. Select camera based on facingMode
        4. Start stream
    */
    start(startStream = true) {
        this.stop();
        return this.info().then(_ => { //get all video input devices info
            this.selectCamera(); //select camera based on facingMode
            if (startStream) {
                return this.stream();
            } else {
                return this._selectedDeviceId;
            }
        });
    }

    /* Get all video input devices info */
    info() {
        return navigator.mediaDevices.enumerateDevices().then(devices => this.getVideoInputs(devices));
    }

    /* Start streaming webcam to video element */
    stream() {
        return navigator.mediaDevices.getUserMedia(this.getMediaConstraints()).then(stream => {
            this._streamList.push(stream);
            this._webcamElement.srcObject = stream;
            this._webcamElement.onloadedmetadata = () => {
                this.snapHeight = this._webcamElement.videoHeight;
                this.snapWidth = this._webcamElement.videoWidth;
            }
            if (this._facingMode === 'user' && !this._isStopped) this._horizontalFlipFactor = -1;
            this.calibrateWebCamElement();
            delete this._isStopped;
            this._webcamElement.play();
            return this._facingMode;
        });
    }

    /* Stop streaming webcam */
    stop() {
        this._streamList.forEach(stream => stream.getTracks().forEach(track => track.stop()));
        this._isStopped = true;
    }

    snap(format) {
        if (this._canvasElement == null) {
            this._canvasElement = document.createElement("canvas");
        }
        if (this._snapSoundElement != null) {
            this._snapSoundElement.onpause = () => this._snapSoundElement.currentTime = 0;
            this._snapSoundElement.currentTime = 0;
            this._snapSoundElement.play();
        }
        this._canvasElement.width = this.snapWidth || this._webcamElement.scrollWidth;
        this._canvasElement.height = this.snapHeight || this._webcamElement.scrollHeight;
        const context = this._canvasElement.getContext('2d');
        if (this._horizontalFlipFactor === -1) {
            context.translate(this._canvasElement.width, 0);
            context.scale(-1, 1);
        }
        context.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
        context.drawImage(this._webcamElement, 0, 0, this._canvasElement.width, this._canvasElement.height);
        return this._canvasElement.toDataURL(format || 'image/png');
    }
}
window.Webcam = Webcam;