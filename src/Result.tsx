import { twMerge } from "tailwind-merge";

function Result({
  question,
  answer,
}: {
  question: string;
  answer: 1 | 2 | 3 | unknown;
}) {
  return (
    <div
      className={twMerge(
        "flex justify-between mb-2 rounded-xl gap-2 bg-opacity-70",
        answer === 1 ? "bg-green-200 text-green-800" : "",
        answer === 2 ? "bg-red-200 text-red-800" : "",
        answer === 3 ? "bg-teal-200 text-teal-800" : "",
      )}>
      <div className="py-2 pl-3 flex justify-start items-center">
        {question}
      </div>
      <div
        className={twMerge(
          "flex items-center justify-center py-2 px-3 rounded-r-xl",
          answer === 1 ? "bg-green-300" : "",
          answer === 2 ? "bg-red-300" : "",
          answer === 3 ? "bg-teal-300" : "",
        )}>
        {answer === 1 && <span>⭕️</span>}
        {answer === 2 && <span>❌</span>}
        {answer === 3 && <span>❓</span>}
        {answer === 4 && <span>未知錯誤</span>}
      </div>
    </div>
  );
}

export default Result;
