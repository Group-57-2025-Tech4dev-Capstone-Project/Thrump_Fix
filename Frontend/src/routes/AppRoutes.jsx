
import {Routes, Route} from "react-router-dom"
import route from "../utils/routes"
import LandingPage from "../pages/publicUsers/LandingPage";
import Login from "../pages/publicUsers/Login";
import Signup from "../pages/publicUsers/SignUp";
import PricingPage from "../pages/publicUsers/PricingPage";
import TermsPage from "../pages/publicUsers/TermsPage";

// Customer Pages
import CustomerDashboard from "../pages/customers/CustomerDashboard";


// Plumber Pages
import PlumberDashboard from "../pages/plumber/PlumberDashboard";
import AvailableJob from "../pages/plumber/AvailableJobs"
import ActiveJobs from "../pages/plumber/Active"

// Route Protection
import ProtectedRoute from "./ProtectedRoute"
import {Navigate} from "react-router-dom"

export default function AppRoutes(){

    return(
       <Routes>

            <Route path="/" element={<Navigate to={route.LandingPage} replace />} />
            {/* Public */}
            <Route path={route.LandingPage} element={<LandingPage/>}></Route>

            <Route path={route.Login} element={<Login/>}></Route>
            <Route path={route.Signup} element={<Signup/>}></Route>
            <Route path={route.Pricing} element={<PricingPage/>}></Route>
            <Route path={route.Terms} element={<TermsPage/>}></Route>


            {/* Consumer */}
            <Route
                path={route.ConsumerDashboard}
                element={
                    <ProtectedRoute>
                        <CustomerDashboard />
                    </ProtectedRoute>
                }>
            </Route>


            {/* Plumber */}
            <Route
                path={route.PlumberDashboard}
                element={
                    <ProtectedRoute>
                        <PlumberDashboard/>
                    </ProtectedRoute>
                }>
            </Route>

            <Route
                path={route.AvailableJob}
                element={
                    <ProtectedRoute>
                        <AvailableJob/>
                    </ProtectedRoute>
                }>
            </Route>

            <Route
                path={route.ActiveJob}
                element={
                    <ProtectedRoute>
                        <ActiveJobs/>
                    </ProtectedRoute>
                }>
            </Route>


       </Routes>




    )
}  