import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useLocalStorage } from "usehooks-ts";
import urlParser from "url-parse";
import questions from "./assets/questions";
import Result from "./components/Result";
import Button from "./components/Button";
const BASE_URL = "https://travel-questions.gnehs.net";
const SUPPORT_URL_LIST = [BASE_URL];
import BottomButtonContainer from "./components/BottomButtonContainer";
import InfoDialog from "./components/InfoDialog";

function parseAnswer(answer = "") {
  const formattedAnswer = parseInt(answer);
  return [1, 2, 3].includes(formattedAnswer) ? formattedAnswer : 4;
}

function parseQuestionResultFromQueryString(
  url = ""
): Array<[string, number[]]> | null {
  if (!url) {
    return null;
  }

  const { hash, query } = urlParser(url, true);
  const formattedHash = hash.replace("#", "");

  if (formattedHash && formattedHash.length === questions.length) {
    return [["me", formattedHash.split("").map(parseAnswer)]];
  }

  if (query) {
    const multiResult: Array<[string, number[]]> = (
      Object.entries(query) as string[][]
    )
      .filter(([, value]) => value.length === questions.length)
      .map(([key, value]) => [key, value.split("").map(parseAnswer)]);

    return multiResult.length > 0 ? multiResult : null;
  }

  return null;
}

function App() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [question, setQuestion] = useState(0);
  const [urlResult, setUrlResult] = useState<string>("");
  const [result, setResult] = useState(questions.map(() => 0));
  const [otherResultList, setOtherResultList] = useState<number[][] | null>(
    null
  );
  const [name, setName] = useLocalStorage("name", "");
  const nameInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.location.hash && !window.location.search) {
      return;
    }
    const hash = window.location.hash.replace("#", "");

    // 移除 hash 重新導向並加上 search
    if (hash && hash.length === questions.length) {
      const newLink = window.location.origin + `?me=${hash}`;
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

    setResult(perviousResult[0][1] as number[]);

    // 有多個結果
    if (perviousResult.length > 1) {
      const otherResults = perviousResult.slice(1);
      updateOtherResultList(otherResults);
    }

    setStep(2);
  }, []);
  useEffect(() => {
    if (step === 1) {
      nameInput.current?.focus();
    }
  }, [step]);

  function getShareUrl() {
    const formattedOtherResultList = otherResultList
      ? otherResultList
          .reduce<number[][]>((result, current) => {
            current.map((answer, index) => {
              if (!result[index]) {
                result[index] = [];
              }
              result[index].push(answer);
            });

            return result;
          }, [])
          .map((result, index) => {
            return `&${String.fromCharCode(97 + index)}=${result.join("")}`;
          })
          .join("")
      : "";

    return `${BASE_URL}?me=${result.join("")}${formattedOtherResultList}`;
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

  function resetWithNewUser() {
    updateStep(0);
    setQuestion(0);
    setResult(questions.map(() => 0));
    if (otherResultList) {
      const newResultList = otherResultList.map((question, index) => {
        question.push(result[index]);
        return question;
      });
      setOtherResultList(newResultList);
    } else {
      setOtherResultList(result.map((answer) => [answer]));
    }
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

  function updateOtherResultList(list: Array<[string, number[]]>) {
    const formattedResultList = list.reduce<number[][]>(
      (acc, curr) => {
        const result = curr[1];
        result.forEach((answer, index) => {
          acc[index].push(answer);
        });
        return acc;
      },
      Array.from({ length: questions.length }, () => Array<number>())
    );

    if (!otherResultList) {
      setOtherResultList(formattedResultList);
    } else {
      const newResultList = formattedResultList.map((result, index) => {
        return [...otherResultList[index], ...result];
      });
      setOtherResultList(newResultList);
    }
  }

  function onUrlBtnClick() {
    if (!urlResult) return;
    const formattedUrl = urlResult.trim();
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
    updateOtherResultList(result);
    setUrlResult("");
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
        <div className="-mt-2 mb-2 ">
          <div className="flex justify-between items-center">
            <span className="md:text-xl font-bold">結果</span>
            <InfoDialog />
          </div>
          <div>
            <div className="md:text-xl font-medium">
              想對照朋友的結果嗎？把他的連結貼上來吧！
            </div>
            <div className="flex justify-between items-center">
              <input
                type="text"
                className="flex-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="在這裡貼上朋友的連結"
                value={urlResult}
                onChange={(e) => setUrlResult(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onUrlBtnClick()}
              />
              <button
                className="ml-2 py-2 px-2 flex-none rounded-lg bg-green-200 border border-gray-300 hover:bg-green-300 active:bg-green-400"
                onClick={onUrlBtnClick}
              >
                送出
              </button>
            </div>
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
            <div className="flex-1 rounded-lg p-4 flex items-start justify-center flex-col gap-3 md:gap-4 border-2 border-gray-100">
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
                  className="bg-transparent border-b-2 border-gray-100 text-xl text-gray-900  focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 outline-0"
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
            {otherResultList && (
              <div className="flex justify-between mb-2 rounded-xl gap-2 bg-opacity-70">
                <div className="py-2 pl-3 grow-1 shrink-0 basis-1/2 justify-start items-center opacity-0">
                  {questions[0].question}
                </div>
                <div className="flex items-center">
                  <div className="py-2 text-center bg-pink-200  w-10">Me</div>
                  {otherResultList[0].map((_, index) => (
                    <div
                      key={index}
                      className={twMerge(
                        "py-2 w-10 text-center border-solid border-l-2 border-l-blue-50",
                        index % 2 === 0 ? "bg-blue-300" : "bg-blue-500",
                        index === otherResultList[0].length - 1 &&
                          "rounded-r-xl"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              {questions.map((q, i) => (
                <Result
                  key={i}
                  question={q.question}
                  answer={result[i]}
                  otherAswerList={otherResultList && otherResultList[i]}
                />
              ))}
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
                <i className="bx bx-revision"></i> 重新開始
              </Button>
              <Button color="green" onClick={() => resetWithNewUser()}>
                <i className="bx bx-plus"></i> 新增使用者
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
