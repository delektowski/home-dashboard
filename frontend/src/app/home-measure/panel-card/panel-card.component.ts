import { Component, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PrimeIcons } from 'primeng/api';
import { Badge } from 'primeng/badge';
import { SeverityEnum } from '../../models/severity.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-panel-card',
  imports: [PanelModule, AvatarModule, ButtonModule, MenuModule, Badge, DatePipe],
  templateUrl: './panel-card.component.html',
  styleUrl: './panel-card.component.scss',
})
export class PanelCardComponent implements OnInit, OnChanges {
  @Input()
  title = '';

  @Input()
  currentTemperature: number | undefined;
  @Input() createdAt: string | undefined;

  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  protected severityValue = signal<SeverityEnum>(SeverityEnum.SECONDARY);

  ngOnInit(): void {
    this.items = [
      {
        label: 'Full Screen',
        icon: PrimeIcons.ARROWS_H,
      },
    ];

  }

  ngOnChanges(changes:SimpleChanges): void {
    this.setBadgeColor(this.currentTemperature);
  }

  setBadgeColor(temperature: number | undefined) {
    if (temperature) {
      if (temperature <= 1) {
        this.severityValue.set(SeverityEnum.SECONDARY);
      }
      if (temperature > 1 &&
        temperature < 18) {
        this.severityValue.set(SeverityEnum.CONTRAST);
      }
      if (temperature >= 18 && temperature < 20) {
        this.severityValue.set(SeverityEnum.INFO);
      }
      if (temperature > 20 && temperature < 22) {
        this.severityValue.set(SeverityEnum.PRIMARY);
      }
      if (temperature >= 22 && temperature < 22) {
        this.severityValue.set(SeverityEnum.WARN);
      }
      if (temperature > 22) {
        this.severityValue.set(SeverityEnum.DANGER);
      }
    }

  }
}
