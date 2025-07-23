// services/user-info.service.ts
import { inject, Injectable } from '@angular/core';
import { UserloginService } from '../services/user.service/user.login.service';
import { BehaviorSubject } from 'rxjs';

export interface UserInfo {
  name: string;
  role: string;
  companyName: string;
  companySize: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private userservice = inject(UserloginService);
  currentUser$ = this.userservice.currentUser$;

  // Private properties to store user info
  private _username: string = '';
  private _role: string = '';
  private _companyName: string = '';
  private _companySize: string = '';

  // BehaviorSubject to emit user info changes
  private userInfoSubject = new BehaviorSubject<UserInfo>({
    name: '',
    role: '',
    companyName: '',
    companySize: ''
  });

  // Observable for components to subscribe to
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor() {
    // Subscribe to current user changes in constructor
    this.currentUser$.subscribe((user) => {
      if (user) {
        this._username = user.name || '';
        this._role = user.role || '';
        this._companyName = user.companyName || '';
        this._companySize = user.companySize || '';

        // Emit updated user info
        this.userInfoSubject.next({
          name: this._username,
          role: this._role,
          companyName: this._companyName,
          companySize: this._companySize
        });
      } else {
        // Reset values when no user
        this.resetUserInfo();
      }
    });
  }

  /**
   * Get username
   */
  getUsername(): string {
    return this._username;
  }

  /**
   * Get user role
   */
  getRole(): string {
    return this._role;
  }

  /**
   * Get company name
   */
  getCompanyName(): string {
    return this._companyName;
  }

  /**
   * Get company size
   */
  getCompanySize(): string {
    return this._companySize;
  }

  /**
   * Get all user info as object
   */
  getUserInfo(): UserInfo {
    return {
      name: this._username,
      role: this._role,
      companyName: this._companyName,
      companySize: this._companySize
    };
  }

  /**
   * Check if user info is available
   */
  isUserInfoAvailable(): boolean {
    return !!(this._username && this._companyName);
  }

  /**
   * Reset user info
   */
  private resetUserInfo(): void {
    this._username = '';
    this._role = '';
    this._companyName = '';
    this._companySize = '';

    this.userInfoSubject.next({
      name: '',
      role: '',
      companyName: '',
      companySize: ''
    });
  }

  /**
   * Update user info manually (if needed)
   */
  updateUserInfo(userInfo: Partial<UserInfo>): void {
    if (userInfo.name !== undefined) this._username = userInfo.name;
    if (userInfo.role !== undefined) this._role = userInfo.role;
    if (userInfo.companyName !== undefined) this._companyName = userInfo.companyName;
    if (userInfo.companySize !== undefined) this._companySize = userInfo.companySize;

    this.userInfoSubject.next(this.getUserInfo());
  }
}