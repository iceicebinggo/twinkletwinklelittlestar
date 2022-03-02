const ctx = new (window.AudioContext || window.webkitAudioContext)()

const fft = new AnalyserNode(ctx, { fftSize: 2048})
//source nodes
// const tone = ctx.createOscillator() // factory method
// tone.type = 'sine' //triangle. square, sawtooth shapes
// tone.frequency.value = 440  //A4 default value pitch hz
// better implemented in bad browsers


const tone = new OscillatorNode (ctx, { // constructor method
  type: 'sine',
  frequency: 440
})
// can create more complicated work


// processor nodes

const lvl = new GainNode (ctx, {
  gain: 0.5 // scale volume down by half

})

// setValueAtTime
// linearRampToValueAtTime - fade out sound
// exponentialRampToValueAtTime

lvl.gain.setValueAtTime (1, ctx.cuurentTime +1)
lvl.gain.linearRampToValueAtTime(0.1, ctx.currentTime +2)


tone.connect(lvl) //connection from oscillator to gain
lvl.connect(ctx.destination) //output
lvl.connect(fft)

tone.start(ctx.currentTime + 3)

tone.stop(ctx.currentTime + 4)


createWaveCanvas({ element: 'section', analyser: fft })

//analyzer node
