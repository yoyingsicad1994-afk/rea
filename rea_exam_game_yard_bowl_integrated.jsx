import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

/* ------------------------------ Yard Background ----------------------------- */
function YardBackground() {
  const posts = useMemo(() => Array.from({ length: 15 }, (_, i) => 60 + i * 70), []);
  return (
    <svg viewBox="0 0 1200 800" className="absolute inset-0 -z-10 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
      <rect width="1200" height="500" fill="url(#skyGrad)" />
      <circle cx="1050" cy="120" r="60" fill="#fde047" stroke="#facc15" strokeWidth="6" />
      <rect y="500" width="1200" height="300" fill="#4ade80" />
      <g>
        <rect x="350" y="280" width="380" height="260" fill="#fef3c7" stroke="#78350f" strokeWidth="8" />
        <polygon points="340,280 540,140 740,280" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="8" />
        <rect x="520" y="420" width="80" height="120" fill="#78350f" stroke="#451a03" strokeWidth="6" />
        <circle cx="590" cy="480" r="6" fill="#fbbf24" />
        <rect x="390" y="340" width="80" height="80" fill="#bae6fd" stroke="#1e3a8a" strokeWidth="6" />
        <rect x="610" y="340" width="80" height="80" fill="#bae6fd" stroke="#1e3a8a" strokeWidth="6" />
      </g>
      <ellipse cx="280" cy="500" rx="80" ry="40" fill="#16a34a" />
      <ellipse cx="920" cy="500" rx="90" ry="50" fill="#15803d" />
      <g stroke="#78350f" strokeWidth="6" fill="#fef9c3">
        {posts.map((x, idx) => (
          <rect key={idx} x={x} y="420" width="30" height="200" rx="6" />
        ))}
        <rect x="60" y="420" width="990" height="20" />
        <rect x="60" y="580" width="990" height="20" />
      </g>
    </svg>
  );
}

/* ------------------------------ Bowl Component ------------------------------ */
function Bowl({ foodPercent }: { foodPercent: number }) {
  const clamp = Math.max(0, Math.min(100, foodPercent));
  const bowlTop = 260;
  const bowlBottom = 540;
  const fillHeight = (bowlBottom - bowlTop) * (clamp / 100);
  const fillY = bowlBottom - fillHeight;
  return (
    <svg viewBox="0 0 800 600" className="w-60">
      <defs>
        <linearGradient id="bowlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
        <clipPath id="bowlClip">
          <path d="M120 260 Q400 180 680 260 L640 480 Q400 540 160 480 Z" />
        </clipPath>
      </defs>
      <ellipse cx="400" cy="520" rx="280" ry="38" fill="#000" opacity=".15" />
      <path d="M120 260 Q400 180 680 260 L640 480 Q400 540 160 480 Z" fill="url(#bowlGrad)" stroke="#111" strokeWidth="8" />
      <path d="M120 260 Q400 180 680 260 L660 300 Q400 240 140 300 Z" fill="url(#rimGrad)" stroke="#111" strokeWidth="6" />
      <g clipPath="url(#bowlClip)">
        <rect x="160" y={fillY} width={480} height={fillHeight} fill="#8b5cf6" opacity={0.85} />
      </g>
    </svg>
  );
}

/* ------------------------------ Questions ------------------------------ */
const questions = [
  { q: "Which approach is most appropriate for income-producing properties?", options: ["Cost Approach", "Sales Comparison Approach", "Income Approach", "Residual Method"], answer: "Income Approach" },
  { q: "Market value is defined as the most _____ price a property should bring under normal conditions.", options: ["possible", "probable", "recent", "assessed"], answer: "probable" },
  { q: "The rights to use, enjoy, exclude and dispose are collectively called the _____ of rights.", options: ["bundle", "chain", "set", "bundle of taxes"], answer: "bundle" },
  { q: "Loss in value due to wear and tear is:", options: ["Functional Obsolescence", "External Obsolescence", "Physical Deterioration", "Appreciation"], answer: "Physical Deterioration" },
];

/* ------------------------------ Game Component ------------------------------ */
export default function REAExamGameYardBowl() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [food, setFood] = useState(50);
  const [lifelines, setLifelines] = useState(10);
  const [masked, setMasked] = useState<string[] | null>(null);

  const q = questions[i];

  function nextQ() {
    setMasked(null);
    setI((prev) => (prev + 1) % questions.length);
  }

  function pick(opt: string) {
    if (opt === q.answer) {
      setScore((s) => s + 1);
      setFood((f) => Math.min(100, f + 8));
      if ((score + 1) % 10 === 0) alert("1 step closer");
    } else {
      const w = wrong + 1;
      setWrong(w);
      setFood((f) => Math.max(0, f - 10));
      if (w >= 10) {
        alert("Game over — 10 incorrect answers.");
        reset();
        return;
      }
    }
    nextQ();
  }

  function fifty() {
    if (lifelines <= 0) return;
    setLifelines((n) => n - 1);
    const correct = q.answer;
    const wrongs = q.options.filter((o) => o !== correct);
    const keep = [correct, wrongs[Math.floor(Math.random() * wrongs.length)]];
    setMasked(keep);
  }

  function reset() {
    setI(0); setScore(0); setWrong(0); setFood(50); setLifelines(10); setMasked(null);
  }

  const shown = masked ? q.options.filter((o) => masked.includes(o)) : q.options;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <YardBackground />
      <Card className="w-full max-w-2xl rounded-2xl shadow-2xl p-6 bg-white/95 relative z-10">
        <h1 className="text-2xl font-extrabold text-center text-purple-700 drop-shadow mb-2">REA Exam Game</h1>
        <p className="text-center text-sm text-gray-600 mb-4">Question {i+1}/{questions.length} • Score {score} • Wrong {wrong} • Lifelines {lifelines}</p>

        <div className="flex flex-col items-center mb-4">
          <Bowl foodPercent={food} />
        </div>

        <CardContent>
          <motion.p className="text-lg font-semibold mb-4 text-indigo-900" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}>
            {q.q}
          </motion.p>
          <div className="grid gap-3">
            {shown.map((opt, idx) => (
              <Button key={idx} onClick={() => pick(opt)} className="justify-start h-auto whitespace-normal py-3 px-4 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-left shadow">
                {opt}
              </Button>
            ))}
          </div>
        </CardContent>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button onClick={fifty} disabled={lifelines<=0} className="rounded-xl bg-purple-500 hover:bg-purple-600">50/50 ({lifelines} left)</Button>
          <Button variant="secondary" onClick={reset} className="rounded-xl">Reset</Button>
        </div>
      </Card>
    </div>
  );
}
