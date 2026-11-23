import { BadRequestException } from '@nestjs/common';
import { checkSlot } from './itinerary-slot.js';

const trip = { start_date: '2027-05-14', end_date: '2027-05-17' };
const lunch = { date: '2027-05-14', start_time: '14:00', end_time: '15:30' };

describe('checkSlot', () => {
  it('fails if the date is outside the trip', () => {
    expect(() => checkSlot({ ...lunch, date: '2027-05-20' }, trip, [])).toThrow(
      BadRequestException,
    );
  });

  it('fails if the end time is not after the start time', () => {
    expect(() =>
      checkSlot({ ...lunch, start_time: '16:00', end_time: '15:00' }, trip, []),
    ).toThrow(BadRequestException);
  });

  it('fails if it overlaps another activity of the same day', () => {
    const walk = { date: '2027-05-14', start_time: '15:00', end_time: '17:00' };
    expect(() => checkSlot(walk, trip, [lunch])).toThrow('Se solapa');
    // right after lunch is fine
    expect(() =>
      checkSlot({ ...walk, start_time: '15:30' }, trip, [lunch]),
    ).not.toThrow();
  });
});
