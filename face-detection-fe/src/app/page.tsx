"use client";

import React from "react";
import Header from "@/components/Header";
import {Hero} from "@/components/Hero";
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
