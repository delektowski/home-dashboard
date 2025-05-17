import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {Badge} from 'primeng/badge';
import {Severity} from '../../models/severity';
import {DatePipe, NgClass, NgTemplateOutlet} from '@angular/common';
import {HomeMeasuresService} from '../../services/home-measures.service';
import {ProgressSpinner} from 'primeng/progressspinner';
import {HomeMeasuresLastAggregatedModel} from '../../models/home-measures-last-aggregated.model';
import {OverlayBadgeModule} from 'primeng/overlaybadge';

@Component({
  selector: 'app-panel-card',
  imports: [PanelModule, AvatarModule, ButtonModule, MenuModule, Badge, DatePipe, NgClass, ProgressSpinner, NgTemplateOutlet,OverlayBadgeModule],
  templateUrl: './panel-card.component.html',
  styleUrl: './panel-card.component.scss',
})
export class PanelCardComponent implements OnInit, OnChanges, AfterViewInit {
  protected homeMeasuresService = inject(HomeMeasuresService);
  @Input() measuresLastAggregated?: HomeMeasuresLastAggregatedModel;


  protected severityValueTemperature: WritableSignal<Severity> = signal<Severity>("secondary");

  protected defaultSeverity: WritableSignal<Severity> = signal<Severity>("secondary");

  protected severityConfig = new Map<string, WritableSignal<Severity>>();

  protected measuresLastAggregatedKeys: (keyof HomeMeasuresLastAggregatedModel)[] = []

  isInitialized = false;

  notMeasureKeys = new Set(['placeName', 'createdAt', '__typename']);
  temperatureKeys = new Set(["temperature", "maxTemperature", "minTemperature", "avgTemperature"]);

  ngOnInit() {
    this.setMeasuresLastAggregatedKeys();
    this.setSeverityConfig();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setSeverityConfig();
  }

  /**
   * Is needed in order to hide the panel for a moment once it is extended for a while
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isInitialized = true;
    }, 80);
  }

  setMeasuresLastAggregatedKeys(): void {
    if (this.measuresLastAggregated) {

      Object.keys(this.measuresLastAggregated).forEach((key) => {
        if (!this.notMeasureKeys.has(key)) {
          this.measuresLastAggregatedKeys.push((key as keyof HomeMeasuresLastAggregatedModel))
        }
      })
    }
  }

  setSeverityConfig(): void {

    if (this.measuresLastAggregated) {
      for (let [measuresLastAggregatedKey, measuresLastAggregatedValue] of Object.entries(this.measuresLastAggregated)) {
        const isMeasure = !this.notMeasureKeys.has(measuresLastAggregatedKey)

        if (measuresLastAggregatedValue && isMeasure) {

          if (this.temperatureKeys.has(measuresLastAggregatedKey)) {
            this.severityConfig.set(measuresLastAggregatedKey, this.setTemperatureSeverityColor(measuresLastAggregatedValue))
          } else {
            this.severityConfig.set(measuresLastAggregatedKey, this.setHumiditySeverityColor(measuresLastAggregatedValue))
          }
        }
      }
    }
  }



  setTemperatureSeverityColor(temperature: number | undefined): WritableSignal<Severity> {
    const severityValue = signal<Severity>("secondary")
    if (temperature) {
      if (temperature <= 1) {
        severityValue.set("secondary");
      }
      if (temperature > 1 &&
        temperature < 18) {
        severityValue.set("contrast");
      }
      if (temperature >= 18 && temperature < 20) {
        severityValue.set("info");
      }
      if (temperature >= 20 && temperature < 22) {
        severityValue.set("success");
      }
      if (temperature >= 22 && temperature < 24) {
        severityValue.set("warn");
      }
      if (temperature >= 24) {
        severityValue.set("danger");
      }
    }

    return severityValue
  }



  setHumiditySeverityColor(humidity: number | undefined): WritableSignal<Severity> {
    const severityValue = signal<Severity>("secondary")
    if (humidity) {
      if (humidity <= 69) {
        severityValue.set("success");
      }
      if (humidity > 69 && humidity <= 80) {
        severityValue.set("warn");
      }
      if (humidity > 80) {
        severityValue.set("danger");
      }
    }

    return severityValue
  }

  onCollapsedChange($event: any) {
    console.log("$event", $event)
  }
}
