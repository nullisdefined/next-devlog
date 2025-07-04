"use client";

import { Post } from "@/types/index";
import { PostCard } from "./post-card";
import { PopcatCard } from "./popcat-card";
import { Pagination } from "./pagination";
import { Quote, ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SortButton } from "./sort-button";
import { ViewModeToggle } from "./view-mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconMapper } from "./icon-mapper";
import { useViewMode } from "@/app/context/view-mode-provider";
import React from "react";

interface SeriesViewProps {
  currentPosts: Post[];
  currentSeries: {
    name: string;
    path: string;
    iconName: string;
    description?: string;
  };
  seriesPosts: Post[];
  order: "asc" | "desc";
  currentPage: number;
  totalPages: number;
  previous: {
    name: string;
    path: string;
    iconName: string;
  } | null;
  next: {
    name: string;
    path: string;
    iconName: string;
  } | null;
}

function splitPostsToColumns(
  posts: (Post | React.ReactElement)[],
  columnCount: number
): Array<Post | React.ReactElement>[] {
  const columns: Array<Post | React.ReactElement>[] = Array.from(
    { length: columnCount },
    () => []
  );
  posts.forEach((post, idx) => {
    columns[idx % columnCount].push(post);
  });
  return columns;
}

export function SeriesView({
  currentPosts,
  currentSeries,
  seriesPosts,
  order,
  currentPage,
  totalPages,
  previous,
  next,
}: SeriesViewProps) {
  const { viewMode } = useViewMode();

  const getGridClassName = () => {
    switch (viewMode) {
      case "masonry":
        return "columns-1 md:columns-2 xl:columns-3 gap-4 space-y-0";
      case "card":
        return "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4";
      case "list":
        return "grid grid-cols-1 gap-3";
      default:
        return "columns-1 md:columns-2 xl:columns-3 gap-4 space-y-0";
    }
  };

  const renderMasonryContent = () => {
    if (viewMode !== "masonry") {
      return currentPosts.map((post: Post) => (
        <PostCard
          key={`${post.urlCategory}/${post.slug}`}
          post={{
            ...post,
            category: currentSeries.name,
          }}
        />
      ));
    }

    let columnCount = 1;
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) columnCount = 3;
      else if (window.innerWidth >= 768) columnCount = 2;
    }
    const columns = splitPostsToColumns(currentPosts, columnCount);

    // 팝캣은 첫번째 컬럼 맨 앞에만 확률적으로 추가
    if (Math.random() < 0.03) {
      const popcatVariant = (Math.random() < 0.5 ? 1 : 2) as 1 | 2;
      columns[0].unshift(
        <PopcatCard
          key={`popcat-series-${currentPage}`}
          variant={popcatVariant}
        />
      );
    }

    return (
      <div className="flex gap-4">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-4">
            {col.map((item, idx) => {
              if (React.isValidElement(item)) {
                return React.cloneElement(item, { key: item.key ?? idx });
              }
              return (
                <PostCard
                  key={
                    ((item as Post).urlCategory || "") +
                    ((item as Post).slug || idx)
                  }
                  post={{ ...(item as Post), category: currentSeries.name }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3">
            <Lightbulb className="w-8 h-8 text-primary" />
            <IconMapper
              name={currentSeries.iconName}
              className="w-8 h-8 text-primary"
            />
            <h1 className="text-3xl font-bold">{currentSeries.name}</h1>
          </div>
          {currentSeries.description && (
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/5 shadow-md">
              <div className="flex items-center justify-center gap-4">
                <Quote className="w-4 h-4 text-primary/60 flex-shrink-0" />
                <p className="text-md text-muted-foreground leading-relaxed text-center font-semibold">
                  {currentSeries.description}
                </p>
              </div>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-medium">
              {seriesPosts.length} {seriesPosts.length === 1 ? "Post" : "Posts"}{" "}
              found
            </p>
            <div className="flex items-center gap-3">
              <ViewModeToggle />
              <SortButton order={order} />
            </div>
          </div>
        </div>
      </div>

      {seriesPosts.length > 0 ? (
        <>
          <div className={viewMode === "card" ? getGridClassName() : ""}>
            {renderMasonryContent()}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          아직 작성된 포스트가 없습니다.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {previous && (
          <Link href={previous.path} className="col-start-1">
            <Button variant="ghost" className="w-full group">
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">
                    Previous Series
                  </p>
                  <p className="font-medium truncate">{previous.name}</p>
                </div>
              </div>
            </Button>
          </Link>
        )}
        {next && (
          <Link href={next.path} className="col-start-2">
            <Button variant="ghost" className="w-full group">
              <div className="flex items-center gap-2 justify-end">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Next Series</p>
                  <p className="font-medium truncate">{next.name}</p>
                </div>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
