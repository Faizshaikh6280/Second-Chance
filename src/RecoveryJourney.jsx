import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Lock, Star, Shield, Wind, BookOpen, Activity } from 'lucide-react';
import useGamification from './hooks/useGamification';

// Mock Data for the Journey
const INITIAL_JOURNEY = [
  {
    weekNum: 1,
    title: "Building the Foundation",
    days: Array.from({ length: 7 }).map((_, i) => ({
      id: `w1-d${i + 1}`,
      dayNum: i + 1,
      // First day is active, rest are locked for the demo
      status: i === 0 ? 'active' : i < 3 ? 'locked' : 'locked', 
      tasks: [
        { id: 't1', time: 'Morning', title: 'Breathing exercise', icon: '🧘‍♂️', done: false },
        { id: 't2', time: 'Afternoon', title: 'Walk for 10 minutes', icon: '🚶‍♂️', done: false },
        { id: 't3', time: 'Evening', title: 'Journal reflection', icon: '📓', done: false },
        { id: 't4', time: 'Night', title: 'Craving prevention routine', icon: '🛡️', done: false }
      ]
    }))
  },
  {
    weekNum: 2,
    title: "Understanding Triggers",
    days: Array.from({ length: 7 }).map((_, i) => ({
      id: `w2-d${i + 1}`,
      dayNum: i + 8,
      status: 'locked',
      tasks: [
        { id: 't1', time: 'Morning', title: 'Trigger mapping', icon: '🗺️', done: false },
        { id: 't2', time: 'Afternoon', title: 'Hydration focus', icon: '💧', done: false },
        { id: 't3', time: 'Evening', title: 'Read recovery story', icon: '📖', done: false },
        { id: 't4', time: 'Night', title: 'Sleep hygiene', icon: '🛏️', done: false }
      ]
    }))
  }
];

export default function RecoveryJourney() {
  const { awardProgress } = useGamification();
  const [journey, setJourney] = useState(INITIAL_JOURNEY);
  const [selectedDay, setSelectedDay] = useState(null);

  // Duolingo-style zigzag offsets for the nodes
  const getOffset = (index) => {
    const pattern = [0, 40, 60, 40, 0, -40, -60, -40];
    return pattern[index % pattern.length];
  };

  const handleToggleTask = (weekIndex, dayIndex, taskId) => {
    const newJourney = [...journey];
    const tasks = newJourney[weekIndex].days[dayIndex].tasks;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    tasks[taskIndex].done = !tasks[taskIndex].done;
    setJourney(newJourney);
  };

  const completeDay = () => {
    if (!selectedDay) return;
    
    // Update status to completed
    const newJourney = [...journey];
    newJourney[selectedDay.weekIndex].days[selectedDay.dayIndex].status = 'completed';
    
    // Unlock the next day if it exists
    const nextDayIndex = selectedDay.dayIndex + 1;
    if (nextDayIndex < 7) {
      newJourney[selectedDay.weekIndex].days[nextDayIndex].status = 'active';
    } else if (newJourney[selectedDay.weekIndex + 1]) {
       newJourney[selectedDay.weekIndex + 1].days[0].status = 'active';
    }
    
    awardProgress({
      actionKey: `journey-day-${selectedDay.id}`,
      xp: 120,
      gems: 8,
      updates: { activitiesCompleted: 1 },
    });

    setJourney(newJourney);
    setSelectedDay(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 bg-[#f8fcf4] flex flex-col h-full overflow-hidden relative"
    >
      {/* Header */}
      <div className="pt-12 px-6 pb-4 bg-white rounded-b-[40px] shadow-sm sticky top-0 z-20">
        <h1 className="text-2xl font-extrabold text-gray-800 text-center">Your Journey</h1>
        <p className="text-[#7D9C6D] text-center font-medium text-sm mt-1">One day at a time</p>
      </div>

      {/* Scrollable Map */}
      <div className="flex-1 overflow-y-auto pb-32 pt-8 px-4 hide-scrollbar relative">
        {/* Background winding SVG line */}
        <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-32 h-full z-0 pointer-events-none" preserveAspectRatio="none">
           <path d="M64,0 Q120,100 64,200 T64,400 T64,600 T64,800 T64,1000 T64,1200" stroke="#E5E7EB" strokeWidth="16" fill="none" strokeLinecap="round"/>
        </svg>

        {journey.map((week, wIndex) => (
          <div key={week.weekNum} className="mb-16 relative z-10 flex flex-col items-center">
            
            {/* Week Marker */}
            <div className="mb-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border-4 border-[#D9ECA2] z-10">
                <span className="text-xl font-black text-[#7D9C6D]">W{week.weekNum}</span>
              </div>
              <div className="bg-white px-4 py-1.5 rounded-full shadow-sm mt-[-10px] border border-gray-100 z-20">
                <span className="text-sm font-bold text-gray-700">{week.title}</span>
              </div>
            </div>

            {/* Daily Nodes */}
            <div className="flex flex-col gap-12 w-full">
              {week.days.map((day, dIndex) => {
                const isCompleted = day.status === 'completed';
                const isActive = day.status === 'active';
                const isLocked = day.status === 'locked';
                
                return (
                  <div key={day.id} className="w-full flex justify-center" style={{ transform: `translateX(${getOffset(dIndex)}px)` }}>
                    <motion.button
                      whileHover={!isLocked ? { scale: 1.05 } : {}}
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                      onClick={() => !isLocked && setSelectedDay({ ...day, weekIndex: wIndex, dayIndex: dIndex })}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center border-[6px] shadow-lg transition-colors
                        ${isCompleted ? 'bg-orange-400 border-orange-200' : 
                          isActive ? 'bg-[#7D9C6D] border-[#D9ECA2] animate-bounce-slow' : 
                          'bg-gray-100 border-gray-200 cursor-not-allowed'}`}
                    >
                      {isCompleted ? <Star className="text-white" size={32} fill="currentColor" /> :
                       isActive ? <Wind className="text-white" size={32} /> :
                       <Lock className="text-gray-400" size={28} />}
                      
                      {/* Floating Crown/Tooltip for Active Day */}
                      {isActive && (
                        <div className="absolute -top-10 bg-white px-3 py-1 rounded-xl shadow-md border border-gray-100 whitespace-nowrap">
                          <span className="text-xs font-bold text-[#7D9C6D]">START DAY {day.dayNum}</span>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-gray-100"></div>
                        </div>
                      )}
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Daily Tasks Modal */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-[390px] rounded-t-[40px] sm:rounded-[40px] p-6 pb-12 relative z-10 shadow-2xl flex flex-col max-h-[85vh]"
            >
              <button 
                onClick={() => setSelectedDay(null)}
                className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
              
              <div className="mt-2 mb-6 text-center">
                <span className="text-orange-400 font-bold tracking-widest text-xs uppercase">Day {selectedDay.dayNum}</span>
                <h2 className="text-2xl font-extrabold text-gray-800">Daily Goals</h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-6">
                {journey[selectedDay.weekIndex].days[selectedDay.dayIndex].tasks.map((task) => (
                  <div key={task.id} 
                    onClick={() => handleToggleTask(selectedDay.weekIndex, selectedDay.dayIndex, task.id)}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-colors ${task.done ? 'bg-[#D9ECA2]/30 border-[#D9ECA2]' : 'bg-gray-50 border-gray-100'}`}
                  >
                    <div className="text-3xl">{task.icon}</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase">{task.time}</p>
                      <h4 className={`font-bold ${task.done ? 'text-[#7D9C6D]' : 'text-gray-800'}`}>{task.title}</h4>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${task.done ? 'bg-[#7D9C6D] border-[#7D9C6D] text-white' : 'border-gray-300'}`}>
                      {task.done && <Check size={16} strokeWidth={3} />}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={completeDay}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white bg-[#7D9C6D] hover:bg-[#6b865d] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Star size={20} /> Complete Day
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>
    </motion.div>
  );
}
