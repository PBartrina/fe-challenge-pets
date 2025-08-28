import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PetsService, Pet } from 'data-access-pets';
import { NgIf } from '@angular/common';

@Component({
  selector: 'feature-pet-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIf],
  templateUrl: './pet-detail.component.html',
  styleUrls: ['./pet-detail.component.scss'],
})
export class PetDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PetsService);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));
  private readonly pet$ = this.api.getPetById(this.id);

  readonly pet = toSignal<Pet | undefined>(this.pet$, { initialValue: undefined });

  // Preserve current list state (query params) when going back
  readonly backQuery = computed(() => this.route.snapshot.queryParams);
}
