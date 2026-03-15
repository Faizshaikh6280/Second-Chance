import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { 
  X, Play, Pause, RotateCcw, Droplet, Wind, Brain, 
  ArrowRight, Heart, Gamepad2, Snowflake, Eye, Quote
} from 'lucide-react';

// --- DATA ARRAYS FOR RANDOMIZATION ---
const EMOTIONAL_VIDEOS = [
  "https://www.youtube.com/embed/I3W5EVzlQm0?autoplay=1&loop=1&playlist=I3W5EVzlQm0&controls=0",
  "https://www.youtube.com/embed/-ch4NqzdhA8?autoplay=1&loop=1&playlist=-ch4NqzdhA8&controls=0",
  "https://www.youtube.com/embed/dVHjZFU7VRg?autoplay=1&loop=1&playlist=dVHjZFU7VRg&controls=0"
];

const MOTIVATIONAL_VIDEOS = [
  "https://www.youtube.com/embed/nHS1uJeYGFM?autoplay=1&loop=1&playlist=nHS1uJeYGFM&controls=0",
  "https://www.youtube.com/embed/-m_sgiO0fHM?autoplay=1&loop=1&playlist=-m_sgiO0fHM&controls=0",
  "https://www.youtube.com/embed/gARdaMGnBjs?autoplay=1&loop=1&playlist=gARdaMGnBjs&controls=0"
];

const QUOTES = [
  "Your track record for surviving bad days is exactly 100%. Don't give up now.",
  "Every time you resist a craving, you are literally rewiring your brain.",
  "Courage doesn't always roar. Sometimes it's the quiet voice saying 'I will try again.'",
  "You are not your thoughts. You are the observer of your thoughts.",
  "Fall seven times, stand up eight. You've got this.",
  "Discipline is choosing between what you want now, and what you want most."
];

const AFFIRMATIONS = [
  "I am incredibly proud of you! 🎉",
  "You are getting stronger every single day! 💪",
  "Amazing job surfing that urge! 🌊",
  "You chose your future over a temporary feeling! ✨",
  "Victory! You are taking your life back! 🏆",
  "You did the hard thing, and you won! 🥳"
];


// --- MASCOT COMPONENT ---
const BrainMascot = ({ className = "", expression = "happy", style }) => (
  <motion.div style={style} className={`relative flex justify-center items-center ${className} animate-[bounce_3s_ease-in-out_infinite]`}>
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      <path d="M60 90C87.6142 90 110 72.0914 110 50C110 27.9086 87.6142 10 60 10C32.3858 10 10 27.9086 10 50C10 72.0914 32.3858 90 60 90Z" fill="#F9A8D4"/>
      <path d="M30 30C40 20 50 15 60 15C70 15 80 20 90 30" stroke="#F472B6" strokeWidth="6" strokeLinecap="round"/>
      <path d="M25 50C40 45 50 45 60 50C70 55 80 55 95 50" stroke="#F472B6" strokeWidth="6" strokeLinecap="round"/>
      <path d="M35 70C45 75 50 75 60 70C70 65 80 65 85 70" stroke="#F472B6" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="35" cy="55" r="8" fill="#B25349" opacity="0.4"/>
      <circle cx="85" cy="55" r="8" fill="#B25349" opacity="0.4"/>
      {expression === 'sleepy' ? (
         <>
            <path d="M40 45 Q 45 48 50 45" stroke="#403931" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M70 45 Q 75 48 80 45" stroke="#403931" strokeWidth="3" strokeLinecap="round" fill="none"/>
         </>
      ) : (
         <>
            <circle cx="45" cy="45" r="5" fill="#403931" className="animate-[pulse_4s_ease-in-out_infinite]"/>
            <circle cx="75" cy="45" r="5" fill="#403931" className="animate-[pulse_4s_ease-in-out_infinite]"/>
         </>
      )}
      {(expression === 'happy' || expression === 'cheering') && <path d="M55 55Q60 60 65 55" stroke="#403931" strokeWidth="3" strokeLinecap="round"/>}
      {expression === 'breathing' && <circle cx="60" cy="57" r="4" fill="#403931"/>}
    </svg>
    {expression === 'cheering' && (
      <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute -top-4 -right-2 text-2xl z-20">✨</motion.div>
    )}
  </motion.div>
);


export default function CopingNow({ onClose }) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  
  // Random Data States
  const [randomData, setRandomData] = useState({ emotional: "", motivational: "", quote: "", affirmation: "" });

  // Window size for Confetti
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // State for Step 3: Breathing
  const [breathePhase, setBreathePhase] = useState('Inhale...');
  const [breathTimer, setBreathTimer] = useState(30);
  const audioRef = useRef(null);

  // State for Step 4: Delay Timer
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [timerActive, setTimerActive] = useState(false);

  // Initialize Random Data & Window Size on mount
  useEffect(() => {
    setRandomData({
      emotional: EMOTIONAL_VIDEOS[Math.floor(Math.random() * EMOTIONAL_VIDEOS.length)],
      motivational: MOTIVATIONAL_VIDEOS[Math.floor(Math.random() * MOTIVATIONAL_VIDEOS.length)],
      quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
      affirmation: AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
    });

    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Step 3: Breathing Timer & Animation Logic ---
  useEffect(() => {
    let phaseInterval;
    let countdownInterval;

    if (step === 3) {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
      }
      
      phaseInterval = setInterval(() => {
        setBreathePhase(prev => prev === 'Inhale...' ? 'Exhale...' : 'Inhale...');
      }, 4000); 

      countdownInterval = setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            setStep(4);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (audioRef.current) audioRef.current.pause();
    }

    return () => {
      clearInterval(phaseInterval);
      clearInterval(countdownInterval);
    };
  }, [step]);

  // --- Step 4: 15-Min Delay Timer Logic ---
  useEffect(() => {
    let interval;
    if (step === 4 && timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const scienceActivities = [
    { i: Snowflake, t: "Ice Dive Reflex", d: "Splash cold water on your face to slow your heart rate instantly." },
    { i: Gamepad2, t: "Play Tetris", d: "Visual games disrupt the imagery of cravings in your brain." },
    { i: Brain, t: "Chew Mint Gum", d: "Strong flavors shock your sensory system & distract your mind." },
    { i: Eye, t: "5-4-3-2-1 Method", d: "Find 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste." },
    { i: Droplet, t: "Chug Cold Water", d: "Drink a large glass of water to activate your parasympathetic system." },
    { i: Wind, t: "Physiological Sigh", d: "Two quick inhales through the nose, one long exhale through the mouth." }
  ];

  if (!randomData.emotional) return null; // Wait for random data to mount

  return (
    <motion.div 
      initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-50 bg-white flex flex-col font-sans"
    >
      {/* Universal Top Bar (Updated Cross Icon visibility) */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <button onClick={onClose} className="pointer-events-auto w-10 h-10 bg-white shadow-lg border border-gray-100 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all">
          <X size={20} strokeWidth={2.5} />
        </button>
        <span className="bg-white px-4 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-md tracking-widest uppercase border border-gray-100">
          Stage {step} / {totalSteps}
        </span>
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- SCREEN 1: Emotional Anchor (YouTube Shorts) --- */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 bg-gray-900 relative flex flex-col items-center justify-center pt-16 pb-24 px-6">
            
            <div className="relative w-full max-w-sm aspect-[9/16] rounded-[40px] p-1.5 bg-gradient-to-br from-[#7D9C6D] via-orange-400 to-[#D9ECA2] shadow-2xl shrink-0">
              <div className="absolute top-6 -left-4 bg-white px-4 py-1 rounded-full shadow-lg font-bold text-[#7D9C6D] text-sm rotate-[-5deg] z-20 flex items-center gap-1"><Heart size={14}/> Family</div>
              
              {/* YouTube Iframe container */}
              <div className="w-full h-full rounded-[32px] overflow-hidden relative bg-black">
                 <iframe 
                   className="absolute inset-0 w-full h-full"
                   src={randomData.emotional}
                   title="Emotional Anchor Video"
                   frameBorder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen>
                 </iframe>
                 
                 {/* Motivation Overlay */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 pointer-events-none">
                   <BrainMascot expression="happy" className="w-24 h-24 mb-6 drop-shadow-2xl" />
                   <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">Remember your "Why"</h2>
                 </div>
              </div>
            </div>

            <div className="absolute bottom-8 w-full px-6 flex justify-center">
              <button onClick={() => setStep(2)} className="w-full max-w-sm py-4 bg-white text-[#7D9C6D] rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(255,255,255,0.3)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* --- SCREEN 2: YouTube Motivation + Random Quote --- */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 bg-[#f8fcf4] relative flex flex-col items-center pt-24 pb-24 px-6">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Take a moment to reset.</h2>
            
            <div className="w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 relative border-4 border-white shrink-0 max-h-[50vh]">
               <iframe 
                 className="absolute inset-0 w-full h-full"
                 src={randomData.motivational}
                 title="Motivational Video"
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen>
               </iframe>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D9ECA2] w-full max-w-sm relative mt-auto">
              <div className="absolute -top-4 -left-2 text-[#7D9C6D] bg-[#D9ECA2] w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                <Quote size={20} fill="currentColor" />
              </div>
              <p className="text-gray-700 font-bold text-base leading-relaxed italic text-center mt-2">
                "{randomData.quote}"
              </p>
            </div>

            <div className="absolute bottom-8 w-full px-6 flex justify-center">
              <button onClick={() => setStep(3)} className="w-full max-w-sm py-4 bg-[#7D9C6D] text-white rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(125,156,109,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                Next: Guided Breathing
              </button>
            </div>
          </motion.div>
        )}

        {/* --- SCREEN 3: Stabilization (Breathing 30s) --- */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 bg-gradient-to-b from-[#D9ECA2] to-white flex flex-col items-center justify-center relative overflow-hidden">
            <audio ref={audioRef} loop src="https://assets.mixkit.co/sfx/preview/mixkit-crickets-and-insects-in-the-wild-ambience-39.mp3" />
            
            <h2 className="text-2xl font-extrabold text-[#7D9C6D] mb-12 relative z-20 text-center px-4">Let's regulate your nervous system.</h2>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div 
                animate={{ scale: breathePhase === 'Inhale...' ? 1.5 : 0.8, opacity: breathePhase === 'Inhale...' ? 0.3 : 0.6 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#7D9C6D] rounded-full"
              />
              <motion.div 
                animate={{ scale: breathePhase === 'Inhale...' ? 1.2 : 0.9 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute inset-4 bg-[#D9ECA2] rounded-full opacity-80"
              />
              <BrainMascot 
                expression="breathing" 
                style={{ scale: breathePhase === 'Inhale...' ? 1.1 : 0.9 }} 
                className="w-32 h-32 relative z-20 transition-transform duration-[4000ms] ease-in-out" 
              />
            </div>

            <motion.h1 
              key={breathePhase}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="text-4xl font-extrabold text-gray-800 mt-16 h-12"
            >
              {breathePhase}
            </motion.h1>

            <div className="absolute bottom-20 flex flex-col items-center">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Auto-advancing in</div>
              <div className="text-3xl font-black text-[#7D9C6D] bg-white px-6 py-2 rounded-2xl shadow-sm border border-[#D9ECA2]">
                00:{breathTimer.toString().padStart(2, '0')}
              </div>
            </div>
            
            <button onClick={() => setStep(4)} className="absolute bottom-6 text-gray-400 font-bold text-sm underline underline-offset-4 hover:text-gray-600 transition-colors">
              Skip breathing
            </button>
          </motion.div>
        )}

        {/* --- SCREEN 4: The Delay Timer & Activities --- */}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 bg-[#FAFAFA] flex flex-col items-center pt-24 pb-8 relative hide-scrollbar overflow-y-auto">
            
            <div className="bg-white mx-6 p-6 rounded-[32px] shadow-sm border border-gray-100 w-[calc(100%-3rem)] flex flex-col items-center shrink-0">
              <h2 className="text-gray-500 font-bold mb-1 uppercase tracking-widest text-xs">Urge Surfing Timer</h2>
              <div className="text-6xl font-black text-gray-800 mb-4 font-mono tracking-tighter">
                {formatTime(timeLeft)}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setTimerActive(!timerActive)} className="w-14 h-14 rounded-full bg-[#D9ECA2] text-[#7D9C6D] flex items-center justify-center hover:bg-[#cbe389] transition-colors">
                  {timerActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>
                <button onClick={() => {setTimeLeft(900); setTimerActive(false);}} className="w-14 h-14 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            <div className="w-full mt-8 px-6 pb-24">
              <h3 className="font-extrabold text-gray-800 text-lg mb-4">Science-Backed Distractions:</h3>
              <div className="grid grid-cols-1 gap-3">
                {scienceActivities.map((act, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-orange-200 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-100">
                      <act.i size={24}/>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{act.t}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{act.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent pt-12">
              <button onClick={() => setStep(5)} className="w-60 py-4 text-centre margin-auto bg-[#7D9C6D] text-white rounded-2xl font-bold shadow-[0_8px_30px_rgb(125,156,109,0.3)] hover:scale-[1.02] active:scale-95 transition-transform text-lg">
                I successfully waited it out
              </button>
            </div>
          </motion.div>
        )}

        {/* --- SCREEN 5: Resolution & Feedback --- */}
        {step === 5 && (
          <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 bg-white flex flex-col items-center justify-center p-6 text-center relative">
            <BrainMascot expression="thinking" className="w-32 h-32 mb-8 drop-shadow-md" />
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Check-in time.</h1>
            <p className="text-gray-500 font-medium mb-10 px-4">Reflecting on what works helps your brain build stronger habits for next time.</p>

            <div className="w-full bg-[#f8fcf4] p-6 rounded-[32px] border border-[#D9ECA2]">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">What helped you the most?</h3>
              <div className="grid grid-cols-2 gap-3">
                {['The Video', 'Deep Breathing', 'Playing Tetris', 'Cold Water', 'Waiting it out', 'Other'].map(opt => (
                  <button 
                    key={opt} 
                    onClick={() => setStep(6)} 
                    className="p-3 bg-white shadow-sm rounded-2xl text-sm font-bold text-gray-600 hover:bg-[#7D9C6D] hover:text-white transition-all active:scale-95 border border-gray-100"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- SCREEN 6: Final Celebration w/ Real Confetti --- */}
        {step === 6 && (
          <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 bg-gradient-to-b from-[#D9ECA2] to-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            
            {/* Real React Confetti */}
            <Confetti 
              width={windowSize.width} 
              height={windowSize.height} 
              recycle={false} 
              numberOfPieces={400} 
              gravity={0.15}
              colors={['#7D9C6D', '#D9ECA2', '#F3D79C', '#B25349', '#FFFFFF', '#f97316']}
            />

            <div className="relative z-20 flex flex-col items-center">
              <BrainMascot expression="cheering" className="w-48 h-48 mb-8 drop-shadow-2xl" />
              <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">You did it! 🎊</h1>
              <p className="text-gray-700 font-bold text-xl mb-2 px-2">
                {randomData.affirmation}
              </p>
              <p className="text-gray-500 font-medium px-4 mb-12">Every time you surf an urge, your recovery muscles get stronger.</p>

              <button onClick={onClose} className="w-full max-w-xs py-5 bg-[#7D9C6D] text-white rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgb(125,156,109,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                Return to Dashboard <Heart size={20} fill="currentColor" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
}