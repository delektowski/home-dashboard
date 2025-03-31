import {AfterViewInit, Component, inject, Input, OnChanges, signal, SimpleChanges, WritableSignal} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {Badge} from 'primeng/badge';
import {Severity} from '../../models/severity';
import {DatePipe, NgClass} from '@angular/common';
import {HomeMeasuresService} from '../../services/home-measures.service';

@Component({
  selector: 'app-panel-card',
  imports: [PanelModule, AvatarModule, ButtonModule, MenuModule, Badge, DatePipe, NgClass],
  templateUrl: './panel-card.component.html',
  styleUrl: './panel-card.component.scss',
})
export class PanelCardComponent implements OnChanges, AfterViewInit {
  protected homeMeasuresService = inject(HomeMeasuresService);
  @Input()
  title: string | undefined = 'unknown name';
  @Input()
  currentTemperature: number | undefined;
  @Input() createdAt: string | undefined;


  protected severityValue: WritableSignal<Severity> = signal<Severity>("secondary");

  isInitialized = false;


  ngOnChanges(changes: SimpleChanges): void {
    this.setBadgeColor(this.currentTemperature);
  }

  /**
   * Is needed in order to hide the panel for a moment once it is extended for a while
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isInitialized = true;
    },80);
  }

  setBadgeColor(temperature: number | undefined) {
    if (temperature) {
      if (temperature <= 1) {
        this.severityValue.set("secondary");
      }
      if (temperature > 1 &&
        temperature < 18) {
        this.severityValue.set("contrast");
      }
      if (temperature >= 18 && temperature < 20) {
        this.severityValue.set("info");
      }
      if (temperature > 20 && temperature < 22) {
        this.severityValue.set("success");
      }
      if (temperature >= 22 && temperature < 24) {
        this.severityValue.set("warn");
      }
      if (temperature > 24) {
        this.severityValue.set("danger");
      }
    }

  }

  onCollapsedChange($event: any) {
    console.log("$event", $event)
  }
}
