import { cn } from "@/lib/utils";

export default function TimunWahyuLogo({ className }) {
    return (
        <svg
            viewBox="0 0 100 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-10 w-auto", className)}
        >
            {/* Cucumber Body */}
            <path
                d="M10,20 Q10,5 50,5 T90,20 T50,35 Q10,35 10,20 Z"
                fill="#22c55e"
                className="fill-emerald-500 dark:fill-emerald-400"
            />
            {/* Texture/Seeds */}
            <circle cx="25" cy="15" r="1.5" fill="#166534" opacity="0.3" />
            <circle cx="40" cy="25" r="1.5" fill="#166534" opacity="0.3" />
            <circle cx="60" cy="18" r="1.5" fill="#166534" opacity="0.3" />
            <circle cx="75" cy="22" r="1.5" fill="#166534" opacity="0.3" />
            
            {/* Stylized "W" */}
            <path
                d="M35,15 L45,25 L50,20 L55,25 L65,15"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-white dark:stroke-slate-900"
            />
        </svg>
    );
}
