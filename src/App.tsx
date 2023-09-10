import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import questions from "./assets/questions";
function Button({
  children,
  className,
  color,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      className={twMerge(
        "rounded-xl px-4 py-3 w-full text-xl flex items-center justify-center gap-2 font-bold transition-colors",
        color === "blue"
          ? "bg-blue-200 hover:bg-blue-300 active:bg-blue-400 text-blue-800"
          : "",
        color === "red"
          ? "bg-red-200 hover:bg-red-300 active:bg-red-400 text-red-800"
          : "",
        color === "green"
          ? "bg-green-200 hover:bg-green-300 active:bg-green-400 text-green-800"
          : "",
        color === "teal"
          ? "bg-teal-200 hover:bg-teal-300 active:bg-teal-400 text-teal-800"
          : "",
        className
      )}
      onClick={onClick}
      whileTap={{
        scale: 0.95,
      }}
    >
      {children}
    </motion.button>
  );
}
function App() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [question, setQuestion] = useState(0);
  const [result, setResult] = useState(questions.map(() => 0));
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && hash.length === questions.length) {
      setStep(2);
      setResult(hash.split("").map((i) => parseInt(i)));
    }
  }, []);
  function share() {
    if (navigator.share) {
      navigator.share({
        title: "朋友旅行防止絕交檢查表",
        text: "這是一個用來檢查你是否適合跟朋友一起旅行的檢查表，請誠實回答，不要為了讓自己看起來很適合而作答。",
        url: location.href,
      });
    } else {
      alert("您的瀏覽器不支援分享功能，請手動複製網址");
    }
  }
  function reset() {
    setStep(0);
    setQuestion(0);
    setResult(questions.map(() => 0));
    window.location.hash = "";
  }

  function setAnswer(answer: number) {
    const newResult = [...result];
    newResult[question] = answer;
    setResult(newResult);
    if (question === questions.length - 1) {
      setStep(2);
      window.location.hash = newResult.join("");
    } else {
      setDirection(1);
      setQuestion(question + 1);
    }
  }
  function perviousQuestion() {
    setDirection(-1);
    setQuestion(question - 1);
  }
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 200 : -200,
        opacity: 0,
        scale: 0.8,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 200 : -200,
        opacity: 0,
        scale: 0.8,
      };
    },
  };
  return (
    <div className="flex w-full h-[100svh] flex-col gap-4 p-4">
      {step === 0 && (
        <div className="flex-1 bg-white rounded-xl p-8 flex items-start justify-center flex-col gap-2">
          <i className="bx bx-trip text-6xl mb-2 text-blue-600"></i>
          <div className="text-3xl font-bold">朋友旅行防止絕交檢查表</div>
          <p className="opacity-75">
            這是一份能讓您與朋友在旅行前就透過問題去確認彼此價值觀及旅遊風格是否相符的工具，目的在於避免旅行中因理念不合而引發爭端。
          </p>
        </div>
      )}
      {step === 1 && (
        <>
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center">
            <Button
              color="teal"
              onClick={() => perviousQuestion()}
              className={twMerge(
                "text-base px-3 py-2 w-max",
                question > 0 ? "" : "opacity-0 pointer-events-none"
              )}
            >
              上一題
            </Button>

            <div className="text-xl font-bold text-center opacity-50">
              {question + 1} / {questions.length}
            </div>
          </div>
          <div className="flex-1 relative">
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={direction}
            >
              <motion.div
                key={question}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="bg-white rounded-xl p-8 flex items-start justify-start flex-col gap-2 relative overflow-hidden h-full"
              >
                <div className="text-8xl flex items-center justify-center absolute bottom-4 right-4 opacity-25">
                  <i className={questions[question].icon}></i>
                </div>
                <div className="text-2xl font-bold opacity-25">
                  {questions[question].theme}
                </div>
                <div className="text-4xl font-bold">
                  {questions[question].question}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
      {step === 2 && (
        <div className="flex-1 bg-white rounded-xl p-4 overflow-y-scroll">
          <div className="text-3xl font-bold mb-4">結果</div>
          {questions.map((q, i) => (
            <div
              key={i}
              className={twMerge(
                "flex justify-start mb-1 rounded gap-2 bg-opacity-50",
                result[i] === 1 ? "bg-green-100 text-green-950" : "",
                result[i] === 2 ? "bg-red-100 text-red-950" : "",
                result[i] === 3 ? "bg-teal-100 text-teal-950" : ""
              )}
            >
              <div
                className={twMerge(
                  "flex items-center justify-center text-xl p-2 rounded-l",
                  result[i] === 1 ? "bg-green-200" : "",
                  result[i] === 2 ? "bg-red-200" : "",
                  result[i] === 3 ? "bg-teal-200" : ""
                )}
              >
                {result[i] === 1 && <span>⭕️</span>}
                {result[i] === 2 && <span>❌</span>}
                {result[i] === 3 && <span>❓</span>}
              </div>
              <div className="py-2 flex justify-start items-center">
                {q.question}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {step === 0 && (
          <Button color="blue" onClick={() => setStep(1)}>
            開始
          </Button>
        )}
        {step === 1 && (
          <>
            <Button
              color="green"
              onClick={() => setAnswer(1)}
              className={
                result[question] === 1
                  ? "ring-2 ring-green-400 ring-offset-2"
                  : ""
              }
            >
              ⭕️ 是
            </Button>
            <Button
              color="red"
              onClick={() => setAnswer(2)}
              className={
                result[question] === 2
                  ? "ring-2 ring-red-400 ring-offset-2"
                  : ""
              }
            >
              ❌ 否
            </Button>
            <Button
              color="teal"
              onClick={() => setAnswer(3)}
              className={
                result[question] === 3
                  ? "ring-2 ring-teal-400 ring-offset-2"
                  : ""
              }
            >
              ❓ 有討論空間
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button color="teal" onClick={() => reset()}>
              <i className="bx bx-revision"></i> 重新測驗
            </Button>
            <Button color="blue" onClick={() => share()}>
              <i className="bx bxs-share"></i> 分享結果
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
