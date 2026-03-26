import Container from "./Container";
import { Card } from "../card/Card";

const testimonials = [
  {
    quote:
      "My kitchen pipe burst at 3am and I was panicking. Thrump Fix connected me with a verified plumber in Ikeja within 15 minutes. Professional service, fair pricing. Highly recommended!",
    name: "Adebayo Oluwaseun",
    role: "Homeowner, Ikeja",
    initials: "AO",
    color: "bg-green-500",
  },
  {
    quote:
      "As a plumber, Thrump Fix has transformed my business. I get verified leads daily, and the platform handles all the paperwork. I can focus on what I do best - fixing pipes!",
    name: "Chukwuma Emmanuel",
    role: "Verified Plumber, Surulere",
    initials: "CE",
    color: "bg-blue-500",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <Container>

        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 mb-14">
          What Our Users Say
        </h2>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <Card key={i}  className="p-8 flex flex-col justify-between gap-6 shadow">

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-black flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>

            </Card>
          ))}
        </div>

      </Container>
    </section>
  );
}
