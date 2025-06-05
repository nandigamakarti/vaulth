import { Mail, MapPin, Phone } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/utils";

interface Contact7Props {
  title?: string;
  description?: string;
  emailLabel?: string;
  emailDescription?: string;
  email?: string;
  officeLabel?: string;
  officeDescription?: string;
  officeAddress?: string;
  phoneLabel?: string;
  phoneDescription?: string;
  phone?: string;
}

export const Contact7 = ({
  title = "Contact Us",
  description = "Contact the support team at Shadcnblocks.",
  emailLabel = "Email",
  emailDescription = "We respond to all emails within 24 hours.",
  email = "example@shadcnblocks.com",
  officeLabel = "Office",
  officeDescription = "Drop by our office for a chat.",
  officeAddress = "1 Eagle St, Brisbane, QLD, 4000",
  phoneLabel = "Phone",
  phoneDescription = "We're available Mon-Fri, 9am-5pm.",
  phone = "+123 456 7890",
}: Contact7Props) => {
  return (
    <section className="bg-background py-32">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-14 text-center">
          <h1 className={cn(
            "mt-2 mb-3 text-3xl font-semibold text-balance md:text-4xl"
          )}>
            <GradientText>{title}</GradientText>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground mx-auto">
            {description}
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="text-center">
            <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-primary/10 mx-auto">
              <Mail className="h-6 w-auto text-primary" />
            </span>
            <p className="mb-2 text-lg font-semibold">{emailLabel}</p>
            <p className="mb-3 text-muted-foreground">{emailDescription}</p>
            <a
              href={`mailto:${email}`}
              className="font-semibold text-primary hover:underline"
            >
              {email}
            </a>
          </div>
          <div className="text-center">
            <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-primary/10 mx-auto">
              <MapPin className="h-6 w-auto text-primary" />
            </span>
            <p className="mb-2 text-lg font-semibold">{officeLabel}</p>
            <p className="mb-3 text-muted-foreground">{officeDescription}</p>
            <a href="#" className="font-semibold text-primary hover:underline">
              {officeAddress}
            </a>
          </div>
          <div className="text-center">
            <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-primary/10 mx-auto">
              <Phone className="h-6 w-auto text-primary" />
            </span>
            <p className="mb-2 text-lg font-semibold">{phoneLabel}</p>
            <p className="mb-3 text-muted-foreground">{phoneDescription}</p>
            <a href={`tel:${phone}`} className="font-semibold text-primary hover:underline">
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}; 