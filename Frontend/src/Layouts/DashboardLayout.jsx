
import {Link, useNavigate} from "react-router-dom"
import route from "../utils/routes"
export default function DashboardLayout(
    {children, navlinks=[]}
){
    const navigate = useNavigate()
    // const user =        JSON.parse(localStorage.getItem("user") || null)
    const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;
console.log(storedUser)

    function handleLogout(){
        localStorage.removeItem("user")
        navigate(route.Login)
    }
    

    return(
        <div className="dashboard-layout">

          {/* Navbar */}
          <nav className="dashboard-nav">
            <h2>PlumbConnect</h2>

            <div className="nav-links">
              {navlinks.map((link)=>
                (
                  <Link key={link.name} to={link.path}>
                    {link.name}

                  </Link>
                ))
              }
            </div>

            {/* User Section */}
            <div className="nav-user">
              <p>Hello, {user?.fullName?.split(" ")[0] || user}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>

          </nav>

          <main className="dashboard-content">
            {children}
          </main>

        </div>
    )
}