let stream: MediaStream;
let recorder: MediaRecorder;
let recorded: Blob[] = [];

const allow = document.getElementById("allow") as HTMLButtonElement;
const shareScreen = document.getElementById("my-screen") as HTMLVideoElement;
const showScreen = document.getElementById("show") as HTMLVideoElement;
const stopShow = document.getElementById("stop-show") as HTMLButtonElement;
const constraintWidth = document.getElementById("width") as HTMLInputElement;
const constraintHeight = document.getElementById("height") as HTMLInputElement;
const startRecording = document.getElementById(
  "start-record"
) as HTMLButtonElement;
const stopRecording = document.getElementById(
  "stop-record"
) as HTMLButtonElement;
const playRecording = document.getElementById(
  "play-record"
) as HTMLButtonElement;

const changeScreenSizes = document.getElementById(
  "change-screen-sizes"
) as HTMLButtonElement;
const recordScreen = document.querySelector(
  "#record-screen"
) as HTMLVideoElement;

allow.addEventListener("click", (_) => {
  getMediaDevices();
});

showScreen.addEventListener("click", (_) => {
  shareScreen.srcObject = stream;
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
  recorder = new MediaRecorder(stream);
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

async function getMediaDevices() {
  const constraints = {
    audio: true,
    video: true,
  };
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("user media", stream);
  } catch (error) {
    console.log("error", error);
    alert("User has denied the access!");
  }
}
