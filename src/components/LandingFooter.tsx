import { Waves, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  return (
    <footer className="border-t border-border bg-card/20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Waves className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">FloodForge</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              AI-powered flood prediction and management system supporting SDG 13: Climate Action. 
              Protecting communities through advanced early warning systems.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm">Dashboard</Link></li>
              <li><Link to="/dashboard/map" className="text-muted-foreground hover:text-primary transition-colors text-sm">Risk Map</Link></li>
              <li><Link to="/dashboard/analytics" className="text-muted-foreground hover:text-primary transition-colors text-sm">Analytics</Link></li>
              <li><Link to="/dashboard/alerts" className="text-muted-foreground hover:text-primary transition-colors text-sm">Alerts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">API Reference</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Data Sources</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 FloodForge. Built for SDG 13: Climate Action.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
