import { twMerge } from "tailwind-merge";
import questions from "../assets/questions";
import { useLocalStorage } from "usehooks-ts";
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
  const [username] = useLocalStorage("name", "");
  const names = filterResultListWithAnswer(question, answer, resultList);
  const bgColor = [
    "bg-green-200 text-green-800 from-green-100",
    "bg-red-200 text-red-800 from-red-100",
    "bg-yellow-200 text-yellow-800 from-yellow-100",
  ][answer - 1];
  return (
    names.length > 0 && (
      <div
        className={twMerge(
          "text-sm grid grid-cols-[auto_1fr] items-start rounded last:rounded-b-lg overflow-hidden"
        )}
      >
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
            "px-3 py-2 bg-opacity-50 h-full flex flex-col gap-0.5 justify-center bg-gradient-to-r to-gray-50 shadow-2xl",
            bgColor
          )}
        >
          {names.map((name) => (
            <div
              key={name}
              className={twMerge(username === name && "font-bold")}
            >
              {name}
            </div>
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
      <div className="mb-2 rounded-xl bg-white text-gray-900 relative overflow-hidden p-1 flex flex-col gap-1">
        <div className="px-3 text-sm py-1 font-bold flex gap-4 items-center justify-between">
          {questionText}
          <i className={`text-xl ${icon} opacity-50`}></i>
        </div>
        <Answer question={index} answer={1} resultList={resultList} />
        <Answer question={index} answer={2} resultList={resultList} />
        <Answer question={index} answer={3} resultList={resultList} />
      </div>
    );
  });
}

export default Result;
