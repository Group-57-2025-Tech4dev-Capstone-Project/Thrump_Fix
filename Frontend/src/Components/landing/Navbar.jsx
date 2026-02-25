import Container from "../landing/Container";
import { Link } from "react-router-dom";
import Button from "../buttons/Buttons";
import Logo from "../../assets/Logo.svg?react";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <Container>
        <div className="flex items-center justify-between py-4">

          {/* Logo + Name side by side */}
          <Link to="/home" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold text-blue-600">Thrump Fix</span>
          </Link>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/signup">
              <Button variant="outline" size="md">Sign Up</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="md">Login</Button>
            </Link>
          </div>

        </div>
      </Container>
    </nav>
  );
}
