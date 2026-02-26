import Container from "../landing/Container";
import { Card } from "../card/Card";
import { useNavigate } from "react-router-dom";
import route from "../../utils/routes";
import HomeIcon from "../icons/Home";
import BadgeIcon from "../icons/Badge";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-50 py-24">

      <Container>
        <div className="text-center">
          <span className="bg-blue-100 text-blue-600 text-base font-semibold px-4 py-1 rounded-full">
            #1 TRUSTED NETWORK
          </span>
        </div>


        <h1 className="text-center text-5xl md:text-6xl font-bold text-gray-900 mt-6 mb-6">
          Plumbing Fixed{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent italic">
            Fast.
          </span>
        </h1>

  
        <p className="text-center text-gray-500 text-lg mb-12">
          Dependable Plumbing Services for Homes & SMEs
        </p>

        {/* Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-6">

          <Card
            hover
            className="flex items-center justify-between gap-4 cursor-pointer"
            onClick={() => navigate(route.Signup)}
          >
            <div className="flex items-center gap-4">

              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                <HomeIcon size={20} />
              </div>

              <div>
                
                <h3 className="font-semibold text-gray-900 text-lg">
                  I need a Plumber
                </h3>

                <p className="text-xs text-gray-500">
                  Connect with verified pros
                </p>
              </div>

            </div>

            <span className="text-gray-400">→</span>
          </Card>

           <Card
            hover
            className="flex items-center justify-between gap-4 cursor-pointer"
            onClick={() => navigate(route.Signup)}
          >
            <div className="flex items-center gap-4">

              <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
                <BadgeIcon/>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  I am a Plumber
                </h3>

                <p className="text-xs text-gray-500">
                  Get verified leads today
                </p>
              </div>

            </div>

            <span className="text-gray-400">→</span>
          </Card>

        </div>

      </Container>

    </section>
  );
}
