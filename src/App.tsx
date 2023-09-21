import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import questions from "./assets/questions";
function BottomButtonContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        height: 0,
        overflow: "hidden",
        marginTop: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        height: "auto",
        overflow: "initial",
        marginTop: 8,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        height: 0,
        overflow: "hidden",
        marginTop: 0,
      }}
      className="flex flex-col gap-2"
    >
      {children}
    </motion.div>
  );
}
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
        "rounded-xl p-2 md:p-3 w-full md:text-xl flex items-center justify-center gap-2 font-bold transition-colors group",
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
        color === "stone"
          ? "bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-800"
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
function InfoCard({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className="rounded border border-gray-100 px-4 py-2 w-full bg-gray-500 bg-opacity-0 hover:bg-opacity-20 active:bg-opacity-40 transition-colors"
    >
      <div className="font-bold">{title}</div>
      <div className="opacity-60 text-sm">{subtitle}</div>
    </a>
  );
}
function InfoDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex justify-end items-center">
        <button
          className="rounded-full w-12 h-12 bg-black bg-opacity-0 hover:bg-opacity-10 active:bg-opacity-20 flex items-center justify-center transition-colors"
          onClick={() => setOpen(true)}
        >
          <i className="bx bx-info-circle text-2xl"></i>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <div
              className="fixed inset-0 m-auto bg-black bg-opacity-50 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="bg-white shadow-xl rounded-xl p-4 flex flex-col gap-2 w-[min(calc(100vw-52px),480px)] z-10"
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 100,
              }}
            >
              <div className="flex justify-between items-center text-xl font-bold">
                關於
                <button
                  className="rounded-full w-8 h-8 bg-black bg-opacity-0 hover:bg-opacity-10 active:bg-opacity-20 flex items-center justify-center transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <i className="bx bx-x text-2xl" />
                </button>
              </div>
              <p>
                本網站的大部分問題來自 Facebook 的{" "}
                <a
                  href="https://www.facebook.com/lakuyuki/posts/pfbid02nPJ7d7F3i1trHVpXbjDYp5hzkrUcQBHCWgGgQTxNYSk7ER6CEXwW3dHEJxdFdDjDl"
                  target="_blank"
                  className="link"
                >
                  這篇文章
                </a>
                。
              </p>
              <p>
                另外你也可以到{" "}
                <a
                  href="https://github.com/gnehs/travel-questions"
                  target="_blank"
                  className="link"
                >
                  GitHub
                </a>{" "}
                幫我按個星星，有任何問題的話也可以在 GitHub 上開 Issue。
              </p>
              <div className="flex gap-2">
                <InfoCard
                  href="https://gnehs.net"
                  title="勝勝"
                  subtitle="開發者"
                />
                <InfoCard
                  href="https://github.com/gnehs/travel-questions"
                  title="GitHub"
                  subtitle="原始碼"
                />
                <InfoCard
                  href="https://pancake.tw"
                  title="🥞"
                  subtitle="Made with"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
      setResult(hash.split("").map((i) => parseInt(i)));
      setStep(2);
    } else if (hash.length) {
      window.location.hash = "";
    }
  }, []);
  function share() {
    if (navigator.share) {
      navigator.share({
        title: "朋友旅行防止絕交檢查表",
        url: `https://travel-questions.gnehs.net/#${result.join("")}`,
      });
    } else {
      alert("您的瀏覽器不支援分享功能，請手動複製網址");
    }
  }
  function reset() {
    updateStep(0);
    setQuestion(0);
    setResult(questions.map(() => 0));
    window.location.hash = "";
  }
  function updateStep(i: number) {
    setDirection(step < i ? 1 : -1);
    setStep(i);
  }

  function setAnswer(answer: number) {
    const newResult = [...result];
    newResult[question] = answer;
    setResult(newResult);
    if (question === questions.length - 1) {
      updateStep(2);
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
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.9,
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
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        scale: 0.9,
      };
    },
  };
  return (
    <div className="flex w-full h-[100svh] flex-col p-4">
      {step === 0 && (
        <div className="py-1 -mt-2 mb-2 flex justify-between items-center pl-4">
          <span className="md:text-xl font-bold">朋友旅行防止絕交檢查表</span>
          <InfoDialog />
        </div>
      )}
      {step === 1 && (
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center -mt-2 mb-2">
          <Button
            color="stone"
            onClick={() => perviousQuestion()}
            className={twMerge(
              "text-base px-2 py-1 md:px-3 md:py-2 w-max",
              question > 0 ? "" : "opacity-0 pointer-events-none"
            )}
          >
            <i className="bx bx-arrow-back"></i>上一題
          </Button>

          <div className="md:text-xl font-bold text-center tabular-nums">
            {`${question + 1}`.padStart(2, `0`)} / {questions.length}
          </div>
          <InfoDialog />
        </div>
      )}
      {step === 2 && (
        <div className="py-1 -mt-2 mb-2 flex justify-between items-center">
          <span className="md:text-xl font-bold">結果</span>
          <InfoDialog />
        </div>
      )}
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        {step === 0 && (
          <motion.div
            key={0}
            layout
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 bg-white rounded-xl p-4 flex items-start justify-center flex-col"
          >
            <div className="flex-1 rounded-lg p-4 flex items-start justify-center flex-col gap-4 border-2 border-gray-100">
              <i className="text-8xl bx bx-trip text-blue-600"></i>
              <div className="text-xl md:text-3xl font-bold">
                朋友旅行防止絕交檢查表
              </div>
              <div className="md:text-xl opacity-50">
                這是能讓您與朋友在旅行前就透過問題去確認彼此價值觀及旅遊風格是否相符的工具，目的在於避免旅行中因理念不合而引發爭端。
              </div>
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key={1}
            layout
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 relative"
          >
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
                className="bg-white rounded-xl p-8 flex items-start justify-start flex-col gap-1 md:gap-2 relative overflow-hidden h-full overflow-y-scroll"
              >
                <div
                  className="text-6xl md:text-8xl flex items-center justify-center absolute bottom-4 right-4 opacity-25"
                  key={question}
                >
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
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key={2}
            layout
            variants={variants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 rounded overflow-y-scroll"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {step === 0 && (
          <BottomButtonContainer key={0}>
            <Button color="blue" onClick={() => updateStep(1)}>
              開始
              <i className="bx bx-arrow-back rotate-180 group-hover:translate-x-1 transition-transform"></i>
            </Button>
          </BottomButtonContainer>
        )}
        {step === 1 && (
          <BottomButtonContainer key={1}>
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
          </BottomButtonContainer>
        )}
        {step === 2 && (
          <BottomButtonContainer key={2}>
            <div className="flex gap-2">
              <Button color="teal" onClick={() => reset()}>
                <i className="bx bx-revision"></i> 重新開始
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
              |{" "}
              <a
                href="https://github.com/gnehs/travel-questions"
                className="link"
              >
                Source Code
              </a>
            </div>
          </BottomButtonContainer>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
