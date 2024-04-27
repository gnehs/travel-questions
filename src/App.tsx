import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useLocalStorage } from "usehooks-ts";
import urlParser from "url-parse";
import questions from "./assets/questions";
import Result from "./components/Result";
import Button from "./components/Button";
import { encode, decode } from "./utils/encodeResult";
const BASE_URL = "https://travel-questions.gnehs.net";
const SUPPORT_URL_LIST = [BASE_URL, "http://localhost:5173"];
import BottomButtonContainer from "./components/BottomButtonContainer";
import InfoDialog from "./components/InfoDialog";

function parseAnswer(answer = "") {
  const formattedAnswer = parseInt(answer);
  return [1, 2, 3].includes(formattedAnswer) ? formattedAnswer : 4;
}

function parseQuestionResultFromQueryString(
  url = ""
): { [key: string]: number[] } | null {
  if (!url) {
    return null;
  }

  const { hash, query } = urlParser(url, true);
  const formattedHash = hash.replace("#", "");

  if (formattedHash && formattedHash.length === questions.length) {
    return { user: formattedHash.split("").map(parseAnswer) };
  }

  if (query) {
    let res: { [key: string]: number[] } = {};
    for (let [name, value] of Object.entries(query)) {
      if (name && value) {
        if (value.length === questions.length) {
          res[name] = value.split("").map(parseAnswer);
        } else {
          res[name] = decode(value);
        }
      }
    }
    return res;
  }

  return null;
}

function App() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [question, setQuestion] = useState(0);
  const [result, setResult] = useState(questions.map(() => 0));
  const [resultList, setResultList] = useState<{
    [key: string]: number[];
  } | null>(null);
  const [name, setName] = useLocalStorage("name", "");
  const nameInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.location.hash && !window.location.search) {
      return;
    }
    const hash = window.location.hash.replace("#", "");

    // 移除 hash 重新導向並加上 search
    if (hash && hash.length === questions.length) {
      const newLink = window.location.origin + `?user=${hash}`;
      window.location.assign(newLink);
      return;
    }

    const perviousResult = parseQuestionResultFromQueryString(
      window.location.href
    );

    if (!perviousResult) {
      window.location.assign(window.location.origin);
      return;
    }

    setResultList(perviousResult);
    setStep(3);
  }, []);
  useEffect(() => {
    if (step === 1) {
      nameInput.current?.focus();
    }
  }, [step]);

  function getShareUrl() {
    const formattedOtherResultList = Object.entries(resultList || {}).reduce(
      (acc, [name, result]) => {
        return `${acc}&${encodeURIComponent(name)}=${encode(result)}`;
      },
      ""
    );

    return `${BASE_URL}?${formattedOtherResultList}`;
  }
  async function share() {
    const url = getShareUrl();

    if (navigator.share) {
      navigator.share({
        title: "朋友旅行防止絕交檢查表",
        url,
      });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("已複製網址到剪貼簿");
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
      setResultList({ [name]: newResult, ...resultList });
      updateStep(3);
    } else {
      setDirection(1);
      setQuestion(question + 1);
    }
  }
  function perviousQuestion() {
    setDirection(-1);
    setQuestion(question - 1);
  }

  function onUrlBtnClick(url: string) {
    if (!url) return;
    const formattedUrl = url.trim();
    const isValid = SUPPORT_URL_LIST.some((url) =>
      formattedUrl.trim().startsWith(url)
    );

    if (!isValid) {
      alert("請貼上正確的網址");
      return;
    }
    const result = parseQuestionResultFromQueryString(formattedUrl);

    if (!result) {
      alert("請貼上正確的網址");
      return;
    }

    setResultList({ ...result, ...resultList });
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
    <div className="flex w-full h-[100dvh] flex-col p-2 md:p-4">
      {step <= 1 && (
        <div className="-mt-2 mb-2 flex justify-between items-center">
          <span className="md:text-xl font-bold">朋友旅行防止絕交檢查表</span>
          <InfoDialog />
        </div>
      )}
      {step === 2 && (
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center -mt-2 mb-2">
          <Button
            color="stone"
            onClick={() => perviousQuestion()}
            className={twMerge(
              "text-base px-2 md:px-3 md:py-2 w-max",
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
      {step === 3 && (
        <div className="-mt-2 mb-2">
          <div className="flex justify-between items-center">
            <span className="md:text-xl font-bold">結果</span>
            <InfoDialog />
          </div>
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
            <div className="flex-1 rounded-lg p-4 flex items-start justify-center flex-col gap-3 md:gap-4 border-2 border-gray-100">
              <i className="text-8xl bx bx-trip text-blue-600"></i>
              <div className="text-xl md:text-3xl font-bold">
                朋友旅行防止絕交檢查表
              </div>
              <div className="text-sm -mt-1 md:mt-0 md:text-xl opacity-50">
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
            className="flex-1 bg-white rounded-xl p-4 flex items-start justify-center flex-col"
          >
            <div className="flex-1 rounded-lg p-4 flex items-start justify-center flex-col gap-3 md:gap-4 border-2 border-gray-100 w-full">
              <i className="text-8xl bx bx-user text-blue-600"></i>
              <div className="text-xl md:text-3xl font-bold">你的暱稱是？</div>
              <div className="text-sm -mt-1 md:mt-0 md:text-xl opacity-50">
                請在下方輸入您的暱稱，以便於分享結果時辨識。
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (name === "") {
                    alert("請輸入暱稱");
                    return;
                  }
                  updateStep(2);
                }}
                className="w-full"
              >
                <input
                  type="text"
                  className="bg-transparent border-b-2 border-gray-100 text-xl text-gray-900  focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 outline-0 rounded-none transition-colors duration-200 ease-in-out"
                  placeholder="請輸入暱稱"
                  ref={nameInput}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </form>
            </div>
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
        {step === 3 && (
          <div className="w-full overflow-y-scroll">
            <motion.div
              key={3}
              layout
              variants={variants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 rounded"
            >
              <button
                className="bg-slate-200 text-slate-800 rounded-xl mb-2 py-2 px-4 flex justify-between gap-2 w-full items-center font-black"
                onClick={() => {
                  let url = prompt("請輸入朋友的結果連結");
                  if (url) {
                    onUrlBtnClick(url);
                  }
                }}
              >
                加入朋友的結果
                <i className="bx bx-plus"></i>
              </button>
              <Result resultList={resultList ?? {}} />
            </motion.div>
          </div>
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
          <BottomButtonContainer key={0}>
            <Button
              color="blue"
              onClick={() => {
                if (name === "") {
                  alert("請輸入暱稱");
                  return;
                }
                updateStep(2);
              }}
            >
              下一步
              <i className="bx bx-arrow-back rotate-180 group-hover:translate-x-1 transition-transform"></i>
            </Button>
          </BottomButtonContainer>
        )}
        {step === 2 && (
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
        {step === 3 && (
          <BottomButtonContainer key={2}>
            <div className="flex gap-2">
              <Button color="teal" onClick={() => reset()}>
                {Object.keys(resultList || {}).includes(name) ? (
                  <>
                    <i className="bx bx-revision"></i> 重新開始
                  </>
                ) : (
                  <>
                    {" "}
                    <i className="bx bx-plus"></i> 新增我的結果
                  </>
                )}
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
