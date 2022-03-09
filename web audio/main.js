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



function adsr (param, peak, val, time, a, d, s, r) {
  /*
                peak
                /\   val  val
               /| \__|____|
              / |    |    |\
             /  |    |    | \
       init /a  |d   |s   |r \ init

       <----------time------------>
  */
  const initVal = param.value
  param.setValueAtTime(initVal, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(val, time+a+d)
  param.linearRampToValueAtTime(val, time+a+d+s)
  param.linearRampToValueAtTime(initVal, time+a+d+s+r)
}

function tone (time, duration, volume) {

  
  const  osc = new OscillatorNode(ctx)
  const lvl = new GainNode(ctx, {gain: 0.5})
  tone.connect(lvl) //connection from oscillator to gain
  lvl.connect(ctx.destination) //output
  lvl.connect(fft)
  tone.start(ctx.currentTime)
  tone.stop(ctx.currentTime + 4)
}

const major = [0, 2, 4, 5, 7, 9, 11, 12]
const minor = [0, 2, 3, 5, 7, 8, 10, 12]

const notes = [
  440.0000, // A
  466.1638, //A#
  493.8833, //B
  523.2511, // C
  554.3653, // C#
  587.3295, // D
  622.2540, // D#
  659.2551, //E
  698.4565, // F
  739.9888, //F#
  783.9909, //G
  830.6094 // G#
]

function step (rootFreq, steps) {
  // formula: http://pages.mtu.edu/~suits/NoteFreqCalcs.html
  let tr2 = Math.pow(2, 1/ 12) // the twelth root of 2
  let rnd = rootFreq * Math.pow(tr2, steps)
  return Math.round(rnd * 100)/ 100
}





// setValueAtTime
// linearRampToValueAtTime - fade out sound
// exponentialRampToValueAtTime

//lvl.gain.setValueAtTime (1, ctx.cuurentTime +1)
//lvl.gain.linearRampToValueAtTime(0.1, ctx.currentTime +2)




for (let i = 0; i < 16; i++) {
  const time = ctx.currentTime + (i/4)
  const idx = Math.floor(Math.random() * major.length)
  const pitch = notes[idx]
  tone.frequency.setValueAtTime(pitch, time)
}







//analyzer node
