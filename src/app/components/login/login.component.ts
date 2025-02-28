import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  oktaSignIn: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {

  }

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {

      const OktaSignIn = (await import('@okta/okta-signin-widget')).default;

      this.oktaSignIn = new OktaSignIn({
        logo: '/logo.png',
        baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
        clientId: myAppConfig.oidc.clientId,
        redirectUri: myAppConfig.oidc.redirectUri,
        useClassicEngine: true,
        authParams: {
          pkce: true,
          responseType: 'code',
          issuer: myAppConfig.oidc.issuer,
          scopes: myAppConfig.oidc.scopes,
        },
        useInteractionCodeFlow: false
      });

      this.oktaSignIn.renderEl(
        {
          el: '#okta-sign-in-widget',
        },
        async (response: any) => {
          if (response.status === 'SUCCESS') {
            this.oktaAuth.signInWithRedirect();
          }
        },
        (error: any) => {
          throw error;
        }
      );
    }
  }
}
