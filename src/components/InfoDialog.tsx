import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
    <div className="w-full">
      <div className="opacity-60 text-xs">{subtitle}</div>
      <a href={href} target="_blank" className="font-bold link">
        {title}
      </a>
    </div>
  );
}
export default function InfoDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex justify-end items-center">
        <button
          className="rounded-full w-12 h-12 bg-black bg-opacity-0 hover:bg-opacity-10 active:bg-opacity-20 flex items-center justify-center transition-colors translate-x-3"
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
              className="fixed inset-0 m-auto bg-white bg-opacity-70 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="bg-white shadow-xl rounded-2xl border border-gray-100  w-[min(calc(100vw-52px),480px)] z-10 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button
                className="rounded-full w-8 h-8 bg-black bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-10 flex items-center justify-center transition-colors absolute top-3 right-3"
                onClick={() => setOpen(false)}
              >
                <i className="bx bx-x text-2xl" />
              </button>
              <div className="bg-gray-50 border-b border-gray-100 p-6 flex flex-col gap-4 rounded-t-2xl">
                <div className="flex justify-center items-center">
                  <i className="text-6xl md:text-7xl bx bx-trip text-blue-600"></i>
                </div>
                <div className="flex justify-center items-center text-xl md:text-2xl font-bold -mt-2">
                  朋友旅行防止絕交檢查表
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <p className="text-sm md:text-base">
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
                <p className="text-sm md:text-base">
                  如果這個網站對你有幫助，可以考慮到{" "}
                  <a
                    href="https://www.buymeacoffee.com/gnehs"
                    target="_blank"
                    className="link"
                  >
                    Buy Me A Coffee ☕️
                  </a>{" "}
                  小額抖內支持我！
                </p>
                <p className="text-sm md:text-base">
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
                <div className="flex gap-2 border-t border-gray-100 pt-4">
                  <InfoCard
                    href="https://gnehs.net"
                    title="勝勝"
                    subtitle="開發者"
                  />
                  <InfoCard
                    href="https://pancake.tw"
                    title="🥞"
                    subtitle="Made with"
                  />
                  <InfoCard
                    href="https://github.com/gnehs/travel-questions"
                    title="GitHub"
                    subtitle="原始碼"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
