const ctx = new (window.AudioContext || window.webkitAudioContext)()
const fft = new AnalyserNode(ctx, { fftSize: 2048})

createWaveCanvas({ element: 'section', analyser: fft })
//source nodes
// const tone = ctx.createOscillator() // factory method
// tone.type = 'sine' //triangle. square, sawtooth shapes
// tone.frequency.value = 440  //A4 default value pitch hz
// better implemented in bad browsers


// const tone = new OscillatorNode (ctx)// constructor method

// can create more complicated work


// processor nodes

// const lvl = new GainNode (ctx, {gain: 0.5 // scale volume down by half})

// const notes = [
  //440.0000, // A
  // 466.1638, //A#
  // 493.8833, //B
  // 523.2511, // C
  // 554.3653, // C#
//   587.3295, // D
//   622.2540, // D#
//   659.2551, //E
//   698.4565, // F
//   739.9888, //F#
//   783.9909, //G
//   830.6094 // G#
// ]



function adsr (opts) {
  /*
                peak
                /\   val  val
               /| \__|____|
              / |    |    |\
             /  |    |    | \
       init /a  |d   |s   |r \ init

       <----------time------------>
  */

  const param = opts.param
  const peak = opts.peak || 1
  const hold = opts.hold || 0.7
  const time = opts.time || ctx.currentTime
  const dur = opts.duration || 1
  const a = opts.attack || dur * 0.2
  const d = opts.decay || dur * 0.1
  const s = opts.sustain || dur * 0.5
  const r = opts.release || dur * 0.2



  const initVal = param.value
  param.setValueAtTime(initVal, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(hold, time+a+d)
  param.linearRampToValueAtTime(hold, time+a+d+s)
  param.linearRampToValueAtTime(initVal, time+a+d+s+r)
}

function tone (type, pitch, time, duration) {
  const t = time || ctx.currentTime
  const dur = duration || 1
// const vol = volume || 0.5
  const  osc = new OscillatorNode(ctx, {
    type: type || 'sine',
    frequency: pitch || 440})
  const lvl = new GainNode(ctx, {gain: 0.001})
  osc.connect(lvl) //connection from oscillator to gain
  lvl.connect(ctx.destination) //output
  lvl.connect(fft)
  osc.start(t)
  osc.stop(t + dur)
  adsr({ param: lvl.gain,
    peak: 0.7,
    hold: 0.5,
    time: t,
    duration: dur})
}

const major = [0, 2, 4, 5, 7, 9, 11, 12] // cdefgabc
const minor = [0, 2, 3, 5, 7, 8, 10, 12]

function step (rootFreq, steps) {
  // formula: http://pages.mtu.edu/~suits/NoteFreqCalcs.html
  let tr2 = Math.pow(2, 1/ 12) // the twelth root of 2
  let rnd = rootFreq * Math.pow(tr2, steps)
  return Math.round(rnd * 100)/ 100
}

const delayStart = 1
const tempo = 140  // bpm
const beat = 60 / tempo // seconds per beat (ie. quarter note)
const bar = beat * 5
const root = 440 // A4
const scale = major
const notes = [ 0, 4, 7, 9, 12]

function r (scale){
  return Math.floor(Math.random() * scale.length)
}

for (let b = 0; b < 5; b++) {
  const delayB = b * bar
  notes[2] = r(scale)
for (let a = 0; a < 5; a++) {
  const delayA = a * bar
    for (let i = 0; i < notes.length; i++) {
      const time = i * beat + delayStart + delayA + delayB
      const dur = beat
      const pitch = step(root, notes[i])
      tone ('sine', pitch, time, dur)
    }
  }
}





// for (let i = 0; i < 16; i++) {
//  const time = ctx.currentTime + (i/4)
//  const n = Math.floor(Math.random() * major.length)
//  const pitch = step(440, n)
//  tone('sine', pitch, time, 0.25)
//
// }




// setValueAtTime
// linearRampToValueAtTime - fade out sound
// exponentialRampToValueAtTime

//lvl.gain.setValueAtTime (1, ctx.cuurentTime +1)
//lvl.gain.linearRampToValueAtTime(0.1, ctx.currentTime +2)












//analyzer node
