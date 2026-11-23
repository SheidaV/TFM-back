import { proposalStatus } from '../proposals/proposals.service.js';

describe('proposalStatus', () => {
  it('accepted with more than half of the group in favour', () => {
    expect(proposalStatus(3, 0, 4)).toBe('accepted');
  });

  it('rejected when the majority can no longer be reached', () => {
    expect(proposalStatus(1, 2, 4)).toBe('rejected');
  });

  it('pending while there are votes left', () => {
    expect(proposalStatus(2, 1, 4)).toBe('pending');
  });
});
