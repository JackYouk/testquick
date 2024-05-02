import Link from "next/link"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className={`transition-all ease-out duration-500`}>
      <div className="p-6 pt-0 h-screen overflow-hidden w-full flex flex-col items-center justify-center pb-64 md:pb-0 md:justify-start">
        <div className="mb-2 w-full flex justify-center pr-1 transform hover:scale-100 transition-transform duration-300">
          <Logo className="pt-10 text-[24px] md:text-[60px]" />
        </div>
        <Link href="/auth" className="bg-gradient-to-r from-blue-500 to-teal-500 py-2 pl-4 pr-6 md:py-4 md:pl-6 md:pr-8 rounded-lg transform hover:scale-105 transition-transform duration-300">
          <h2
            className={"'__className_54d61b' text-[12px] md:text-[20px] text-background  cursor-pointer"}
            style={{
              fontFamily: "__quicksliver_54d61b",
            }}
          >
            <span className="mr-2">T r y</span>
            <span className="mr-3">N o w</span>
            <span className="mr-3">F o r</span>
            <span className="">F r e e</span>
          </h2>
        </Link>

        <div className="md:w-2/3 mt-10 rounded-lg gradient-glow-box">
          <video
            className="rounded-lg"
            loop
            muted
            playsInline
            autoPlay
          >
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

      </div>

      <div className="absolute z-[-1] bottom-0 w-full">
        <svg
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          id="visual"
          viewBox="0 0 900 600"
          version="1.1"
        >
          <path d="M0 445L129 403L257 430L386 448L514 468L643 455L771 458L900 422L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#fbaa3f" />
          <path d="M0 465L129 481L257 467L386 465L514 501L643 457L771 465L900 489L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#E18B63" />
          <path d="M0 471L129 487L257 506L386 509L514 475L643 512L771 483L900 500L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#C86C88" />
          <path d="M0 507L129 553L257 521L386 549L514 526L643 542L771 519L900 524L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#AF4DAC" />
          <path d="M0 570L129 563L257 562L386 554L514 565L643 569L771 575L900 540L900 601L771 601L643 601L514 601L386 601L257 601L129 601L0 601Z" fill="#962fd1" />
        </svg>
      </div>

    </div>
  )
}
