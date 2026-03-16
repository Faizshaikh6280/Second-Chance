import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Beer, Cigarette, Pill, Smartphone, Candy, Plus, 
  Clock, Sun, Sunrise, Moon, Zap, Sunset,
  Frown, CloudRain, Angry, Coffee, Users,
  Heart, Activity, PiggyBank, Brain, Leaf,
  Camera, Phone, CheckCircle2, Star,
  Home, AlertCircle, Swords, Wind, Droplet, Check, ChevronDown ,ChevronRight
} from 'lucide-react';

// --- EXTERNAL COMPONENTS ---
// Make sure these files exist in your src folder!
import RecoveryJourney from './RecoveryJourney';
import Challenges from './Challenges';
import Community from './Community';
import CopingNow from './CopingNow';

// --- MASCOT COMPONENT ---
const BrainMascot = ({ className = "", expression = "happy", action = "none" }) => {
  const isGlowing = expression === 'glowing';
  const isSleepy = expression === 'sleepy';

  return (
    <div className={`relative flex justify-center items-center ${className} ${isSleepy ? 'animate-[pulse_4s_ease-in-out_infinite]' : 'animate-[bounce_3s_ease-in-out_infinite]'}`}>
      {isGlowing && <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>}
      
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <path d="M60 90C87.6142 90 110 72.0914 110 50C110 27.9086 87.6142 10 60 10C32.3858 10 10 27.9086 10 50C10 72.0914 32.3858 90 60 90Z" fill={isGlowing ? "#F3D79C" : "#F9A8D4"}/>
        <path d="M30 30C40 20 50 15 60 15C70 15 80 20 90 30" stroke={isGlowing ? "#E5B96E" : "#F472B6"} strokeWidth="6" strokeLinecap="round"/>
        <path d="M25 50C40 45 50 45 60 50C70 55 80 55 95 50" stroke={isGlowing ? "#E5B96E" : "#F472B6"} strokeWidth="6" strokeLinecap="round"/>
        <path d="M35 70C45 75 50 75 60 70C70 65 80 65 85 70" stroke={isGlowing ? "#E5B96E" : "#F472B6"} strokeWidth="6" strokeLinecap="round"/>
        
        <circle cx="35" cy="55" r="8" fill="#B25349" opacity="0.4"/>
        <circle cx="85" cy="55" r="8" fill="#B25349" opacity="0.4"/>
        
        {isSleepy ? (
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
        
        {(expression === 'happy' || expression === 'glowing' || expression === 'energetic') && <path d="M55 55Q60 60 65 55" stroke="#403931" strokeWidth="3" strokeLinecap="round"/>}
        {expression === 'thinking' && <circle cx="60" cy="58" r="2" fill="#403931"/>}
        {expression === 'concerned' && <path d="M55 58Q60 55 65 58" stroke="#403931" strokeWidth="3" strokeLinecap="round"/>}
        {expression === 'sleepy' && <circle cx="60" cy="57" r="3" fill="#403931" opacity="0.5"/>}
      </svg>

      {action === 'reading' && (
        <div className="absolute -bottom-2 w-10 h-6 bg-white border-2 border-gray-200 rounded shadow-sm z-20" style={{ transform: 'rotate(-10deg)'}}></div>
      )}
      {action === 'sleeping' && (
        <div className="absolute -top-4 right-0 font-bold text-gray-400 animate-bounce">Zzz</div>
      )}
    </div>
  );
};

// --- REUSABLE UI COMPONENTS ---
const FadeIn = ({ children }) => <div className="animate-[fadeIn_0.5s_ease-out] w-full h-full flex flex-col">{children}</div>;

const Button = ({ children, onClick, className = "", icon: Icon }) => (
  <button onClick={onClick} className={`w-full py-4 rounded-2xl font-bold text-lg text-white bg-[#7D9C6D] hover:bg-[#6b865d] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 ${className}`}>
    {children}
    {Icon && <Icon size={20} />}
  </button>
);

const ProgressBar = ({ step, total = 5 }) => (
  <div className="w-full px-6 pt-12 pb-4">
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-orange-400 transition-all duration-500 ease-out" style={{ width: `${(step / total) * 100}%` }}></div>
    </div>
  </div>
);

const MCQCard = ({ icon: Icon, title, onClick }) => (
  <button onClick={onClick} className="w-full p-4 mb-3 bg-white border-2 border-gray-100 rounded-2xl flex items-center gap-4 hover:border-orange-400 hover:shadow-md active:scale-[0.98] transition-all text-left group">
    <div className="w-12 h-12 rounded-xl bg-[#D9ECA2]/30 flex items-center justify-center text-[#7D9C6D] group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
      <Icon size={24} />
    </div>
    <span className="font-semibold text-gray-700 text-lg flex-1">{title}</span>
  </button>
);

const SpeechBubble = ({ text }) => (
  <div className="relative bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-4 max-w-[85%] mx-auto">
    <p className="text-gray-700 font-medium text-center">{text}</p>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
  </div>
);

const ProgressRing = ({ percentage, label, icon: Icon, metric }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-w-[140px] p-4 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 snap-center">
      <div className="relative flex items-center justify-center w-24 h-24 mb-3">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="#f3f4f6" strokeWidth="8" fill="none" />
          <motion.circle
            cx="48" cy="48" r={radius} stroke="#7D9C6D" strokeWidth="8" fill="none" strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="relative z-10 text-[#7D9C6D] bg-[#D9ECA2]/30 p-3 rounded-full"><Icon size={24} /></div>
      </div>
      <span className="text-sm font-bold text-gray-700 text-center">{label}</span>
      <span className="text-xs font-medium text-gray-400 mt-1 text-center">{metric}</span>
    </div>
  );
};

const TaskCard = ({ task, onComplete }) => (
  <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className={`relative p-4 rounded-2xl border-2 transition-colors duration-300 flex items-center gap-4 ${task.completed ? 'bg-[#D9ECA2]/40 border-[#D9ECA2]' : 'bg-white border-gray-100'}`}
    onClick={() => onComplete(task.id)}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${task.completed ? 'bg-[#7D9C6D] text-white' : 'bg-gray-50 text-gray-400'}`}>
      {task.completed ? <Check size={24} /> : <task.icon size={24} />}
    </div>
    <div className="flex-1">
      <h4 className={`font-bold transition-colors ${task.completed ? 'text-[#7D9C6D]' : 'text-gray-800'}`}>{task.title}</h4>
      <p className="text-sm text-gray-500 font-medium">{task.time}</p>
    </div>
    <AnimatePresence>
      {task.completed && (
        <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0] }} exit={{ opacity: 0 }} className="absolute right-4 text-[#7D9C6D]">
          <Leaf size={32} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// --- MAIN DASHBOARD (Step 14) ---
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isCopingMode, setIsCopingMode] = useState(false);
  
  const streakDays = 12;
  const hour = new Date().getHours();
  
  let timePhase = 'Morning';
  let mascotAction = 'stretching';
  let greeting = "Ready for a fresh start today?";
  if (hour >= 12 && hour < 17) { timePhase = 'Afternoon'; mascotAction = 'reading'; greeting = "Keep your focus strong!"; }
  else if (hour >= 17 && hour < 21) { timePhase = 'Evening'; mascotAction = 'meditating'; greeting = "Time to wind down and reflect."; }
  else if (hour >= 21 || hour < 5) { timePhase = 'Night'; mascotAction = 'sleeping'; greeting = "Rest well, you earned it."; }

  const [tasks, setTasks] = useState([
    { id: 1, title: '3 minute breathing', time: 'Morning', icon: Wind, completed: true },
    { id: 2, title: '10 minute walk', time: 'Afternoon', icon: Activity, completed: false },
    { id: 3, title: 'Journal reflection', time: 'Evening', icon: Sun, completed: false },
    { id: 4, title: 'Craving prevention', time: 'Night', icon: Moon, completed: false },
  ]);

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const cravingData = [{ day: 'Mon', intensity: 8 }, { day: 'Tue', intensity: 7 }, { day: 'Wed', intensity: 5 }, { day: 'Thu', intensity: 6 }, { day: 'Fri', intensity: 4 }, { day: 'Sat', intensity: 3 }, { day: 'Sun', intensity: 2 }];
  const moodData = [{ day: 'Mon', mood: 1 }, { day: 'Tue', mood: 2 }, { day: 'Wed', mood: 3 }, { day: 'Thu', mood: 2 }, { day: 'Fri', mood: 4 }, { day: 'Sat', mood: 4 }];

  const CustomMoodDot = (props) => {
    const { cx, cy, payload } = props;
    const emoji = payload.mood === 1 ? '😔' : payload.mood === 2 ? '😐' : payload.mood === 3 ? '🙂' : '😄';
    return <text x={cx} y={cy} dy={6} fontSize="18" textAnchor="middle">{emoji}</text>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 bg-[#FAFAFA] relative flex flex-col h-full overflow-hidden">
      
      {/* HOME TAB */}
      {activeTab === 'home' && (
        <div className="flex-1 overflow-y-auto pb-32 hide-scrollbar">
          <div className="pt-12 px-6 pb-6 bg-white rounded-b-[40px] shadow-sm flex items-center justify-between sticky top-0 z-20">
            <div>
              <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Your Progress</span>
              <div className="flex items-center gap-3 mt-1">
                <div className="bg-[#D9ECA2] text-[#7D9C6D] px-3 py-1 rounded-lg font-black text-xl flex items-center gap-1 shadow-sm">
                  <Zap size={20} fill="currentColor" /> {streakDays}
                </div>
                <h1 className="text-xl font-extrabold text-gray-800">Days Sober</h1>
              </div>
            </div>
            <BrainMascot expression="energetic" className="w-12 h-12" />
          </div>

          <div className="p-6">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-b from-[#D9ECA2]/40 to-white rounded-[32px] p-6 shadow-sm border border-white relative overflow-hidden flex flex-col items-center text-center">
              <SpeechBubble text={greeting} />
              <BrainMascot action={mascotAction} expression={timePhase === 'Night' ? 'sleepy' : 'happy'} className="w-32 h-32 my-4" />
              <p className="font-bold text-gray-700">Good {timePhase}!</p>
            </motion.div>
          </div>

          <div className="pl-6 mb-8">
            <h2 className="text-lg font-extrabold text-gray-800 mb-4">Body Healing</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 pr-6 snap-x hide-scrollbar">
              <ProgressRing percentage={12} label="Lungs" icon={Wind} metric="12% improved" />
              <ProgressRing percentage={8} label="Heart" icon={HeartPulse} metric="Stress reduced" />
              <ProgressRing percentage={15} label="Blood Pres." icon={Activity} metric="15% stable" />
              <ProgressRing percentage={100} label="Saved" icon={DollarSign} metric="$240 retained" />
            </div>
          </div>

          <div className="px-6 mb-8">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50">
              <h2 className="text-lg font-extrabold text-gray-800 mb-6">Craving Intensity</h2>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cravingData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                    <YAxis hide domain={[0, 10]} />
                    <Tooltip cursor={{ stroke: '#D9ECA2', strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="intensity" stroke="#7D9C6D" strokeWidth={4} dot={{ r: 4, fill: '#7D9C6D', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#B25349' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="px-6 mb-8">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50">
              <h2 className="text-lg font-extrabold text-gray-800 mb-6">Emotional Progress</h2>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <XAxis dataKey="day" hide />
                    <YAxis hide domain={[0, 5]} />
                    <Line type="monotone" dataKey="mood" stroke="#D9ECA2" strokeWidth={3} dot={<CustomMoodDot />} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="px-6 mb-8">
            <h2 className="text-lg font-extrabold text-gray-800 mb-4">Today's Recovery Plan</h2>
            <div className="space-y-3">
              {tasks.map(task => <TaskCard key={task.id} task={task} onComplete={toggleTask} />)}
            </div>
          </div>
        </div>
      )}

      {/* RECOVERY TAB */}
      {activeTab === 'recovery' && (
        <div className="flex-1 overflow-hidden">
          <RecoveryJourney />
        </div>
      )}

      {/* CHALLENGES TAB */}
      {activeTab === 'challenges' && (
        <div className="flex-1 overflow-hidden">
          <Challenges />
        </div>
      )}

      {/* COMMUNITY TAB */}
      {activeTab === 'community' && (
        <div className="flex-1 overflow-hidden">
          <Community />
        </div>
      )}

      {/* FLOATING COPING BUTTON */}
      <motion.button 
        onClick={() => setIsCopingMode(true)}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="absolute bottom-28 right-6 bg-gradient-to-r from-[#7D9C6D] to-[#6b865d] text-white p-4 rounded-full shadow-[0_8px_20px_rgb(125,156,109,0.4)] flex items-center gap-2 z-30"
      >
        <div className="relative">
          <AlertCircle size={24} />
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30"></div>
        </div>
        <span className="font-bold pr-2">Coping Now</span>
      </motion.button>

      {/* BOTTOM NAVIGATION */}
      <div className="absolute bottom-6 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full px-6 py-4 flex justify-between items-center z-40">
        {[
          { icon: Home, id: 'home' },
          { icon: Zap, id: 'recovery' },
          { icon: Swords, id: 'challenges' },
          { icon: Users, id: 'community' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative p-2 flex flex-col items-center group">
              <tab.icon size={26} className={`transition-colors duration-300 ${isActive ? 'text-[#7D9C6D]' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {isActive && <motion.div layoutId="navIndicator" className="absolute -bottom-2 w-1 h-1 bg-[#7D9C6D] rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* COPING OVERLAY */}
      <AnimatePresence>
        {isCopingMode && <CopingNow onClose={() => setIsCopingMode(false)} />}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

// --- APP COMPONENT (Onboarding Router) ---
export default function App() {
  const [step, setStep] = useState(1);
  const [addedContacts, setAddedContacts] = useState([]);

  const toggleContact = (role) => {
    setAddedContacts(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };
  const [answers, setAnswers] = useState({});
  const [anchorImages, setAnchorImages] = useState([null, null, null, null]);

  const handleAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => setStep(step + 1), 300);
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImages = [...anchorImages];
      newImages[index] = imageUrl;
      setAnchorImages(newImages);
      setAnswers(prev => ({ ...prev, anchors: newImages }));
    }
  };

  useEffect(() => {
    if (step === 1) { const timer = setTimeout(() => setStep(2), 3500); return () => clearTimeout(timer); }
    if (step === 10) { const timer = setTimeout(() => setStep(11), 4000); return () => clearTimeout(timer); }
  }, [step]);

  const wrapperClass = "w-full max-w-[390px] mx-auto h-[100dvh] sm:h-[844px] sm:my-8 sm:rounded-[40px] shadow-2xl overflow-hidden relative bg-white flex flex-col font-sans";

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center sm:p-4">
      <div className={wrapperClass}>
        
        {step === 1 && (
          <FadeIn>
            <div className="flex-1 bg-gradient-to-b from-[#D9ECA2] to-white flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#7D9C6D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full border-4 border-[#7D9C6D]/20 animate-[ping_3s_ease-in-out_infinite]"></div>
                  <BrainMascot className="w-32 h-32 mb-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Welcome to your<br/>healing journey</h1>
                <p className="text-[#7D9C6D] font-medium text-sm animate-pulse mt-8">Preparing your safe space...</p>
              </div>
            </div>
          </FadeIn>
        )}

        {step === 2 && (
          <FadeIn>
            <div className="flex-1 bg-gradient-to-b from-[#D9ECA2] to-white flex flex-col p-6 pt-20">
              <div className="flex-1 flex flex-col items-center justify-center mt-10">
                <SpeechBubble text="Hi there. I'm your tiny brain companion. I'm here to help you heal." />
                <BrainMascot className="w-40 h-40 mt-4 mb-8" />
                <p className="text-center text-gray-500 font-medium px-4 mb-12">We'll ask a few quick questions to build your personal recovery plan.</p>
              </div>
              <div className="pb-8"><Button onClick={() => setStep(3)} icon={Leaf}>Let's Begin</Button></div>
            </div>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn>
            <ProgressBar step={1} />
            <div className="flex-1 p-6 flex flex-col overflow-y-auto pb-24 shadow-inner">
              <SpeechBubble text="What habit are you trying to overcome?" />
              <BrainMascot expression="thinking" className="w-24 h-24 mx-auto mb-6" />
              <div className="space-y-1">
                <MCQCard icon={Beer} title="Alcohol" onClick={() => handleAnswer('type', 'alcohol')} />
                <MCQCard icon={Cigarette} title="Smoking / Nicotine" onClick={() => handleAnswer('type', 'smoking')} />
                <MCQCard icon={Pill} title="Drugs / Substances" onClick={() => handleAnswer('type', 'drugs')} />
                <MCQCard icon={Smartphone} title="Digital Addiction" onClick={() => handleAnswer('type', 'digital')} />
                <MCQCard icon={Candy} title="Sugar / Food Cravings" onClick={() => handleAnswer('type', 'sugar')} />
                <MCQCard icon={Plus} title="Something Else" onClick={() => handleAnswer('type', 'other')} />
              </div>
            </div>
          </FadeIn>
        )}

        {step === 4 && (
          <FadeIn>
            <ProgressBar step={2} />
            <div className="flex-1 p-6 flex flex-col overflow-y-auto pb-24 shadow-inner">
              <SpeechBubble text="How long have you been struggling with this?" />
              <BrainMascot expression="concerned" className="w-24 h-24 mx-auto mb-6" />
              <div className="space-y-1">
                <MCQCard icon={Clock} title="Less than 6 months" onClick={() => handleAnswer('duration', '<6m')} />
                <MCQCard icon={Clock} title="6 months – 1 year" onClick={() => handleAnswer('duration', '6m-1y')} />
                <MCQCard icon={Clock} title="1 – 3 years" onClick={() => handleAnswer('duration', '1-3y')} />
                <MCQCard icon={Clock} title="3 – 5 years" onClick={() => handleAnswer('duration', '3-5y')} />
                <MCQCard icon={Clock} title="More than 5 years" onClick={() => handleAnswer('duration', '>5y')} />
              </div>
            </div>
          </FadeIn>
        )}

        {step === 5 && (
          <FadeIn>
            <ProgressBar step={3} />
            <div className="flex-1 p-6 flex flex-col overflow-y-auto pb-24 shadow-inner">
              <SpeechBubble text="When do cravings usually hit the hardest?" />
              <BrainMascot expression="thinking" className="w-24 h-24 mx-auto mb-6" />
              <div className="space-y-1">
                <MCQCard icon={Sunrise} title="Morning" onClick={() => handleAnswer('time', 'morning')} />
                <MCQCard icon={Sun} title="Afternoon" onClick={() => handleAnswer('time', 'afternoon')} />
                <MCQCard icon={Sunset} title="Evening" onClick={() => handleAnswer('time', 'evening')} />
                <MCQCard icon={Moon} title="Late Night" onClick={() => handleAnswer('time', 'night')} />
                <MCQCard icon={Zap} title="Randomly" onClick={() => handleAnswer('time', 'random')} />
              </div>
            </div>
          </FadeIn>
        )}

        {step === 6 && (
          <FadeIn>
            <ProgressBar step={4} />
            <div className="flex-1 p-6 flex flex-col overflow-y-auto pb-24 shadow-inner">
              <SpeechBubble text="What usually triggers your cravings?" />
              <BrainMascot expression="concerned" className="w-24 h-24 mx-auto mb-6" />
              <div className="space-y-1">
                <MCQCard icon={Frown} title="Stress" onClick={() => handleAnswer('trigger', 'stress')} />
                <MCQCard icon={CloudRain} title="Loneliness" onClick={() => handleAnswer('trigger', 'loneliness')} />
                <MCQCard icon={Angry} title="Anger" onClick={() => handleAnswer('trigger', 'anger')} />
                <MCQCard icon={Coffee} title="Boredom" onClick={() => handleAnswer('trigger', 'boredom')} />
                <MCQCard icon={Users} title="Social Situations" onClick={() => handleAnswer('trigger', 'social')} />
              </div>
            </div>
          </FadeIn>
        )}

        {step === 7 && (
          <FadeIn>
            <ProgressBar step={5} />
            <div className="flex-1 p-6 flex flex-col overflow-y-auto pb-24 shadow-inner">
              <SpeechBubble text="Why do you want to quit?" />
              <BrainMascot expression="happy" className="w-24 h-24 mx-auto mb-6" />
              <div className="space-y-1">
                <MCQCard icon={Heart} title="Family & Loved Ones" onClick={() => handleAnswer('motivation', 'family')} />
                <MCQCard icon={Activity} title="Health & Body" onClick={() => handleAnswer('motivation', 'health')} />
                <MCQCard icon={PiggyBank} title="Financial Savings" onClick={() => handleAnswer('motivation', 'finance')} />
                <MCQCard icon={Brain} title="Mental Clarity" onClick={() => handleAnswer('motivation', 'mind')} />
                <MCQCard icon={Leaf} title="Self Growth" onClick={() => handleAnswer('motivation', 'growth')} />
              </div>
            </div>
          </FadeIn>
        )}

        {step === 8 && (
          <FadeIn>
            <div className="flex-1 bg-[#D9ECA2]/20 flex flex-col p-6 pt-12 overflow-y-auto">
              <SpeechBubble text="When cravings hit, we'll remind you why you started. Upload photos of people or pets you love." />
              <BrainMascot expression="happy" className="w-24 h-24 mx-auto mb-8" />
              <div className="grid grid-cols-2 gap-4 mb-8">
                {anchorImages.map((imgUrl, index) => (
                  <label key={index} className="aspect-square bg-white border-2 border-dashed border-[#7D9C6D]/50 rounded-2xl flex flex-col items-center justify-center gap-2 text-[#7D9C6D] hover:bg-[#7D9C6D]/10 transition-colors cursor-pointer relative overflow-hidden group">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(index, e)} />
                    {imgUrl ? (
                      <>
                        <img src={imgUrl} alt={`Anchor ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-bold text-xs bg-black/50 px-3 py-1 rounded-full">Change</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera size={28} />
                        <span className="font-semibold text-sm">Upload</span>
                      </>
                    )}
                  </label>
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm mb-auto">These will only be used privately to help you stay strong.</p>
              <div className="mt-8 pb-4"><Button onClick={() => setStep(9)}>Continue</Button></div>
            </div>
          </FadeIn>
        )}

        {step === 9 && (
          <FadeIn>
            <div className="flex-1 p-6 pt-12 flex flex-col overflow-y-auto shadow-inner">
              <SpeechBubble text="Who should we contact if you're struggling?" />
              <BrainMascot expression="thinking" className="w-24 h-24 mx-auto mb-6" />
              <div className="space-y-4 mb-auto">
                {['Family Member', 'Trusted Friend', 'Therapist', 'Sponsor / Mentor'].map((role) => {
                  const isAdded = addedContacts.includes(role);
                  return (
                    <div key={role} className={`p-4 bg-white border-2 rounded-2xl flex items-center justify-between shadow-sm transition-colors ${isAdded ? 'border-[#D9ECA2]' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isAdded ? 'bg-[#7D9C6D] text-white' : 'bg-orange-100 text-orange-500'}`}>
                          <Phone size={18} />
                        </div>
                        <span className="font-semibold text-gray-700">{role}</span>
                      </div>
                      <button 
                        onClick={() => toggleContact(role)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 ${isAdded ? 'bg-[#7D9C6D] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {isAdded ? <><Check size={14} strokeWidth={3}/> Added</> : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pb-4"><Button onClick={() => setStep(10)}>Build My Plan</Button></div>
            </div>
          </FadeIn>
        )}

        {step === 10 && (
          <FadeIn>
            <div className="flex-1 bg-gradient-to-b from-[#D9ECA2] to-white flex flex-col items-center justify-center px-6 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 border-4 border-dashed border-[#7D9C6D] rounded-full animate-[spin_8s_linear_infinite]"></div>
                <BrainMascot className="w-32 h-32 p-4" expression="thinking" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Building your recovery plan...</h2>
              <p className="text-[#7D9C6D] font-medium">This may take a moment.</p>
              <div className="w-full max-w-xs h-3 bg-gray-200 rounded-full mt-10 overflow-hidden">
                <div className="h-full bg-orange-400 w-full animate-[loading_4s_ease-in-out]"></div>
              </div>
              <style>{`@keyframes loading { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
            </div>
          </FadeIn>
        )}

        {/* --- STEP 11: GUIDED TOUR START --- */}
        {step === 11 && (
          <FadeIn>
            <div className="flex-1 bg-[#f8fcf4] flex flex-col overflow-hidden">
              <div className="p-6 bg-white shadow-sm z-10">
                <h2 className="text-xl font-bold text-gray-800 text-center">Your Journey Map</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-6 relative">
                <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-32 h-full z-0 pointer-events-none" preserveAspectRatio="none">
                  <path d="M64,0 C120,100 0,200 64,300 C120,400 0,500 64,600 C120,700 0,800 64,900" stroke="#D9ECA2" strokeWidth="16" fill="none" strokeLinecap="round"/>
                </svg>
                <div className="relative z-10 flex flex-col gap-16 py-8">
                  {[
                    { w: 1, title: 'Stabilize Cravings', side: 'right' }, { w: 2, title: 'Build Awareness', side: 'left' },
                    { w: 3, title: 'Habit Replacement', side: 'right' }, { w: 4, title: 'Emotional Resilience', side: 'left' },
                    { w: 5, title: 'Confidence Building', side: 'right' }, { w: 6, title: 'Lifestyle Redesign', side: 'left' },
                    { w: 7, title: 'Strong Recovery', side: 'right', icon: Star },
                  ].map((node, i) => (
                    <div key={i} className={`flex ${node.side === 'right' ? 'justify-end' : 'justify-start'} w-full relative`}>
                   <div onClick={() => node.w === 1 && setStep(12)} className={`w-[60%] flex flex-col items-center cursor-pointer group ${node.w === 1 ? 'animate-bounce' : ''}`}>
                        
                        {/* 1. We added "relative" to the circle, and moved the tooltip INSIDE it */}
                        <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10 ${node.w === 1 ? 'bg-orange-400' : 'bg-[#D9ECA2] group-hover:bg-[#c2d984]'} transition-colors`}>
                          
                          {/* 2. THE GUIDING TOOLTIP (Now perfectly anchored to the Left side) */}
                          {node.w === 1 && (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: [-10, 0, -10] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                              className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 flex items-center z-50 pointer-events-none"
                            >
                              <div className="bg-orange-500 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-xl whitespace-nowrap flex items-center gap-1 relative">
                                Start here! <ChevronRight size={16} strokeWidth={3} />
                                {/* Pointer triangle pointing right towards the circle */}
                                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-orange-500 rotate-45 rounded-sm"></div>
                              </div>
                            </motion.div>
                          )}

                          {/* The Icon inside the circle */}
                          {node.icon ? <node.icon size={32} className="text-white" fill="currentColor"/> : <Brain className={`w-8 h-8 ${node.w === 1 ? 'text-white' : 'text-[#7D9C6D]'}`} />}
                        </div>
                        
                        {/* The Text Label below the circle */}
                        <div className="mt-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-center relative">
                          <span className="block text-xs font-bold text-gray-400">WEEK {node.w}</span>
                          <span className="block text-sm font-bold text-gray-700">{node.title}</span>
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* --- STEP 12: GUIDED TOUR CONTINUE --- */}
        {step === 12 && (
          <FadeIn>
            <div className="flex-1 bg-white flex flex-col">
              <div className="bg-[#D9ECA2] p-8 pb-12 rounded-b-[40px] relative">
                <button onClick={() => setStep(11)} className="absolute top-6 left-6 text-[#7D9C6D] font-bold">← Back</button>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md"><span className="text-2xl font-black text-orange-400">1</span></div>
                  <div><h2 className="text-gray-500 font-bold tracking-wider text-sm">WEEK 1</h2><h1 className="text-2xl font-extrabold text-gray-800">Stabilize Cravings</h1></div>
                </div>
                <BrainMascot className="absolute -bottom-10 right-8 w-24 h-24 drop-shadow-lg" />
              </div>
              <div className="flex-1 p-6 pt-16 overflow-y-auto">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Your daily goals:</h3>
                <div className="space-y-4">
                  {[
                    { icon: Wind, title: 'Guided Breathing', desc: '3 mins every morning' }, { icon: Clock, title: 'Craving Delay', desc: '10-minute wait rule' },
                    { icon: Activity, title: 'Hydration', desc: 'Drink 8 glasses of water' }, { icon: Heart, title: 'Mood Check-in', desc: 'Log feelings nightly' }
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 bg-gray-50">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center"><task.icon size={24} /></div>
                      <div className="flex-1"><h4 className="font-bold text-gray-800">{task.title}</h4><p className="text-sm text-gray-500 font-medium">{task.desc}</p></div>
                      <CheckCircle2 className="text-gray-300" size={24} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* THE GUIDING TOOLTIP */}
              <div className="p-6 bg-white border-t border-gray-50 relative">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: [-10, 5, -10] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none"
                >
                  <div className="bg-[#7D9C6D] text-white text-xs font-black px-4 py-2 rounded-2xl shadow-xl whitespace-nowrap flex items-center gap-1">
                    Almost there! <ChevronDown size={16} strokeWidth={3} />
                  </div>
                  <div className="w-3 h-3 bg-[#7D9C6D] rotate-45 -mt-1.5 rounded-sm"></div>
                </motion.div>
                <Button onClick={() => setStep(13)}>Continue</Button>
              </div>
            </div>
          </FadeIn>
        )}

        {step === 13 && (
          <FadeIn>
             <div className="flex-1 bg-gradient-to-t from-[#D9ECA2] to-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-50">
                 {[...Array(12)].map((_, i) => (
                   <Leaf key={i} size={24} className="absolute text-[#7D9C6D] animate-[fall_5s_linear_infinite]" style={{ left: `${Math.random() * 100}%`, top: `-20px`, animationDelay: `${Math.random() * 5}s`, transform: `rotate(${Math.random() * 360}deg)` }} />
                 ))}
                 <style>{`@keyframes fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(800px) rotate(360deg); opacity: 0; } }`}</style>
              </div>
              <div className="relative z-10 flex flex-col items-center mt-12 mb-auto">
                <BrainMascot className="w-48 h-48 mb-8" expression="glowing" />
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight leading-tight">Your recovery journey<br/>begins today.</h1>
                <p className="text-lg text-gray-600 font-medium px-4">I'm here with you every step of the way. You are not alone.</p>
              </div>
              
              <div className="w-full pb-8 z-10">
                <Button onClick={() => setStep(14)} className="py-5 text-xl shadow-[0_8px_30px_rgb(125,156,109,0.4)]">
                  ENTER DASHBOARD
                </Button>
              </div>
            </div>
          </FadeIn>
        )}

        {/* --- STEP 14: THE MAIN APPLICATION DASHBOARD --- */}
        {step === 14 && <Dashboard />}

      </div>
    </div>
  );
}

// Extra Custom Icons
function HeartPulse(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
    </svg>
  );
}
function DollarSign(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}