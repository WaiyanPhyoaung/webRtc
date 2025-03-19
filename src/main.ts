let stream: MediaStream;
let shareStream: MediaStream;
let recorder: MediaRecorder;
let recorded: Blob[] = [];

const allow = <HTMLButtonElement>document.getElementById("allow");
const myScreen = <HTMLVideoElement>document.getElementById("my-screen");
const showScreen = <HTMLVideoElement>document.getElementById("show");
const stopShow = <HTMLButtonElement>document.getElementById("stop-show");
const constraintWidth = <HTMLInputElement>document.getElementById("width");
const constraintHeight = <HTMLInputElement>document.getElementById("height");
const startRecording = <HTMLButtonElement>(
  document.getElementById("start-record")
);
const stopRecording = <HTMLButtonElement>document.getElementById("stop-record");
const playRecording = <HTMLButtonElement>document.getElementById("play-record");
const changeScreenSizes = <HTMLButtonElement>(
  document.getElementById("change-screen-sizes")
);
const recordScreen = <HTMLVideoElement>document.querySelector("#record-screen");
const shareScreen = <HTMLButtonElement>document.getElementById("share-screen");
const videoSrcSelect = <HTMLSelectElement>document.getElementById("video-src");
const audioSrcSelect = <HTMLSelectElement>document.getElementById("audio-src");

allow.addEventListener("click", (_) => {
  getMediaDevices();
});

showScreen.addEventListener("click", (_) => {
  myScreen.srcObject = stream;
});

stopShow.addEventListener("click", (_) => {
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
  });
});

changeScreenSizes.addEventListener("click", (_) => {
  console.log("change screen sizes");
  const videoTrack = stream.getVideoTracks()[0];
  const newConstraints = {
    width: +constraintWidth.value,
    height: +constraintHeight.value,
  };
  videoTrack.applyConstraints(newConstraints);
});

startRecording.addEventListener("click", (_) => {
  console.log("start recording");
  recorded = [];
  recorder = new MediaRecorder(stream); // can use shareStream or stream
  recorder.ondataavailable = (e) => {
    console.log("data available", e.data);
    recorded.push(e.data);
  };
  recorder.start();
});

stopRecording.addEventListener("click", (_) => {
  console.log("stop recording");
  recorder.stop();
});

playRecording.addEventListener("click", (_) => {
  console.log("play recording");
  const blob = new Blob(recorded, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  recordScreen.src = url;
  recordScreen.controls = true;
});

shareScreen.addEventListener("click", async (_) => {
  console.log("share screen");
  const options = {
    video: true,
    audio: false,
    surfaceSwithing: "include",
  };
  try {
    shareStream = await navigator.mediaDevices.getDisplayMedia(options);
  } catch (error) {
    console.log("error", error);
  }
});

async function getMediaDevices() {
  const constraints = {
    audio: true,
    video: true,
  };
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log("user media", stream);
    console.log("devices", devices);

    devices.forEach((device) => {
      if (device.kind === "audioinput") {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.textContent = device.label;
        audioSrcSelect.appendChild(option);
      }
      if (device.kind === "videoinput") {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.textContent = device.label;
        videoSrcSelect.appendChild(option);
      }
    });
  } catch (error) {
    console.log("error", error);
    alert("User has denied the access!");
  }
}
