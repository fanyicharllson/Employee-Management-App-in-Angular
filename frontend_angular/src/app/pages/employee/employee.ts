import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarChart2, LucideAngularModule, Plus, UserPlus } from 'lucide-angular';
import { RouterLink, RouterLinkActive, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [FormsModule, LucideAngularModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee {

  public router =  inject(Router)
  protected readonly UserPlus = UserPlus;
  protected readonly Bars = BarChart2;
  protected readonly Plus = Plus;


  protected readonly Number = Number;
}
