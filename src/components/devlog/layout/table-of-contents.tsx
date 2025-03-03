"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { TableOfContentsItem } from "@/types/index";
import { cn } from "@/lib/class-name-utils";
import { useHeaderStore } from "@/store/header-store";

interface TocProps {
  toc: TableOfContentsItem[] | null;
}

export function TableOfContents({ toc }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { setForceHidden } = useHeaderStore();
  const tocRef = useRef<HTMLDivElement>(null);

  const items = toc || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    const headings = document.querySelectorAll("h2, h3, h4");
    headings.forEach((elem) => observer.observe(elem));

    const handleScroll = () => {
      if (!tocRef.current) return;

      const footerHeight = 200;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const distanceToBottom = docHeight - (scrollY + windowHeight);

      if (distanceToBottom <= footerHeight) {
        const adjustment = Math.min(
          footerHeight - distanceToBottom,
          footerHeight
        );
        tocRef.current.style.transform = `translateY(-${adjustment}px)`;
        tocRef.current.style.transition = "transform 0.1s ease-out";
      } else {
        tocRef.current.style.transform = "translateY(0)";
        tocRef.current.style.transition = "transform 0.1s ease-out";
      }
    };

    window.addEventListener("scroll", handleScroll);

    const handleTocClick = (e: Event) => {
      if (window.innerWidth <= 767) {
        const target = e.target as HTMLElement;
        if (!target.closest("a")) {
          setIsExpanded((prev) => !prev);
        }
      }
    };

    const tocContainer = document.querySelector(".toc-container");
    tocContainer?.addEventListener("click", handleTocClick);

    return () => {
      observer.disconnect();
      tocContainer?.removeEventListener("click", handleTocClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setForceHidden(true);
      const offset = 24;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (window.innerWidth <= 767) {
        setIsExpanded(false);
      }
    }
  };

  return (
    <div
      ref={tocRef}
      className="sticky transition-transform duration-200 top-20 lg:top-24"
    >
      <nav
        className={cn(
          "toc-container rounded-xl px-6 py-8",
          "border border-border/[0.15]",
          "bg-background/50",
          "shadow-[0_0_1px_rgba(0,0,0,0.05)]",
          "backdrop-blur-[1px]",
          isExpanded && "expanded",
          "w-56 lg:w-60 overflow-y-auto",
          "max-h-[70vh] lg:max-h-[80vh]"
        )}
      >
        <p className="font-semibold mb-6 text-base hidden xl:block">Contents</p>
        {items.length > 0 && (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "text-sm transition-colors duration-200",
                  item.level === 2
                    ? "ml-0"
                    : item.level === 3
                    ? "ml-4"
                    : "ml-6",
                  activeId === item.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </div>
  );
}
