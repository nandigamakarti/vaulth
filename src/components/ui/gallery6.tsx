"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { GradientText } from "@/components/ui/gradient-text";
import { articles, Article } from "../../articles"; // Import from new location

interface Gallery6Props {
  heading?: string;
  demoUrl?: string;
  // items prop is no longer needed as we use the imported articles
}

const Gallery6 = ({
  heading = "Habit Development Resources",
  demoUrl = "/blog",
}: Gallery6Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div>
            <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              <GradientText>{heading}</GradientText>
            </h2>
            <a
              href={demoUrl}
              className="group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg"
            >
              View all articles
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
          className="relative left-[-1rem]"
        >
          <CarouselContent className="-ml-4">
            {articles.slice(0, 5).map((article: Article) => (
              <CarouselItem key={article.slug} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <a
                  href={`/blog/${article.slug}`}
                  className="group block h-full overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="h-auto w-full object-cover transition-all group-hover:scale-105 aspect-[16/9]"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="mb-2 text-lg font-semibold md:mb-3 md:text-xl">
                      {article.title}
                    </h3>
                    <p className="mb-3 text-sm text-muted-foreground md:mb-4 md:text-base line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Read more
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export { Gallery6 }; 