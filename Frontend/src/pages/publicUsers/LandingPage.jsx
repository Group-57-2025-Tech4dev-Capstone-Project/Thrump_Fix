import Navbar from "../../Components/landing/Navbar";
import Hero from "../../Components/landing/Hero"
import Promise from "../../Components/landing/Promise"

export default function LandingPage(){
    return(
        <section>
            <Navbar/>
            <Hero/>
            <Promise/>
        </section>
    )
}