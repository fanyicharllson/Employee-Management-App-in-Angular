import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionService } from '../../services/connection.service';

@Injectable({ providedIn: 'root' })
export class ConnectionGuard implements CanActivate {
  private connection = inject(ConnectionService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.connection.online$.pipe(
      map((isOnline) => {
        if (!isOnline) {
          this.router.navigate(['/no-internet']);
          return false;
        }
        return true;
      }),
    );
  }
}
