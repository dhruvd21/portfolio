import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  aboutMe = {
    title: 'Java Full Stack Developer & AI-Powered Problem Solver',
    techSummary:
      'Full stack developer with a passion for solving complex problems through code. With expertise in Java, DSA (Data Structures & Algorithms), and AWS, I craft robust web applications and serverless architectures.',
    techExtra:
      'I care about clean architecture, performance, and building features end-to-end with strong fundamentals and practical engineering tradeoffs.',
    techChips: ['Java Full Stack', 'Data Structures & Algorithms', 'AI Tools & Integration'],
    experienceChips: [
      'AWS Serverless Architecture',
      'ServiceNow Technologies',
      'Web Application Development',
    ],
    keyProject: {
      name: 'InvestrTrack',
      description: 'Built a full-stack investment platform where investors can upload investment opportunities and potential partners can discover and inquire about them. Architected with Java backend, modern frontend, and AWS cloud infrastructure.'
    },
    experienceSummary:
      'Software Developer at LTIMindtree building enterprise apps across Java/Spring and Angular. Previously interned at DCM Shriram, focusing on backend optimization and cloud/serverless fundamentals.'
    ,
    experienceExtra:
      'I collaborate in Agile teams, ship reliable changes, and focus on maintainability through modular code and clear interfaces.'
    ,
    experienceExtra2:
      'Comfortable owning features from API design to UI polish, with attention to security, performance, and user experience.'
  };

  scrollToAbout() {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

scrollToContact() {
  const element = document.getElementById('contact');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
  explorePortfolio() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Add zoom animation class to navbar
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    navbar.classList.add('navbar-zoom');

    // Remove the animation class after animation completes
    setTimeout(() => {
      navbar.classList.remove('navbar-zoom');
    }, 2500);
  }
}
