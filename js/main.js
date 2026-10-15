import { readContract } from "./contract.js";
import { createAudioEngine } from "./audio-engine.js";
import { bindKeyboard } from "./input.js";
import { createRecorder } from "./recorder.js";

const contract = readContract();
const engine = createAudioEngine();
const recorder = createRecorder();

engine.preload([...contract.values()].map((pad) => pad.sound));

function trigger(code) {
  const pad = contract.get(code);
  if (!pad) return;
  engine.play(pad.sound);
  pad.el.classList.add("playing");
  setTimeout(() => pad.el.classList.remove("playing"), 100);
}

bindKeyboard({
  isBound: (code) => contract.has(code),
  onHit: (code) => {
    trigger(code);
    recorder.capture(code);
  },
});

const rec = document.getElementById("rec");
const stop = document.getElementById("stop");
const play = document.getElementById("play");
const status = document.getElementById("status");

rec.onclick = () => {
  recorder.start();
  rec.disabled = true;
  stop.disabled = false;
  play.disabled = true;
  status.textContent = "Recording...";
};

stop.onclick = () => {
  recorder.stop();
  rec.disabled = false;
  stop.disabled = true;
  play.disabled = recorder.length === 0;
  status.textContent = "Saved " + recorder.length + " hits";
};

play.onclick = () => {
  play.disabled = true;
  rec.disabled = true;
  status.textContent = "Playing...";
  recorder.play(trigger, () => {
    play.disabled = false;
    rec.disabled = false;
    status.textContent = "Idle";
  });
};
