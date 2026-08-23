import React from 'react';
import { ExternalLink, Github, Heart, Shield, Cpu, Code2 } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black font-display text-foreground tracking-tight">About Looprix</h1>
        <p className="text-[13px] text-muted-foreground font-medium">
          Autonomous Code Review & Self-Healing Developer Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Author Info */}
        <div className="bg-card border-2 border-border-strong rounded-[24px] p-6 shadow-brutal-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-yellow/20 flex items-center justify-center border-2 border-brand-yellow">
              <Cpu className="w-6 h-6 text-brand-yellow" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold font-display text-foreground">Looprix Platform</h2>
              <p className="text-[13px] text-muted-foreground">Version 1.0.0 (MVP)</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-[16px] bg-secondary border border-border">
              <h3 className="text-[14px] font-bold text-foreground mb-1">Created & Maintained By</h3>
              <p className="text-[15px] font-black text-brand-blue mb-0.5">Priyadharshan Chandranath</p>
              <p className="text-[13px] text-muted-foreground font-medium mb-3">Senior Analyst & SAP Product Engineer</p>
              
              <a 
                href="https://priyadharshan-tau.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-yellow bg-brand-yellow/10 px-3 py-1.5 rounded-full hover:bg-brand-yellow/20 transition-colors"
              >
                Contact Author <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Open Source / Sponsor */}
        <div className="bg-card border-2 border-border-strong rounded-[24px] p-6 shadow-brutal-sm flex flex-col justify-between">
          <div>
            <h2 className="text-[16px] font-bold font-display text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-red" />
              Support & Contribute
            </h2>
            <p className="text-[13px] text-subtext leading-relaxed mb-4">
              Looprix is built to help engineering teams save time, prevent vulnerabilities, and maintain clean core compliance. If it has helped your workflow, consider supporting the project!
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                <Github className="w-4 h-4 text-muted-foreground" />
                <span>Star the repository on GitHub</span>
              </li>
              <li className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                <Code2 className="w-4 h-4 text-muted-foreground" />
                <span>Contribute new agent modules</span>
              </li>
              <li className="flex items-center gap-3 text-[13px] text-foreground font-medium">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Report vulnerabilities or bugs</span>
              </li>
            </ul>
          </div>
          
          <a 
            href="https://github.com/Priyadharshan2003/looprix" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-foreground text-background font-bold text-[13px] hover:-translate-y-0.5 transition-all shadow-brutal-sm"
          >
            <Github className="w-4 h-4" />
            View Source Code
          </a>
        </div>
      </div>
    </div>
  );
};
