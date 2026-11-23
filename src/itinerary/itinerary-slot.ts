import { BadRequestException } from '@nestjs/common';

export interface Slot {
  date: string;
  start_time: string;
  end_time: string;
}

// date inside the trip, end after start and no overlap with the other
// activities of the same day (CU10, figure 4 of the PEC2)
export function checkSlot(
  slot: Slot,
  trip: { start_date: string; end_date: string },
  others: Slot[],
): void {
  if (slot.date < trip.start_date || slot.date > trip.end_date) {
    throw new BadRequestException(
      'La fecha está fuera de las fechas del viaje',
    );
  }
  if (slot.end_time <= slot.start_time) {
    throw new BadRequestException(
      'La hora de fin tiene que ser posterior a la de inicio',
    );
  }
  const overlap = others.find(
    (o) =>
      o.date === slot.date &&
      slot.start_time < o.end_time &&
      o.start_time < slot.end_time,
  );
  if (overlap) {
    throw new BadRequestException(
      `Se solapa con otra actividad de ese día (${overlap.start_time}–${overlap.end_time})`,
    );
  }
}
