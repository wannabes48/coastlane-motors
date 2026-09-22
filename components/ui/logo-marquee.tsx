"use client";

import React, { memo, useState, useEffect } from "react";
import { useMotionValue, animate, motion } from "motion/react";
import useMeasure from "react-use-measure";
import Link from "next/link";

const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(" ");

export type BrandLogo = {
  src: string;
  alt: string;
  href: string;
  width?: number;
  height?: number;
};

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

const InfiniteSlider = memo(function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const size = direction === "horizontal" ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    let controls: any;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration:
          currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prev) => prev + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => translation.set(from),
      });
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className="flex w-max"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
});

const LogoItem = memo(function LogoItem({ logo }: { logo: BrandLogo }) {
  return (
    <Link
      href={logo.href}
      className="flex flex-col items-center justify-center gap-2 px-4 py-3
                 rounded-xl border border-transparent hover:border-line hover:bg-white
                 transition-all duration-200 group shrink-0"
      aria-label={`Browse ${logo.alt} cars`}
    >
      <img
        alt={logo.alt}
        src={logo.src}
        width={logo.width ?? 64}
        height={logo.height ?? 64}
        loading="lazy"
        className="w-14 h-14 md:w-16 md:h-16 object-contain
                   opacity-80 group-hover:opacity-100 transition-opacity duration-200 select-none pointer-events-none"
      />
      <span className="font-sans text-[11px] font-semibold text-slate group-hover:text-ink transition-colors whitespace-nowrap">
        {logo.alt}
      </span>
    </Link>
  );
});

export const LogoMarquee = memo(function LogoMarquee({
  logos,
  className,
}: {
  logos: BrandLogo[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-7xl mx-auto overflow-hidden py-2",
        "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
        className,
      )}
    >
      <InfiniteSlider gap={8} duration={60} durationOnHover={200}>
        {[...logos, ...logos].map((logo, i) => (
          <LogoItem key={`${logo.alt}-${i}`} logo={logo} />
        ))}
      </InfiniteSlider>
    </div>
  );
});

LogoMarquee.displayName = "LogoMarquee";
export default LogoMarquee;
