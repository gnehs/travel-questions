import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import useAnswer from "./hooks/useAnswer";
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
        "rounded-xl p-2 md:p-3 w-full md:text-xl flex items-center justify-center gap-2 font-bold transition-colors",
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
  const { encode, decode } = useAnswer();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [question, setQuestion] = useState(0);
  const [result, setResult] = useState(questions.map(() => 0));
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && hash.length === questions.length) {
      setResult(hash.split("").map((i) => parseInt(i)));
      setStep(2);
    } else if (hash.length) {
      try {
        const decoded = decode(hash);
        console.log(decoded, decoded.length, questions.length);
        if (decoded.length === questions.length) {
          setResult(
            decode(hash)
              .split("")
              .map((i: string) => parseInt(i))
          );
          setStep(2);
        }
      } catch (e) {
        console.error(e);
        window.location.hash = "";
      }
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
      window.location.hash = encode(newResult.join(""));
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
    <div className="flex w-full h-[100svh] flex-col gap-2 p-4">
      {step === 0 && (
        <div className="flex-1 bg-white rounded-xl p-8 flex items-start justify-center flex-col gap-2 relative">
          <div className="text-8xl flex items-center justify-center absolute bottom-4 right-4 opacity-25">
            <i className="bx bx-trip text-blue-600"></i>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-bold"
          >
            朋友旅行防止絕交檢查表
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="md:text-xl opacity-75"
          >
            這是一份能讓您與朋友在旅行前就透過問題去確認彼此價值觀及旅遊風格是否相符的工具，目的在於避免旅行中因理念不合而引發爭端。
          </motion.p>
        </div>
      )}
      {step === 1 && (
        <>
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center -mt-2">
            <Button
              color="teal"
              onClick={() => perviousQuestion()}
              className={twMerge(
                "text-base px-2 py-1 md:px-3 md:py-2 w-max",
                question > 0 ? "" : "opacity-0 pointer-events-none"
              )}
            >
              <i className="bx bx-arrow-back"></i>上一題
            </Button>

            <div className="md:text-xl font-bold text-center">
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
                className="bg-white rounded-xl p-8 flex items-start justify-start flex-col gap-1 md:gap-2 relative overflow-hidden h-full overflow-y-scroll "
              >
                <div className="text-6xl md:text-8xl flex items-center justify-center absolute bottom-4 right-4 opacity-25">
                  <i className={questions[question].icon}></i>
                </div>
                <div className="md:text-2xl font-bold opacity-25">
                  {questions[question].theme}
                </div>
                <div className="text-2xl md:text-4xl font-bold">
                  {questions[question].question}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center -mt-2">
            <div></div>

            <div className="md:text-xl font-bold text-center py-1">結果</div>
          </div>
          <div className="flex-1 rounded overflow-y-scroll">
            {questions.map((q, i) => (
              <div
                key={i}
                className={twMerge(
                  "flex justify-between mb-2 rounded-xl gap-2 bg-opacity-70",
                  result[i] === 1 ? "bg-green-200 text-green-800" : "",
                  result[i] === 2 ? "bg-red-200 text-red-800" : "",
                  result[i] === 3 ? "bg-teal-200 text-teal-800" : ""
                )}
              >
                <div className="py-2 pl-3 flex justify-start items-center">
                  {q.question}
                </div>
                <div
                  className={twMerge(
                    "flex items-center justify-center py-2 px-3 rounded-r-xl",
                    result[i] === 1 ? "bg-green-300" : "",
                    result[i] === 2 ? "bg-red-300" : "",
                    result[i] === 3 ? "bg-teal-300" : ""
                  )}
                >
                  {result[i] === 1 && <span>⭕️</span>}
                  {result[i] === 2 && <span>❌</span>}
                  {result[i] === 3 && <span>❓</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex flex-col gap-2">
        {step === 0 && (
          <Button color="blue" onClick={() => setStep(1)}>
            開始<i className="bx bx-arrow-back bx-rotate-180"></i>
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
            <div className="flex gap-2">
              <Button color="teal" onClick={() => reset()}>
                <i className="bx bx-revision"></i> 重新測驗
              </Button>
              <Button color="blue" onClick={() => share()}>
                <i className="bx bxs-share"></i> 分享結果
              </Button>
            </div>
            <div className="opacity-50 text-xs text-center">
              Developed by{" "}
              <a href="https://gnehs.net" className="link">
                gnehs
              </a>{" "}
              | Made with{" "}
              <a href="https://pancake.tw" className="link">
                🥞
              </a>{" "}
              in Taiwan |{" "}
              <a
                href="https://github.com/gnehs/travel-questions"
                className="link"
              >
                Source Code
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
