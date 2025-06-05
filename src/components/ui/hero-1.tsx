"use client";

import * as React from "react";
import { Paperclip, Sparkles, Hexagon } from "lucide-react"; // Added Hexagon
import { Link } from "react-router-dom"; // Added Link

const Hero1 = () => {
  return (
    <div className="min-h-screen bg-[#0c0414] text-white flex flex-col relative overflow-x-hidden">
      {/* Gradient */}
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-40rem] right-[-30rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        {/* Corrected bg-linear-90 to bg-gradient-to-b */}
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-50rem] right-[-50rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[20rem] bg-gradient-to-b from-white to-blue-300"></div>
      </div>
      <div className="flex gap-[10rem] rotate-[-20deg] absolute top-[-60rem] right-[-60rem] z-[0] blur-[4rem] skew-[-40deg]  opacity-50">
        <div className="w-[10rem] h-[30rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem] bg-gradient-to-b from-white to-blue-300"></div>
        <div className="w-[10rem] h-[30rem] bg-gradient-to-b from-white to-blue-300"></div>
      </div>
      {/* Header */}
      <header className="flex justify-between items-center p-6 z-10"> {/* Added z-10 to header */}
        <div className="flex items-center gap-2">
          {/* Replaced img with Lucide icon */}
          <Hexagon className="w-7 h-7 text-white" />
          <div className="font-bold text-md">HextaAI</div>
        </div>
        {/* Changed button to Link */}
        <Link
          to="/signup"
          className="bg-white text-black hover:bg-gray-200 rounded-full px-4 py-2 text-sm cursor-pointer font-semibold"
        >
          Get Started
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center z-10"> {/* Added z-10 to main */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex-1 flex justify-center">
            <div className="bg-[#1c1528] rounded-full px-4 py-2 flex items-center gap-2  w-fit mx-4">
              <span className="text-xs flex items-center gap-2">
                <span className="bg-black p-1 rounded-full">🥳</span>
                Introducing Magic Components
              </span>
            </div>
          </div>
          {/* Headline */}
          <h1 className="text-5xl font-bold leading-tight">
            Build Stunning websites effortslessly
          </h1>

          {/* Subtitle */}
          <p className="text-md">
            HextaAI can create amazing websites with few lines of prompt.
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="bg-[#1c1528] rounded-full p-3 flex items-center">
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-[#2a1f3d] transition-all">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </button>
              <input
                type="text"
                placeholder="How HextaAI can help you today?"
                className="bg-transparent flex-1 outline-none text-gray-300 pl-4"
              />
            </div>
          </div>

          {/* Suggestion pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-12 max-w-2xl mx-auto">
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Launch a blog with Astro
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Develop an app using NativeScript
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Build documentation with Vitepress
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Generate UI with shadcn
            </button>
            <button className="bg-[#1c1528] hover:bg-[#2a1f3d] rounded-full px-4 py-2 text-sm">
              Generate UI with HextaUI
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export { Hero1 };
