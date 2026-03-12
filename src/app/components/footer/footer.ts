import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  socialLinks = [
    {
      label: 'Instagram',
      icon: '📷',
      imagePath: 'social-icons/instagram.png',
      url: 'https://instagram.com/droovspm'
    },
    {
      label: 'LinkedIn',
      icon: '💼',
      imagePath: 'social-icons/linkedin.png',
      url: 'https://www.linkedin.com/in/dhruv-dixit21/'
    },
    {
      label: 'LeetCode',
      icon: '💻',
      imagePath: 'social-icons/leetcode.png',
      url: 'https://leetcode.com/u/dhruv_2_1/'
    }
  ];
}
