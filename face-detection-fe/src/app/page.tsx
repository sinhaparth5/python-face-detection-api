"use client";

import React from "react";
import Header from "@/components/Header";
import {Hero} from "@/components/Hero";
import {BentoGrid} from "@/components/magicui/bento-grid";
import {BentoDemo} from "@/components/Projects";

export default function Home() {
  return (
      <>
        <Header />
        <Hero />
          <div className="container">
            <BentoDemo />
          </div>
      </>
  );
}
