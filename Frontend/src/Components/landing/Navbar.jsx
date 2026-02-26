import Container from "../landing/Container";
import { Link } from "react-router-dom";
import Button from "../buttons/Buttons";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">

      <Container>
        <div className="flex items-center justify-between py-4">

          <div className="flex gap-2 item-center">
            <img src="./icon.svg" alt="icon" />
            <h1 className="text-xl font-bold text-blue-600">
              PlumbConnect
            </h1>
          </div>


          {/* Buttons */}

          <div className="flex items-center gap-3">

            <Link to="/signup">
              <Button variant="outline" size="md">
                Sign Up
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="outline" size="md">
                Login
              </Button>
            </Link>

          </div>
        </div>
      </Container>

    </nav>
  );
}
