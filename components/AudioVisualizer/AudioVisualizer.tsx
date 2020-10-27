// Accreditation goes to Nick Jones. His original vanilla source: https://codepen.io/nfj525/pen/rVBaab
import styles from '../../styles/components/AudioVisualizer/AudioVisualizer.module.css';
import React, { useEffect, useRef } from 'react';
//{ splash }
const AudioVisualizer = () => {
  const songRef = useRef(null),
    canvasRef = useRef(null),
    buttonRef = useRef(null),
    tempButton = useRef(null);
  const AVLogic = () => {
    const song = songRef.current,
      canvas = canvasRef.current,
      audio = new Audio(song.src),
      muteButton = buttonRef.current,
      playButton = tempButton.current;

    //mute or play on click
    const mutePlay = () => {
      context.state === 'running' ?
        context.suspend()
          .then(() => console.log("changed to : " + context.state))
        : context.resume()
          .then(() => console.log("changed to: " + context.state));
    }

    muteButton.onclick = () => mutePlay();

    let context = null;
    'webkitAudioContext' in window ?
      context = new window.webkitAudioContext
      : context = new window.AudioContext;

    //Create variable to identify if device is running iOS
    let iosDevice = null;
    'webkitAudioContext' in window ? iosDevice = true : null;
    console.log("iosDevice: " + iosDevice)

    iosDevice ? alert('Still working on iOS compatibility! Press button to run.  ' + context.state) : setTimeout(() => audio.play(), 1482)

    playButton.onclick = () => {
      iosDevice && context.resume() && audio.play();
    }

    const src = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();

    //config canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    //config audio analyzer
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount,
      dataArray = new Uint8Array(bufferLength),
      WIDTH = canvas.width,
      HEIGHT = canvas.height,
      barWidth = (WIDTH / bufferLength) * 2.5;
    let barHeight = null,
      x = 0;

    //execute audio visualization
    const renderFrame = () => {
      ctx.fillStyle = "rgba(0,0,0,0)";
      requestAnimationFrame(renderFrame);
      x = 0;
      analyser.getByteFrequencyData(dataArray);
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        let r = barHeight + (22 * (i / bufferLength));
        let g = 333 * (i / bufferLength);
        let b = 47;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1;

        setTimeout(() => {
          ctx.clearRect(0, 0, WIDTH, HEIGHT)
        }, 1);
      }
    }
    console.log("initial context state: " + context.state);
    return renderFrame();
  };


  //connect audio visualizer logic to DOM
  useEffect(() => {
    try {
      return AVLogic();
    } catch (error) {
      return console.log("Audio Visualizer error: " + error);
    }
  });
  return (
    <div>
      <button ref={tempButton} className={styles.tempButton}>
        visualize audio
      </button>
      <div className={styles.content}>
        <button className={styles.contextButton} ref={buttonRef}></button>
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
        <audio preload="auto" className={styles.audio}>
          <source src="/FLEXICUTIONEdisonAv.mp3" ref={songRef} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  )
}
export default AudioVisualizer;























    //on load resume context        
    // (splash == true) && setTimeout(() => { 
    //   context.state === 'running' ? audio.play() : context.resume();     
    //  }, 0);
    // audio.play();

    // const test = () => context.state === 'running' ? audio.play() : context.resume();

    //config audio context

// solve ios bug 

          // if(context.state === 'running') {
          //   alert("CONTEXT RUNNING: " + context.state);
          //   audio.play()
          //   .then(function() {
          //     console.log(" running and playing: " + context.state);
          //     alert(" running and playing: " + context.state);
          //   });  
        //     alert(" running and playing: " + context.state);
        //   } else if(context.state === 'suspended') {
        //     alert("CONTEXT SUPENDED: " + context.state)
        //     context.resume()
        //     .then(function() {
        //       console.log("suspended and resumed: " + context.state);
        //       audio.play()
        //       // .then(() => alert("suspended and resumed: " + context.state));
        //       alert("suspended and resumed: " + context.state);
        //     });  
        //   }

          // if(context.state === 'running') {
          //   context.suspend()
          //   .then(function() {
          //     console.log("SUSPEND: " + context.state);
          //   });  
          // } else if(context.state === 'suspended') {
          //   context.resume()
          //   .then(function() {
          //     console.log("RESUME: " + context.state);
          //   });  
          // }



        // if('webkitAudioContext' in window) {
        //   context = new window.webkitAudioContext;
        //   console.log("NEED WEBKIT");
        // } else {
        //   context = new window.AudioContext;
        //   console.log("DON'T NEED WEBKIT");
        // }