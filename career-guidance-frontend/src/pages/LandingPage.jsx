import { useNavigate } from "react-router-dom";
import HeroSection    from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      {/*
        onLogin  → navigates to /login
        onSignup → navigates to /register
        HeroSection uses these via its button onClick handlers
      */}
      <HeroSection
        onLogin={()  => navigate("/login")}
        onSignup={() => navigate("/register")}
      />
      <FeaturesSection />
    </>
  );
}

export default LandingPage;

