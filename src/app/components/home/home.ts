import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  aboutMe = {
    title: 'Java Full Stack Developer & AI-Powered Problem Solver',
    headline: 'Building scalable, intelligent solutions with Java, AWS, and cutting-edge technologies',
    bio: `I'm a full stack developer with a passion for solving complex problems through code. With expertise in Java, DSA (Data Structures & Algorithms), and AWS, I craft robust web applications and serverless architectures that drive real business value. Currently at LTIMindtree, leveraging ServiceNow and cloud technologies to deliver enterprise solutions.`,
    skills: [
      'Java & Full Stack Development',
      'Data Structures & Algorithms',
      'AWS Serverless Architecture',
      'ServiceNow Technologies',
      'AI Tools & Integration',
      'Web Application Development'
    ],
    keyProject: {
      name: 'InvestrTrack',
      description: 'Built a full-stack investment platform where investors can upload investment opportunities and potential partners can discover and inquire about them. Architected with Java backend, modern frontend, and AWS cloud infrastructure.'
    },
    philosophy: 'Code is not just about making things work—it\'s about making things efficient, scalable, and elegant. I\'m obsessed with DSA and optimization because every millisecond matters.'
  };

  explorePortfolio() {
    // Add zoom animation class to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.add('navbar-zoom');
      
      // Remove the animation class after animation completes
      setTimeout(() => {
        navbar.classList.remove('navbar-zoom');
      }, 2500);
    }
  }
}
