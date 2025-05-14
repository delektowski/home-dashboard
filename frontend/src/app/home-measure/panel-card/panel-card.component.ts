import {AfterViewInit, Component, inject, Input, OnChanges, signal, SimpleChanges, WritableSignal} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {Badge} from 'primeng/badge';
import {Severity} from '../../models/severity';
import {DatePipe, NgClass} from '@angular/common';
import {HomeMeasuresService} from '../../services/home-measures.service';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-panel-card',
  imports: [PanelModule, AvatarModule, ButtonModule, MenuModule, Badge, DatePipe, NgClass, ProgressSpinner],
  templateUrl: './panel-card.component.html',
  styleUrl: './panel-card.component.scss',
})
export class PanelCardComponent implements OnChanges, AfterViewInit {
  protected homeMeasuresService = inject(HomeMeasuresService);
  @Input()
  title: string | undefined = 'unknown name';
  @Input()
  currentTemperature: number | undefined;
  @Input() currentHumidity: number | undefined;
  @Input() createdAt: string | undefined;


  protected severityValueTemperature: WritableSignal<Severity> = signal<Severity>("secondary");

  protected severityValueHumidity: WritableSignal<Severity> = signal<Severity>("secondary");

  isInitialized = false;


  ngOnChanges(changes: SimpleChanges): void {
    this.setTemperatureBadgeColor(this.currentTemperature);
    this.setHumidityBadgeColor(this.currentHumidity);
  }

  /**
   * Is needed in order to hide the panel for a moment once it is extended for a while
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isInitialized = true;
    }, 80);
  }

  setTemperatureBadgeColor(temperature: number | undefined) {
    if (temperature) {
      if (temperature <= 1) {
        this.severityValueTemperature.set("secondary");
      }
      if (temperature > 1 &&
        temperature < 18) {
        this.severityValueTemperature.set("contrast");
      }
      if (temperature >= 18 && temperature < 20) {
        this.severityValueTemperature.set("info");
      }
      if (temperature >= 20 && temperature < 22) {
        this.severityValueTemperature.set("success");
      }
      if (temperature >= 22 && temperature < 24) {
        this.severityValueTemperature.set("warn");
      }
      if (temperature >= 24) {
        this.severityValueTemperature.set("danger");
      }
    }
  }

  setHumidityBadgeColor(humidity: number | undefined) {
    if (humidity) {
      if (humidity <= 65) {
        this.severityValueHumidity.set("success");
      }
      if (humidity > 65 && humidity <= 80) {
        this.severityValueHumidity.set("warn");
      }
      if (humidity > 80) {
        this.severityValueHumidity.set("danger");
      }
    }
  }

  onCollapsedChange($event: any) {
    console.log("$event", $event)
  }
}
