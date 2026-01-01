import { Component, inject } from '@angular/core';
import { HomeMeasuresService } from '../services/home-measures.service';
import { Button } from "primeng/button";

@Component({
  selector: 'app-global-toggle-btn',
  imports: [Button],
  templateUrl: './global-toggle-btn.component.html',
  styleUrl: './global-toggle-btn.component.scss'
})
export class GlobalToggleBtnComponent {
  protected homeMeasuresService = inject(HomeMeasuresService);

  toggleAllCollapsed() {
    this.homeMeasuresService.isAllCollapsed.set(!this.homeMeasuresService.isAllCollapsed());
  }

}
