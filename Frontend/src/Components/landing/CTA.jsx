import Container from "./Container";
import { useNavigate } from "react-router-dom";
import route from "../../utils/routes";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="bg-blue-600 py-18">
      <Container>
        <div className="text-center text-white">

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold max-w-2xl mx-auto leading-tight">
            Ready to get your plumbing fixed?
          </h2>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">

            <button    
              onClick={() => navigate(route.Signup)}
              className="border-2 border-white  font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl bg-white text-blue-600 transition w-full sm:w-auto"
            >
              Get a Plumber Now
            </button>

            <button
              onClick={() => navigate(route.Signup)}
              className="border-2 border-white text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition w-full sm:w-auto"
            >
              Join as a Professional
            </button>

          </div>
        </div>
      </Container>
    </section>
  );
}
