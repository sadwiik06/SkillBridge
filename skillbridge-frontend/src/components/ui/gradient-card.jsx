import * as React from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

const cardVariants = cva(
  "relative flex flex-col justify-between h-full w-full overflow-hidden rounded-3xl p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl border border-white/20 dark:border-white/5",
  {
    variants: {
      gradient: {
        orange: "bg-gradient-to-br from-orange-100 to-amber-200/50 dark:from-orange-900/20 dark:to-amber-900/20",
        gray: "bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900/20 dark:to-slate-800/20",
        purple: "bg-gradient-to-br from-purple-100 to-indigo-200/50 dark:from-purple-900/20 dark:to-indigo-900/20",
        green: "bg-gradient-to-br from-emerald-100 to-teal-200/50 dark:from-emerald-900/20 dark:to-teal-900/20",
        blue: "bg-gradient-to-br from-blue-100 to-indigo-200/50 dark:from-blue-900/20 dark:to-indigo-900/20",
      },
    },
    defaultVariants: {
      gradient: "gray",
    },
  }
);

const GradientCard = React.forwardRef(
  ({ className, gradient, badgeText, badgeColor, title, description, ctaText, ctaHref, imageUrl, onClick, ...props }, ref) => {
    
    const cardAnimation = {
      rest: { scale: 1, y: 0 },
      hover: { scale: 1.02, y: -4 },
    };

    const imageAnimation = {
      rest: { scale: 1, rotate: 0, opacity: 0.6 },
      hover: { scale: 1.1, rotate: 3, opacity: 0.8 },
    };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="h-full cursor-pointer"
        ref={ref}
        onClick={onClick}
      >
        <div
          className={cn(cardVariants({ gradient }), className)}
          {...props}
        >
          {/* Decorative graphic/image */}
          {imageUrl && (
            <motion.img
                src={imageUrl}
                alt=""
                variants={imageAnimation}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="absolute -right-8 -bottom-8 w-40 h-40 object-contain pointer-events-none opacity-40 dark:opacity-20"
            />
          )}

          <div className="z-10 flex flex-col h-full">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/50 dark:bg-black/20 px-3 py-1 text-xs font-bold text-foreground/70 backdrop-blur-md w-fit border border-white/20">
              <span 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: badgeColor }}
              />
              {badgeText}
            </div>

            {/* Title and Description */}
            <div className="flex-grow">
              <h3 className="text-2xl font-black text-foreground mb-2 tracking-tight">{title}</h3>
              <p className="text-foreground/60 text-sm max-w-[200px] leading-relaxed">{description}</p>
            </div>
            
            {/* CTA */}
            <div className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-foreground">
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
GradientCard.displayName = "GradientCard";

export { GradientCard, cardVariants };
