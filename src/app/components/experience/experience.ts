import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, NgZone, OnDestroy, ViewChild } from '@angular/core';

interface ExperienceEntry {
  date: string;
  role: string;
  company: string;
  location: string;
  tags: string[];
  summary: string;
  highlightsTitle: string;
  highlights: string[];
  environment: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrls: ['./experience.css'],
})
export class Experience implements AfterViewInit, OnDestroy {
  @ViewChild('experienceStack') experienceStack?: ElementRef<HTMLElement>;
  private readonly ngZone = inject(NgZone);
  private rafPending = false;
  private readonly scrollListener = () => this.scheduleLayoutUpdate();
  private readonly resizeListener = () => this.scheduleLayoutUpdate();

  experiences: ExperienceEntry[] = [
    {
      date: '10/2025 – Present',
      role: 'Software Developer',
      company: 'LTIMindtree',
      location: 'Bangalore, India',
      tags: ['Java', 'Spring Boot', 'Spring Security', 'Angular', 'REST APIs', 'Spring Data JPA'],
      summary:
        'As a full-stack software developer, I design and maintain enterprise-grade applications that serve diverse business needs, spanning backend architecture and responsive frontend delivery.',
      highlightsTitle: 'Key contributions include:',
      highlights: [
        'Designing and implementing RESTful APIs that enable secure communication between frontend and backend systems',
        'Integrating with databases using Spring Data JPA for efficient data management',
        'Ensuring high application performance through optimized backend logic and responsive UI components',
        'Implementing HTTP and JSON-based integrations to improve data flow and application reliability',
      ],
      environment:
        'Working in an Agile/Scrum environment, I collaborate in daily stand-ups, sprint planning, and code reviews while focusing on scalable architecture and maintainable design.',
    },
    {
      date: '08/2024 – 10/2024',
      role: 'Software Developer Intern',
      company: 'DCM Shriram Ltd',
      location: 'Uttar Pradesh, India',
      tags: ['Django', 'AWS Lambda', 'DynamoDB', 'S3', 'IAM'],
      summary:
        'During my internship, I contributed to backend development for a supply chain management system and optimized Django APIs with AWS services to improve throughput and reliability.',
      highlightsTitle: 'Key responsibilities included:',
      highlights: [
        'Deploying serverless solutions on AWS (Lambda, DynamoDB, IAM) to reduce infrastructure costs',
        'Strengthening data security with encryption, role-based access control, and secure IAM configurations',
      ],
      environment:
        'This experience deepened my understanding of cloud infrastructure, API development, and secure backend engineering while delivering scalable solutions for business operations.',
    },
  ];

  currentIndex = 0;
  cardScales: number[] = this.experiences.map(() => 1);

  trackByIndex(index: number): number {
    return index;
  }

  cardTop(index: number): string {
    return `calc(10% + ${index * 24}px)`;
  }

  cardTransform(index: number): string {
    return `scale(${(this.cardScales[index] ?? 1).toFixed(4)})`;
  }

  ngOnDestroy(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('scroll', this.scrollListener as EventListener);
    window.removeEventListener('resize', this.resizeListener as EventListener);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.scheduleLayoutUpdate();
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      window.addEventListener('resize', this.resizeListener, { passive: true });
    });
  }

  private scheduleLayoutUpdate(): void {
    if (this.rafPending) return;
    this.rafPending = true;
    const cb = () => {
      this.rafPending = false;
      this.ngZone.run(() => this.updateCardProgress());
    };
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(cb);
    } else {
      setTimeout(cb, 16);
    }
  }

  private updateCardProgress(): void {
    if (typeof window === 'undefined') return;
    const stack = this.experienceStack?.nativeElement;
    if (!stack) return;

    const total = this.experiences.length;
    if (!total) return;

    const rect = stack.getBoundingClientRect();
    const viewportHeight = Math.max(1, window.innerHeight);
    const rawSectionProgress = this.clamp(
      (viewportHeight - rect.top) / (viewportHeight + rect.height),
      0,
      1
    );
    const sectionProgress = this.progressCurve(rawSectionProgress);
    const shrinkPerCard = 0.02;
    const progressDelay = 0.38;

    const nextScales = new Array(total).fill(1);
    for (let index = 0; index < total; index += 1) {
      const start = index / total;
      const localProgress = this.clamp((sectionProgress - start) / Math.max(0.0001, 1 - start), 0, 1);
      const delayedProgress = this.clamp(
        (localProgress - progressDelay) / Math.max(0.0001, 1 - progressDelay),
        0,
        1
      );
      const easedProgress = this.easeOutCubic(delayedProgress);
      const targetScale = Math.max(0.88, 1 - (total - index) * shrinkPerCard);
      nextScales[index] = this.lerp(1, targetScale, easedProgress);
    }

    this.cardScales = nextScales;
    this.currentIndex = this.clamp(Math.round(sectionProgress * (total - 1)), 0, total - 1);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }

  private easeOutCubic(value: number): number {
    const normalizedValue = this.clamp(value, 0, 1);
    return 1 - Math.pow(1 - normalizedValue, 3);
  }

  private progressCurve(value: number): number {
    const normalizedValue = this.clamp(value, 0, 1);
    return Math.pow(normalizedValue, 2.2);
  }
}
