import { Component, signal, HostListener, Renderer2, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  isMenuOpen = signal(false);
  lastScrollY = 0;
  currentPage = signal('');

  constructor(
    private renderer: Renderer2, 
    private el: ElementRef,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Get current page from URL only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.updateCurrentPage();
    }
    
    // Listen for route changes
    this.router.events.subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.updateCurrentPage();
      }
    });
  }

  private updateCurrentPage() {
    if (isPlatformBrowser(this.platformId)) {
      const url = window.location.pathname;
      const pageName = url.replace('/', '') || 'home';
      const formattedPage = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      
      // Only show current page name if not on home page
      if (pageName === 'home') {
        this.currentPage.set('');
      } else {
        this.currentPage.set(formattedPage);
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const currentScrollY = window.scrollY;
    const navbar = this.el.nativeElement.querySelector('.navbar');
    
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      // Scrolling down - hide navbar
      this.renderer.addClass(navbar, 'hidden');
    } else {
      // Scrolling up - show navbar
      this.renderer.removeClass(navbar, 'hidden');
    }
    
    this.lastScrollY = currentScrollY;
  }

  toggleMenu() {
    this.isMenuOpen.update(val => !val);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  get filteredNavItems() {
    // Always return all navigation items
    return this.navItems;
  }

  navItems = [
    { label: 'Home', href: '/home' },
    { label: 'Skills', href: '/skills' },
    { label: 'Experience', href: '/experience' },
    { label: 'Resume', href: '/resume' }
  ];
}
