import { InMemoryWebinarRepository } from '../adapters/webinar-repository.in-memory';
import { ChangeSeats } from './change-seats';

export function setupChangeSeatsFixtures(
  webinarRepository: InMemoryWebinarRepository,
  useCase: ChangeSeats
) {
  return {
    expectWebinarToRemainUnchanged() {
      const webinar = webinarRepository.findByIdSync('webinar-id');
      expect(webinar?.props.seats).toEqual(100);
    },

    async whenUserChangeSeatsWith(payload: { user: any; webinarId: string; seats: number }) {
      return useCase.execute(payload);
    },

    async thenUpdatedWebinarSeatsShouldBe(expectedSeats: number) {
      const updatedWebinar = await webinarRepository.findById('webinar-id');
      expect(updatedWebinar?.props.seats).toEqual(expectedSeats);
    },
  };
}
