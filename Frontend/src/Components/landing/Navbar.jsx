import Container from "../landing/Container";
import { Link } from "react-router-dom";
import Button from "../buttons/Buttons";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">

      <Container>
        <div className="flex items-center justify-between py-4">

         
          <h1 className="text-xl font-bold text-blue-600">
             PlumbConnect
          </h1>

          {/* Buttons */}
          
           <div className="flex items-center gap-3">

                <Link to="/signup">
                <Button variant="outline" size="md">
                    Sign Up
                </Button>
                </Link>

                <Link to="/login">
                <Button size="md">
                    Login
                </Button>
                </Link>

            </div>
        </div>
      </Container>

    </nav>
  );
}
