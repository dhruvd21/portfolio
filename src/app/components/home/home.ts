import { AfterViewInit, Component, ElementRef, inject, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChild('quoteWrapper') quoteWrapper?: ElementRef<HTMLElement>;
  @ViewChild('aboutStack') aboutStack?: ElementRef<HTMLElement>;
  private readonly ngZone = inject(NgZone);
  private quoteRafPending = false;
  private scrollRafId?: number;
  private readonly quoteScrollListener = () => this.scheduleQuoteUpdate();
  private readonly quoteResizeListener = () => this.scheduleQuoteUpdate();

  readonly quoteText = 'Controlling complexity is the essence of computer programming';
  quoteStartOffset = '0%';
  aboutCardScales: number[] = [1, 1, 1];
  aboutSkills = [
    {
      title: 'Programming & Backend',
      summary:
        'Production backend services in Java/Spring Boot with secure REST APIs and clean service design.',
    },
    {
      title: 'Frontend',
      summary:
        'Angular interfaces with reusable components, responsive layouts, and reliable API integration.',
    },
    {
      title: 'Cloud & DevOps',
      summary:
        'AWS serverless stack with Lambda, API Gateway, DynamoDB, S3, and IAM for scalable delivery.',
    },
    {
      title: 'Data & Security',
      summary:
        'Spring Data JPA, DynamoDB, JWT auth, and role-based access control with performance-focused data flows.',
    },
  ];
  aboutSkillStackChips = ['Java', 'Spring Boot', 'Angular', 'AWS Lambda', 'DynamoDB', 'JWT'];

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
    this.slowScrollToElement('about');
  }

  scrollToContact() {
    this.slowScrollToElement('contact');
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

  aboutCardTop(index: number): string {
    return `calc(18% + ${index * 20}px)`;
  }

  aboutCardTransform(index: number): string {
    const scale = this.aboutCardScales[index] ?? 1;
    return `translateZ(0) scale(${scale.toFixed(4)})`;
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    this.scheduleQuoteUpdate();

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.quoteScrollListener, { passive: true });
      window.addEventListener('resize', this.quoteResizeListener, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('scroll', this.quoteScrollListener as EventListener);
    window.removeEventListener('resize', this.quoteResizeListener as EventListener);
    if (this.scrollRafId) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = undefined;
    }
  }

  private scheduleQuoteUpdate(): void {
    if (this.quoteRafPending) return;
    this.quoteRafPending = true;
    const cb = () => {
      this.quoteRafPending = false;
      this.ngZone.run(() => {
        this.updateQuotePosition();
        this.updateAboutStackPosition();
      });
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(cb);
    } else {
      setTimeout(cb, 16);
    }
  }

  private updateQuotePosition(): void {
    const wrapper = this.quoteWrapper?.nativeElement;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const viewportHeight = Math.max(1, window.innerHeight);
    // Matches Framer's ["start end","end start"] progress behavior used on the reference site.
    const progressRaw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const progress = Math.max(0, Math.min(1, progressRaw));
    const startOffset = -40 + 80 * progress;
    this.quoteStartOffset = `${startOffset.toFixed(1)}%`;
  }

  private updateAboutStackPosition(): void {
    if (typeof window === 'undefined') return;
    const stack = this.aboutStack?.nativeElement;
    if (!stack) return;

    const rect = stack.getBoundingClientRect();
    const viewportHeight = Math.max(1, window.innerHeight);
    const sectionProgress = this.clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);

    const totalCards = this.aboutCardScales.length;
    const nextScales = new Array(totalCards).fill(1);
    for (let index = 0; index < totalCards; index += 1) {
      const start = index / totalCards;
      const localProgress = this.clamp((sectionProgress - start) / Math.max(0.0001, 1 - start), 0, 1);
      const targetScale = 1 - (totalCards - index) * 0.05;
      nextScales[index] = this.lerp(1, targetScale, localProgress);
    }

    this.aboutCardScales = nextScales;
  }

  private slowScrollToElement(elementId: string): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const element = document.getElementById(elementId);
    if (!element) return;

    if (this.scrollRafId) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = undefined;
    }

    const startY = window.scrollY || window.pageYOffset;
    const targetY = element.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 1) return;

    const pixelsPerMs = 2.2;
    const durationMs = Math.max(260, Math.min(900, Math.abs(distance) / pixelsPerMs));
    const startTime = performance.now();

    const tick = (now: number): void => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      window.scrollTo({ top: startY + distance * progress, behavior: 'auto' });
      if (progress < 1) {
        this.scrollRafId = requestAnimationFrame(tick);
      } else {
        this.scrollRafId = undefined;
      }
    };

    this.scrollRafId = requestAnimationFrame(tick);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }
}
