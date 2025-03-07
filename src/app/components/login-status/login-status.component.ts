import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  imports: [CommonModule, RouterModule],
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css',
})
export class LoginStatusComponent {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  userEmail: string = '';
  storage: Storage | null = null;

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }
  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((res) => {
        this.userFullName = res.name as string;
        this.userEmail = res.email as string;
        if (isPlatformBrowser(this.platformId)) {
          this.storage = sessionStorage;
          const email = res.email;
          this.storage.setItem('userEmail', JSON.stringify(email));
        }
      });
    }
  }

  logOut() {
    this.oktaAuth.signOut();
  }
}
