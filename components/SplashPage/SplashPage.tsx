import styles from '../../styles/components/SplashPage/SplashPage.module.css';
import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import ErrorHandler from '../ErrorHandler/ErrorHandler';



const SplashPage = ({ playVid }) => {
  const DynamicComponentWithNoSSR = dynamic(
    () => import('../AudioVisualizer/AudioVisualizer'),
    { ssr: false }
  );
  const [splash, splashState] = useState(false);
  const unsplash = ` ${splash && styles.unSplash}`;

  const songRef = useRef(null);
  const splashButton = () => {
    splashState(!splash);
    playVid(!splash);
    //ios fix attempt -- don't know how to pass audio and context value as props to AudioVisualizer
    const song = songRef.current;
    const audio = new Audio(song.src);
    let context = null;
    'webkitAudioContext' in window ?
      context = new window.webkitAudioContext
      : context = new window.AudioContext;
    let iosDevice = null;
    'webkitAudioContext' in window ? iosDevice = true : null;
    return iosDevice && context.resume() && audio.play();
  }
  return (
    <div>
      <div className={styles.splashPage + unsplash}>
        <h1 className={styles.title}>Edison Av</h1>
        <p className={styles.disclaimer}>Enter for audio, video and cookies.</p>
        <button className={styles.splashButton} onClick={() => splashButton()} >
          ENTER
          <audio preload="auto" className={styles.audio}>
            <source ref={songRef} src="/FLEXICUTIONEdisonAv.mp3" type="audio/mpeg" />
          </audio>
        </button>
        {console.log(splash)}
      </div>

      <ErrorHandler>
        {splash && <DynamicComponentWithNoSSR />}
      </ErrorHandler>

    </div>

  );
}

export default SplashPage;





// let context = null;
// 'webkitAudioContext' in window ? context = new window.webkitAudioContext : context = new window.AudioContext;
// alert("initial state: " + context.state)
// if(context.state === 'suspended') {
//   alert("CONTEXT SUPENDED: " + context.state)
//   context.resume().then(() => alert("Should be resumed: " + context.state));
// } else {alert("you're not on ios!: " + context.state)}