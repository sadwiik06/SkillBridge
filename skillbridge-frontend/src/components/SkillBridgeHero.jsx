import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { MoveRight, ShieldCheck, CheckCircle2, BrainCircuit, Lock, Layers, Wallet, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext } from "@/components/ui/carousel";

function SkillBridgeHero() {
  const navigate = useNavigate();
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(
    () => ["Secure", "AI-Driven", "Transparent", "Milestone-Based", "Reliable"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full relative z-10">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular dark:text-white text-slate-900">
              <span className="font-light">Freelancing that is </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold text-black dark:text-white"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                          y: 0,
                          opacity: 1,
                        }
                        : {
                          y: titleNumber > index ? -150 : 150,
                          opacity: 0,
                        }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-slate-600 dark:text-slate-400 max-w-2xl text-center mx-auto">
              Bridge the gap between talent and trust. SkillBridge uses <b>AI-generated milestones</b>
              to automate project roadmaps and <b>secure escrow</b> to ensure every payment is earned.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4 bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200" onClick={() => navigate('/register')}>
              Get Started <MoveRight className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4" variant="outline" onClick={() => navigate('/login')}>
              Login <ShieldCheck className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProjectEscrowHero = React.forwardRef(({ className, headline, subtext, cta, onCtaClick, ...props }, ref) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const rotateX = useTransform(mouseY, [0, 400], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 600], [-8, 8]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(300);
        mouseY.set(200);
      }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative flex flex-col items-center justify-center text-center px-6 py-24 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl",
        className
      )}
      {...props}
    >
      <div className="relative z-20">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white max-w-xl leading-tight">
          {headline}
        </h2>
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          {subtext}
        </p>
        <button
          onClick={onCtaClick}
          className="mt-10 rounded-full bg-black px-8 py-4 text-base font-semibold text-white hover:bg-zinc-800 transition-all shadow-lg shadow-black/25 cursor-pointer dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {cta}
        </button>
      </div>

      <motion.div
        style={{ transform: "translateZ(60px)" }}
        className="absolute -bottom-16 -left-20 md:-left-32 h-40 w-72 rounded-2xl bg-white dark:bg-zinc-800 p-5 shadow-2xl border border-emerald-500/30 z-10 flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Milestone Paid</span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Phase 1: Backend API</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">$250.00</p>
        </div>
      </motion.div>

      <motion.div
        style={{ transform: "translateZ(40px)" }}
        className="absolute -top-10 -right-16 md:-right-24 h-36 w-64 rounded-2xl bg-black p-5 shadow-2xl z-10 flex flex-col justify-between dark:bg-white"
      >
        <div className="flex justify-between items-start text-white dark:text-black">
          <ShieldCheck className="w-6 h-6 opacity-80" />
          <span className="text-[10px] font-bold opacity-80 uppercase">Escrow Locked</span>
        </div>
        <div className="text-white dark:text-black">
          <p className="text-xs opacity-70">Total Project Budget</p>
          <p className="text-xl font-bold">$1,200.00</p>
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-500/10 via-transparent to-emerald-500/10 rounded-[2.5rem] pointer-events-none" />
    </motion.div>
  );
});

export const skillBridgeServices = [
  {
    number: "01",
    title: "AI MILESTONES",
    description: "Gemini 1.5 Flash breaks your project description into actionable, budget-aligned steps.",
    icon: BrainCircuit,
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    number: "02",
    title: "SECURE ESCROW",
    description: "Funds are locked automatically upon project start and released only when you approve the work.",
    icon: Lock,
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    number: "03",
    title: "SMART WALLET",
    description: "Track your total balance, locked funds for active tasks, and ready-to-withdraw earnings.",
    icon: Wallet,
    gradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    number: "04",
    title: "PROGRESS TRACKING",
    description: "Real-time status updates for every milestone, ensuring full transparency between parties.",
    icon: Layers,
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    number: "05",
    title: "TRUST ANALYTICS",
    description: "View client hire rates and freelancer completion stats to make informed hiring decisions.",
    icon: ShieldCheck,
    gradient: "from-rose-500/20 to-red-500/20",
  },
  {
    number: "06",
    title: "FAST BIDDING",
    description: "Seamlessly browse tasks, submit proposals, and start working within minutes.",
    icon: Zap,
    gradient: "from-violet-500/20 to-fuchsia-500/20",
  },
];

const ServiceCard = ({ service, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "relative flex h-[450px] w-full flex-col justify-between overflow-hidden rounded-3xl p-8 bg-gradient-to-r",
        service.gradient
      )}
    >
      <div className="z-10 flex flex-col items-start text-left">
        <span className="mb-8 text-sm font-mono text-foreground/50">
          ( {service.number} )
        </span>
        <service.icon className="mb-auto h-12 w-12 text-foreground" />
      </div>
      <div className="z-10 text-left">
        <h3 className="mb-2 text-lg font-semibold uppercase tracking-wider text-foreground">
          {service.title}
        </h3>
        <p className="text-sm text-foreground/70">{service.description}</p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
    </motion.div>
  );
};

const ServiceCarousel = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <div className="text-left mb-0">
        <h1 className="text-[10rem] md:text-[18rem] font-black text-slate-900 dark:text-white tracking-tighter leading-[0.7]">Features.</h1>
      </div>

      <Carousel
        ref={ref}
        opts={{
          align: "start",
          loop: true,
        }}
        className="relative group"
      >
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ staggerChildren: 0.1 }}
        >
          <CarouselContent>
            {skillBridgeServices.map((service, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <ServiceCard service={service} index={index} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        {/* Positioning the button on the right edge */}
        <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 h-14 w-14 bg-white dark:bg-zinc-900 shadow-xl border-zinc-200 dark:border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex" />
      </Carousel>
    </div>
  );
};

function Footer() {
  return (
    <footer className="w-full py-2 border-t border-black/5 dark:border-white/5 mt-2">
      <div className="container mx-auto px-4 flex justify-between items-center opacity-50">
        <div className="flex items-center gap-2 grayscale cursor-default">
          <Sparkles className="h-5 w-5" />
          <span className="font-bold text-lg tracking-tight">SkillBridge</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} SkillBridge</p>
      </div>
    </footer>
  );
}

ProjectEscrowHero.displayName = "ProjectEscrowHero";

export { SkillBridgeHero, ProjectEscrowHero, ServiceCarousel, Footer };
