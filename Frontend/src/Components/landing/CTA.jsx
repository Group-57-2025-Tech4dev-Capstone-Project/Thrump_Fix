// components/landing/CTA.jsx
import Container from "../landing/Container";
import Button from "../buttons/Buttons";

export default function CTA() {
  return (
    <section className="bg-blue-600 py-24">
      <Container>
        <div className="text-center text-white">

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
            Ready to get your plumbing fixed?
          </h2>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">

            <Button
              variant="primary"
              size="lg"
              className="!bg-white !text-blue-600 hover:!bg-gray-100"
            >
              GET A PLUMBER NOW
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="!border-white !text-white hover:!bg-white hover:!text-blue-600"
            >
              JOIN AS A PROFESSIONAL
            </Button>

          </div>
        </div>
      </Container>
    </section>
  );
}
