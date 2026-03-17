// import Container from "../landing/Container";
// import { Link } from "react-router-dom";
// import Button from "../buttons/Buttons";
// import LogoIcon from "../icons/Logo";
// import Logo from "../../assets/Logo.svg?react";

// export default function LandingNavbar() {
//   return (
//     <nav className="sticky top-0 z-50 bg-white shadow-sm">
//       <Container>
//         <div className="flex items-center justify-between py-4">

//           <LogoIcon />


//           {/* Buttons */}

//           <div className="flex items-center gap-3">

//             <Link to="/signup">
//               <Button variant="outline" size="sm">
//                 Sign up
//               </Button>
//             </Link>

//             <Link to="/login">
//               <Button variant="primary" size="sm">
//                 Log in
//               </Button>
//             </Link>

//           </div>
//         </div>
//       </Container>
//     </nav>
//   );
// }


import Container from "../landing/Container";
import { Link } from "react-router-dom";
import Button from "../buttons/Buttons";
import Logo from "../../assets/Logo.svg?react";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">

      <Container>
        <div className="flex items-center justify-between py-4">

          <div className="flex gap-2 item-center">
            <Logo/>
            <h1 className="text-[20px] font-bold text-blue-600">
                Thrump Fix
            </h1>
          </div>
         
          {/* <h1 className="text-xl font-bold text-blue-600">
             PlumbConnect
          </h1> */}

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
