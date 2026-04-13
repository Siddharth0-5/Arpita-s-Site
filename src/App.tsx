/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Music, X, Play, Pause } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Constants & Assets ---
const COLORS = {
  pastelPink: '#FFF0F5', // LavenderBlush
  softPink: '#FFB6C1',   // LightPink
  accentPink: '#FF69B4', // HotPink
  deepPink: '#DB7093',   // PaleVioletRed
};

// Local Assets from public folder
const AUDIO_1_URL = "/audio-1.mp3";
const AUDIO_2_URL = "/audio-2.mp3";

const ALL_IMAGES = [
  "/1.jpg",
  "/WhatsApp Image 2026-04-13 at 22.14.56.jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.56 (1).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.56 (2).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.57.jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.57 (1).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.57 (2).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.58.jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.58 (1).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.58 (2).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.59.jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.59 (1).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.14.59 (2).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.15.00.jpeg",
  "/WhatsApp Image 2026-04-13 at 22.15.00 (1).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.15.00 (2).jpeg",
  "/WhatsApp Image 2026-04-13 at 22.15.01.jpeg",
];

const CAROUSEL_IMAGES = ALL_IMAGES.slice(1);

// Stable GIF URLs
const GIFS = {
  surprise: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZqZ3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/MDJ9IbM2LUufAgE4nL/giphy.gif",
  angryCat: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZqZ3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/C9x8gX02SnMIo/giphy.gif",
  sadCat: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZqZ3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/v6aOjy0Qo1fIA/giphy.gif",
  happyCat: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZqZ3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/11s7Ke7jkptCHu/giphy.gif",
  celebrate: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZqZ3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lI4bYvXpMDmrfO/giphy.gif",
};

// --- Components ---

const PhotoCarousel = () => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
      <AnimatePresence mode="wait">
        <motion.img
          key={CAROUSEL_IMAGES[index]}
          src={CAROUSEL_IMAGES[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
    </div>
  );
};

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.5, 0],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute text-pink-300"
        >
          <Heart fill="currentColor" size={Math.random() * 20 + 10} />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [stage, setStage] = useState<'intro' | 'questions' | 'final'>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isAudio1Playing, setIsAudio1Playing] = useState(false);
  const [isAudio2Playing, setIsAudio2Playing] = useState(false);
  
  const audio1Ref = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Attempt autoplay on mount
    if (stage === 'intro' && audio1Ref.current) {
      const playPromise = audio1Ref.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsAudio1Playing(true);
        }).catch(error => {
          console.log("Autoplay prevented. Music will start on first interaction.", error);
          // Fallback: play on first click anywhere if blocked
          const startOnInteraction = () => {
            audio1Ref.current?.play().then(() => {
              setIsAudio1Playing(true);
              window.removeEventListener('click', startOnInteraction);
            });
          };
          window.addEventListener('click', startOnInteraction);
        });
      }
    }
  }, [stage]);

  const questions = [
    {
      text: "READY FOR A SMALL SURPRISE?",
      gif: GIFS.surprise,
      options: ["YES", "NO"],
      poem: "Hasrat ye hai ki unko kareeb se dekhe ,\nHasrat ye hai ki unko kareeb se dekhe ….. \nKareeb ho to aankhe uthai nahi jati ❤️"
    },
    {
      text: "DO YOU LOVE ME?",
      gif: GIFS.sadCat,
      options: ["YES", "NO"],
      isTricky: true,
      poem: "Tujhe nazar-andaaz karun..\nMujhme itna gurur kahan….. \nAur tumhe dekhun nazar bhar kar \nMeri aankhon me utna noor kahan ❤️"
    },
    {
      text: "DO YOU KNOW, I LOVE YOUR SMILE?",
      gif: GIFS.happyCat,
      options: ["YES", "Ofc YES"],
      poem: "Tera zikr karun hawaon se 🧿 \nLog puchte hain kaun sa ittr lagati ho… \nJo na bataun to kehte hain… \nAise bhi kya mohabbat? \nJo itna itrati ho..💝"
    },
  ];

  const closeIntro = () => {
    if (audio1Ref.current) {
      audio1Ref.current.pause();
      setIsAudio1Playing(false);
    }
    setStage('questions');
  };

  const handleAnswer = (answer: string) => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setStage('final');
      triggerConfetti();
      if (audio2Ref.current) {
        audio2Ref.current.play().catch(e => console.log("Audio play blocked", e));
        setIsAudio2Playing(true);
      }
    }
  };

  const moveNoButton = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    setNoButtonPos({ x, y });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [COLORS.accentPink, COLORS.softPink, '#FFFFFF']
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans" style={{ backgroundColor: COLORS.pastelPink }}>
      <FloatingHearts />
      
      {/* Audio Elements */}
      <audio ref={audio1Ref} src={AUDIO_1_URL} loop />
      <audio ref={audio2Ref} src={AUDIO_2_URL} loop />

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm p-4"
          >
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white mb-8">
              <img 
                src="/1.jpg" 
                alt="Couple" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-6">
                <h1 className="text-white text-4xl font-bold tracking-widest drop-shadow-lg">JAI BHEEM</h1>
              </div>
            </div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={closeIntro}
              className="absolute bottom-12 flex items-center gap-2 px-10 py-4 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-all shadow-xl active:scale-95"
            >
              ENTER THE SURPRISE <X size={20} className="ml-2" />
            </motion.button>
            
            {isAudio1Playing && (
              <div className="mt-4 flex items-center gap-2 text-pink-500 animate-pulse">
                <Music size={16} />
                <span className="text-sm font-medium">Music Playing...</span>
              </div>
            )}
          </motion.div>
        )}

        {stage === 'questions' && (
          <motion.div
            key={`q-${questionIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="relative z-10 flex flex-col items-center text-center max-w-lg p-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-pink-600 mb-4 tracking-tight uppercase">
              {questions[questionIndex].text}
            </h2>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-pink-400 italic mb-8 font-serif whitespace-pre-line leading-relaxed"
            >
              {questions[questionIndex].poem}
            </motion.p>
            
            <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-3xl shadow-xl overflow-hidden mb-12 flex items-center justify-center p-4 border-4 border-pink-200">
              <img 
                src={questions[questionIndex].gif} 
                alt="Reaction GIF" 
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex gap-6 items-center justify-center w-full">
              {questions[questionIndex].options.map((opt, i) => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAnswer(opt)}
                  onMouseEnter={questions[questionIndex].isTricky && opt === "NO" ? moveNoButton : undefined}
                  animate={questions[questionIndex].isTricky && opt === "NO" ? { x: noButtonPos.x, y: noButtonPos.y } : {}}
                  className={`px-10 py-4 rounded-2xl font-bold text-xl shadow-lg transition-colors ${
                    i === 0 ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-pink-200 text-pink-700 hover:bg-pink-300'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {stage === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl p-6 min-h-screen justify-center"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
              {/* Left Side: Message & Carousel */}
              <div className="flex flex-col items-center lg:items-start text-left space-y-8 order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">Happy anniversary motte</h1>
                  <p className="text-xl text-pink-400 italic mb-8">Here’s to many more years of annoying you 🥂🎀</p>
                </motion.div>

                <PhotoCarousel />

                <div className="space-y-6 font-serif text-lg md:text-xl text-gray-700 leading-relaxed">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    Tera zikr karun hawaon se 🧿 <br/>
                    Log puchte hain kaun sa ittr lagati ho… <br/>
                    Jo na bataun to kehte hain… <br/>
                    Aise bhi kya mohabbat? <br/>
                    Jo itna itrati ho..💝
                  </motion.p>
                </div>
              </div>

              {/* Right Side: Vinyl Player */}
              <div className="flex flex-col items-center space-y-8 order-1 lg:order-2">
                <div className="relative group">
                  {/* Vinyl Record */}
                  <motion.div
                    animate={{ rotate: isAudio2Playing ? 360 : 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-56 h-56 md:w-80 md:h-80 bg-black rounded-full border-8 border-gray-800 shadow-2xl flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,transparent_40%,#333_100%)]" />
                    <img 
                      src="/WhatsApp Image 2026-04-13 at 22.15.01.jpeg" 
                      alt="Couple" 
                      className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-900 z-10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full z-20 shadow-inner" />
                  </motion.div>
                  
                  {/* Vinyl Tonearm */}
                  <motion.div 
                    initial={{ rotate: 10 }}
                    animate={{ rotate: isAudio2Playing ? -15 : 10 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute -top-8 -right-8 w-40 h-8 z-30 hidden md:block"
                    style={{ transformOrigin: 'right center' }}
                  >
                    <div className="w-full h-2 bg-gray-400 rounded-full shadow-md relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-600 rounded-sm" />
                    </div>
                  </motion.div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="text-pink-600 font-medium tracking-wide animate-pulse">
                    🎵 Tum Agar Sath Dene Ka Vada Karo
                  </div>
                  <button 
                    onClick={() => {
                      if (audio2Ref.current) {
                        if (isAudio2Playing) audio2Ref.current.pause();
                        else audio2Ref.current.play();
                        setIsAudio2Playing(!isAudio2Playing);
                      }
                    }}
                    className="flex items-center gap-2 px-10 py-4 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-all shadow-lg active:scale-95"
                  >
                    {isAudio2Playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    {isAudio2Playing ? "Pause Music" : "Play Music"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFB6C1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
