import { Component } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../component/sidebar/sidebar';
import { DHeader } from '../../component/d-header/d-header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, DHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
