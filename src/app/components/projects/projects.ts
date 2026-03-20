import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';

interface SkillGroup {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements AfterViewInit, OnDestroy {
  @ViewChildren('revealItem', { read: ElementRef })
  private revealItems?: QueryList<ElementRef<HTMLElement>>;
  private observer?: IntersectionObserver;

  skillGroups: SkillGroup[] = [
    {
      title: 'Core Development',
      items: [
        'Programming & Backend: Java, Spring Boot, Spring Security, REST APIs, AWS Lambda',
        'Frontend: Angular, HTML, CSS, responsive design, HTTP/JSON integration',
        'Database & Data: Spring Data JPA, DynamoDB, SQL/NoSQL, real-time data flows',
      ],
    },
    {
      title: 'Cloud, Security & Delivery',
      items: [
        'Cloud & DevOps: AWS Lambda, DynamoDB, S3, API Gateway, IAM, serverless architecture',
        'Security & Auth: JWT authentication, RBAC, secure API communication, encryption',
        'Workflow: Agile/Scrum, stand-ups, sprint planning, code reviews, Git',
      ],
    },
  ];

  trackByIndex(index: number): number {
    return index;
  }

  ngAfterViewInit(): void {
    const items = this.revealItems?.toArray() ?? [];
    if (!items.length) return;

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      items.forEach((item) => item.nativeElement.classList.add('is-visible'));
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    items.forEach((item) => this.observer?.observe(item.nativeElement));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
