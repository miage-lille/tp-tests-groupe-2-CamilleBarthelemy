import { testUser } from "src/users/tests/user-seeds";
import { InMemoryWebinarRepository } from "../adapters/webinar-repository.in-memory";
import { ChangeSeats } from "./change-seats";
import { Webinar } from "../entities/webinar.entity";
import { setupChangeSeatsFixtures } from "./change-seats.fixtures";

describe('Feature : Change seats', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let useCase: ChangeSeats;
  let expectWebinarToRemainUnchanged: any;
  let whenUserChangeSeatsWith: any;
  let thenUpdatedWebinarSeatsShouldBe: any;

  const webinar = new Webinar({
    id: 'webinar-id',
    organizerId: testUser.alice.props.id,
    title: 'Webinar title',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: new Date('2024-01-01T01:00:00Z'),
    seats: 100,
  });

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository([webinar]);
    useCase = new ChangeSeats(webinarRepository);
    const fixtures = setupChangeSeatsFixtures(webinarRepository, useCase);
    expectWebinarToRemainUnchanged = fixtures.expectWebinarToRemainUnchanged;
    whenUserChangeSeatsWith = fixtures.whenUserChangeSeatsWith;
    thenUpdatedWebinarSeatsShouldBe = fixtures.thenUpdatedWebinarSeatsShouldBe;
  });

  describe('Scenario: Happy path', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 200,
    };
    it('should change the number of seats for a webinar', async () => {
      await whenUserChangeSeatsWith(payload);
      
      await thenUpdatedWebinarSeatsShouldBe(200);
    });

  });
  describe('Scenario: webinar does not exist', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'non-existent-id',
      seats: 200,
    };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('Webinar not found');

      expectWebinarToRemainUnchanged()
    });
  });
  describe('Scenario: update the webinar of someone else', () => {
    const payload = {
      user: testUser.bob,
      webinarId: 'webinar-id',
      seats: 200,
    };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('User is not allowed to update this webinar');

      expectWebinarToRemainUnchanged()
    });
  });
  describe('Scenario: change seat to an inferior number', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 50,
    };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('You cannot reduce the number of seats');

      expectWebinarToRemainUnchanged()
    });
  });
  describe('Scenario: change seat to a number > 1000', () => {
    const payload = {
      user: testUser.alice,
      webinarId: 'webinar-id',
      seats: 1001,
    };
    it('should fail', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow('Webinar must have at most 1000 seats');

      expectWebinarToRemainUnchanged()
    });
  });
});