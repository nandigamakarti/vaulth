import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GradientText } from "@/components/ui/gradient-text";

function Feature() {
  return (
    <div className="w-full py-12 lg:py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-end items-end gap-10">
          <div className="flex gap-6 flex-col items-start">
            <div>
              <Badge className="text-base px-4 py-1">How It Works</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h2 className="text-3xl md:text-5xl lg:text-7xl tracking-tighter lg:max-w-xl font-regular text-left">
                <GradientText>Track, Build, and Transform Your Habits</GradientText>
              </h2>
              <p className="text-xl max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                HabitVault makes it easy to build lasting habits. Our intuitive platform helps you track progress, stay motivated, and achieve your goals.
              </p>
            </div>
          </div>
          <div className="w-full max-w-full px-6">
            <Carousel>
              <CarouselContent>
                {[
                  {
                    title: "Create Your Habits",
                    description: "Start by defining your habits and setting your goals",
                    image: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=600&auto=format&fit=crop"
                  },
                  {
                    title: "Track Daily Progress",
                    description: "Log your daily activities and monitor your consistency",
                    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=600&auto=format&fit=crop"
                  },
                  {
                    title: "View Analytics",
                    description: "Get insights into your habit-forming journey",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop"
                  },
                  {
                    title: "Build Streaks",
                    description: "Maintain momentum with streak tracking",
                    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
                  },
                  {
                    title: "Get Reminders",
                    description: "Never miss a day with smart notifications",
                    image: "https://ignitepotential.com/wp-content/uploads/2021/04/1-1024x1024.jpg"
                  },
                  {
                    title: "Celebrate Success",
                    description: "Track your achievements and celebrate milestones",
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzmFeGQr4SS7C6bq3L_XoV2G77CEEAX6lpkNMpJtMYruYKqGIBvGfx50vg_AuSKrMvbTQ&usqp=CAU"
                  }
                ].map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-col rounded-lg aspect-video bg-muted items-center justify-center p-8">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="mt-6 text-center">
                        <h3 className="text-xl font-semibold"><GradientText>{item.title}</GradientText></h3>
                        <p className="text-base text-muted-foreground mt-2">{item.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="h-10 w-10" />
              <CarouselNext className="h-10 w-10" />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature }; 