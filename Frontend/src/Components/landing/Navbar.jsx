import Container from "../landing/Container";
import { Link } from "react-router-dom";
import Button from "../buttons/Buttons";
import LogoIcon from "../icons/Logo";
import Logo from "../../assets/Logo.svg?react";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <Container>
        <div className="flex items-center justify-between py-4">

          <LogoIcon />


          {/* Buttons */}

          <div className="flex items-center gap-3">

            <Link to="/signup">
              <Button variant="outline" size="sm">
                Sign up
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="primary" size="sm">
                Log in
              </Button>
            </Link>

          </div>
        </div>
      </Container>
    </nav>
  );
}
