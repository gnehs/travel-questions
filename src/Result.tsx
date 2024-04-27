import { twMerge } from "tailwind-merge";

function Answer({ answer, className }: { answer: number; className?: string }) {
  return (
    <div
      className={twMerge(
        "my-answer flex items-center justify-center py-2 px-3  w-10 h-full",
        answer === 1 ? "bg-green-300" : "",
        answer === 2 ? "bg-red-300" : "",
        answer === 3 ? "bg-teal-300" : "",
        className
      )}
    >
      {answer === 1 && <span>⭕️</span>}
      {answer === 2 && <span>❌</span>}
      {answer === 3 && <span>❓</span>}
      {answer === 4 && <span>未知錯誤</span>}
    </div>
  );
}

function Result({
  question,
  answer,
  otherAswerList,
}: {
  question: string;
  answer: number;
  otherAswerList?: number[] | null;
}) {
  return (
    <div
      className={twMerge(
        "flex justify-between mb-2 rounded-xl gap-2 bg-opacity-70",
        answer === 1 ? "bg-green-200 text-green-800" : "",
        answer === 2 ? "bg-red-200 text-red-800" : "",
        answer === 3 ? "bg-teal-200 text-teal-800" : ""
      )}
    >
      <div className="py-2 pl-3 grow-1 shrink-0 basis-1/2 justify-start items-center">
        {question}
      </div>
      <div className="flex items-center">
        <Answer answer={answer} />
        {otherAswerList?.map((otherAnswer, index) => (
          <Answer
            key={index}
            answer={otherAnswer}
            className={
              index === otherAswerList.length - 1
                ? "rounded-r-xl border-solid border-l-2 border-l-blue-50"
                : " border-solid border-l-2"
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Result;
