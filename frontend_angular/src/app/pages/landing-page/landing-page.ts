import { Component, OnInit, signal } from '@angular/core';
import { LHeader } from '../../component/l-header/l-header';
import { Hero } from '../../component/hero/hero';
import { Features } from '../../component/features/features';
import { Cta } from "../../component/cta/cta";
import { Footer } from "../../component/footer/footer";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-landing-page',
  imports: [LHeader, Hero, Features, Cta, Footer, MatSlideToggleModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
