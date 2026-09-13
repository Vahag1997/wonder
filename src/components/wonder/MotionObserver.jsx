"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export default function MotionObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = [
      ...document.querySelectorAll(".section,.closing-banner"),
    ].filter((node) => node.getBoundingClientRect().top > window.innerHeight);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.04 },
    );
    nodes.forEach((node) => {
      node.classList.add("will-reveal");
      observer.observe(node);
    });
    return () => {
      observer.disconnect();
      nodes.forEach((node) => node.classList.remove("will-reveal"));
    };
  }, [pathname]);
  return null;
}
