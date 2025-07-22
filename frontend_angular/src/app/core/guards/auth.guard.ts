import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserloginService } from '../../services/user.service/user.login.service';
import { AuthMessageService } from '../../services/user.service/auth-message/auth-messaging';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private userService = inject(UserloginService);
  private router = inject(Router);
  private authMessageService = inject(AuthMessageService);

  canActivate(): boolean | UrlTree {
    const currentUser = this.userService.getCurrentUser(); 
    if (currentUser) {
      return true;
    }
    
    // Set the message in the service
    this.authMessageService.setUnauthorizedMessage();
    
    // Navigate to login
    return this.router.createUrlTree(['/login']);
  }
}