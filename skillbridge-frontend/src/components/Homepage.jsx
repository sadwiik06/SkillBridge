"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "./ui/AuroraBackground";
import { SkillBridgeHero, ProjectEscrowHero, ServiceCarousel, Footer } from "./SkillBridgeHero";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <AuroraBackground>
       <div className="flex flex-col gap-20 items-center pb-10 w-full">
          <SkillBridgeHero />
          
          <ProjectEscrowHero 
            headline="Automated Escrow for Every Milestone"
            subtext="Gemini creates the roadmap. We handle the security. Funds are only released when milestones are verified."
            cta="Start Your Project"
            onCtaClick={() => navigate('/register')}
          />

          <ServiceCarousel />

          <Footer />
       </div>
    </AuroraBackground>
  );
}
