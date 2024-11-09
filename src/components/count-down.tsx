"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
    const [hours, setHours] = useState<number | string>("");
    const [minutes, setMinutes] = useState<number | string>("");
    const [seconds, setSeconds] = useState<number | string>("");
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleSetDuration = (): void => {
        const totalSeconds =
            (Number(hours) || 0) * 3600 +
            (Number(minutes) || 0) * 60 +
            (Number(seconds) || 0);

        if (totalSeconds > 0) {
            setTimeLeft(totalSeconds);
            setIsActive(false);
            setIsPaused(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const handleStart = (): void => {
        if (timeLeft > 0) {
            setIsActive(true);
            setIsPaused(false);
        }
    };

    const handlePauseResume = (): void => {
        if (isActive && !isPaused) {
            setIsPaused(true);
            setIsActive(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        } else if (isPaused) {
            setIsPaused(false);
            setIsActive(true);
        }
    };

    const handleReset = (): void => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    useEffect(() => {
        if (isActive && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, isPaused]);

    const formatTime = (time: number): [string, string, string] => {
        const hrs = String(Math.floor(time / 3600)).padStart(2, "0");
        const mins = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
        const secs = String(time % 60).padStart(2, "0");
        return [hrs, mins, secs];
    };

    const [formattedHours, formattedMinutes, formattedSeconds] = formatTime(timeLeft);

    const handleChange = (setter: React.Dispatch<React.SetStateAction<number | string>>) => (e: ChangeEvent<HTMLInputElement>): void => {
        setter(Number(e.target.value) || "");
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
            >
                <source src="/video.mp4" type="video/mp4" />
            </video>
            <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black bg-opacity-50 ">
                <div className="bg-white bg-opacity-70 rounded-xl p-8 shadow-lg text-center flex flex-col items-center space-y-6 w-[80%] max-w-lg">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6 ">COUNTDOWN TIMER</h1>
                    <div className="flex space-x-4 text-center text-gray-800">
                        <div className="flex flex-col items-center w-24">
                            <span className="font-semibold text-lg">Hours</span>
                            <span className="text-5xl font-mono border-b-2 border-gray-400">{formattedHours}</span>
                        </div>
                        <div className="flex flex-col items-center w-24">
                            <span className="font-semibold text-lg">Minutes</span>
                            <span className="text-5xl font-mono border-b-2 border-gray-400">{formattedMinutes}</span>
                        </div>
                        <div className="flex flex-col items-center w-24">
                            <span className="font-semibold text-lg">Seconds</span>
                            <span className="text-5xl font-mono border-b-2 border-gray-400">{formattedSeconds}</span>
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-2 justify-center">
                        <Input
                            type="number"
                            placeholder="Hours"
                            value={hours}
                            onChange={handleChange(setHours)}
                            className="text-center border border-gray-900 bg-transparent w-20 text-gray-800 placeholder-gray-500 focus:outline-none"
                        />
                        <Input
                            type="number"
                            placeholder="Minutes"
                            value={minutes}
                            onChange={handleChange(setMinutes)}
                            className="text-center border border-gray-900 bg-transparent w-20 text-gray-800 placeholder-gray-500 focus:outline-none"
                        />
                        <Input
                            type="number"
                            placeholder="Seconds"
                            value={seconds}
                            onChange={handleChange(setSeconds)}
                            className="text-center border border-gray-900 bg-transparent w-20 text-gray-800 placeholder-gray-500 focus:outline-none"
                        />
                        <Button onClick={handleSetDuration} className="bg-blue-800  text-white hover:bg-blue-900 hover:text-white px-4 py-2 rounded">
                            Set
                        </Button>
                    </div>
                    <div className="mt-4 flex space-x-4">
                        <Button onClick={handleStart} className="bg-yellow-700  text-white hover:bg-gray-800 hover:text-white px-4 py-2 rounded">
                            Start
                        </Button>
                        <Button onClick={handlePauseResume} className="bg-green-800 text-white hover:bg-green-900 hover:text-white px-4 py-2 rounded">
                            {isPaused ? "Resume" : "Pause"}
                        </Button>
                        <Button onClick={handleReset} className="bg-red-800  text-white hover:bg-red-900 hover:text-white px-4 py-2 rounded-md">
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
