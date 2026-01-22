import LandingHero from '@/components/LandingHero';
import HowItWorks from '@/components/HowItWorks';
import LandingFooter from '@/components/LandingFooter';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHero />
      <HowItWorks />
      <LandingFooter />
    </div>
  );
};

export default Landing;
