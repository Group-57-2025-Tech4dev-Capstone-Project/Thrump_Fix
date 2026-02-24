import Navbar from "../../Components/landing/Navbar";
import Hero from "../../Components/landing/Hero"
import Promise from "../../Components/landing/Promise"
import Testimonials from "../../Components/landing/Testimonials";
import CTA from "../../Components/landing/CTA"

export default function LandingPage(){
    return(
        <section>
            <Navbar/>
            <Hero/>
            <Promise/>
            <Testimonials/>
            <CTA/>
        </section>
    )
}