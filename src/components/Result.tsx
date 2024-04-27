import { twMerge } from "tailwind-merge";
import questions from "../assets/questions";
function filterResultListWithAnswer(
  question: number,
  answer: number,
  resultList: { [key: string]: number[] }
) {
  return Object.keys(resultList).filter((key) => {
    return resultList[key][question] === answer;
  });
}

function Answer({
  question,
  answer,
  resultList,
}: {
  question: number;
  answer: number;
  resultList: { [key: string]: number[] };
}) {
  const names = filterResultListWithAnswer(question, answer, resultList);
  const bgColor = [
    "bg-green-300 text-green-800",
    "bg-red-300 text-red-800",
    "bg-yellow-300 text-yellow-800",
  ][answer - 1];
  return (
    names.length > 0 && (
      <div className={twMerge("text-sm grid grid-cols-[2em_auto] items-start")}>
        <div
          className={twMerge(
            "flex items-center justify-center px-4 py-2 h-full",
            bgColor
          )}
        >
          {answer === 1 && `⭕️`}
          {answer === 2 && `❌`}
          {answer === 3 && `❓`}
        </div>
        <div
          className={twMerge(
            "px-4 py-2 bg-opacity-50 h-full flex flex-col gap-0.5 justify-center",
            bgColor
          )}
        >
          {names.map((name) => (
            <div key={name}>{name}</div>
          ))}
        </div>
      </div>
    )
  );
}
function Result({
  resultList = {},
}: {
  resultList?: {
    [key: string]: number[];
  };
}) {
  return questions.map((question, index) => {
    const { question: questionText, icon } = question;
    return (
      <div className="mb-2 rounded-xl bg-white text-gray-900 relative overflow-hidden">
        <div className="px-2 py-2 text-sm font-bold flex gap-4 items-center">
          <i className={`text-lg ${icon} `}></i>
          {questionText}
        </div>
        <Answer question={index} answer={1} resultList={resultList} />
        <Answer question={index} answer={2} resultList={resultList} />
        <Answer question={index} answer={3} resultList={resultList} />
      </div>
    );
  });
}

export default Result;
