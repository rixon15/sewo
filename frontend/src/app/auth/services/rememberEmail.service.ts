import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class RememberEmailService {
  private rememberedEmailKey = 'rememberedEmail';
  private hostName = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService
  ) { }

  setRememberedEmail(email: string) {

    console.log(isPlatformBrowser(this.platformId))

    if (isPlatformBrowser(this.platformId)) {
      console.log('[asd')
      this.cookieService.set(this.rememberedEmailKey, email, { secure: false, sameSite: 'None' });
    }

    // this.cookieService.set(this.rememberedEmailKey, email, { secure: false, sameSite: 'None' });
  }

  getRememberedEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.cookieService.get(this.rememberedEmailKey);
    }
    return null;
  }

  clearRememberedEmail() {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.delete(this.rememberedEmailKey);
    }
  }
}
