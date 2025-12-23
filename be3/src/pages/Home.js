import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import WhyChooseUs from "../components/WhyChooseUs";
import Courses from "../components/Courses";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <WhyChooseUs />
      <Courses />
      <Pricing />
      <Footer/>
    </>
  );
}
