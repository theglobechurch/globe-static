const { expect, describe, test } = require('@jest/globals');
const filters = require('../../src/_utils/11ty.filters');
const events = require('../data/events.json');

describe('Format date', () => {
  const dateStr = "2024-04-27T10:30:00";
  const dateFormat = "dddd, D MMMM YYYY, h:mma";

  test('Format date defaults to year,month,day', () => {
    const formattedDate = filters.formatDate(dateStr);
    expect(formattedDate).toBe("2024-04-27");
  });

  test('Format date handles no input', () => {
    expect(filters.formatDate()).toBe(undefined);
  });

  test('Format date handles not a date', () => {
    const notDateStr = "Hello world";
    expect(filters.formatDate(notDateStr)).toBe(undefined);
  });

  test('Format date should accept different date formats', () => {
    const expectedStr = "Saturday, 27 April 2024, 10:30am";
    expect(filters.formatDate(dateStr, dateFormat)).toBe(expectedStr);
  });
});

describe('Events this week', () => {
  test('Only return events happening in current week', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-11-01'));

    const thisWeek = filters.eventThisWeek(events);
    expect(thisWeek).toBeInstanceOf(Array);
    expect(thisWeek.length).toEqual(1);
    expect(thisWeek[0].title).toBe("Sunday Service");

    jest.useRealTimers();
  });
});

describe('Events in the future', () => {
  test('Only events in the future should be returned', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-11-01'));

    const futureEvents = filters.eventsFuture(events);
    expect(futureEvents).toBeInstanceOf(Array);
    expect(futureEvents.length).toEqual(3);

    jest.useRealTimers();
  });

  test('Only future events can be offset by days', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-11-01'));

    const futureEvents = filters.eventsFuture(events, 7);
    expect(futureEvents).toBeInstanceOf(Array);
    expect(futureEvents.length).toEqual(2);

    jest.useRealTimers();
  });

  test('Only future events can be offset by months', () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-11-01'));

    const futureEvents = filters.eventsFuture(events, 7, 'months');
    expect(futureEvents).toBeInstanceOf(Array);
    expect(futureEvents.length).toEqual(1);

    jest.useRealTimers();
  });
});

describe('Event sorting', () => {
  test('Events should be sorted by start date', () => {
    const sortedEvents = filters.eventsSort(events);
    expect(sortedEvents).toBeInstanceOf(Array);
    expect(sortedEvents.length).toEqual(4);
    expect(sortedEvents[0].startDate).toBe("2022-10-30T16:00:00+00:00");
    expect(sortedEvents[1].startDate).toBe("2022-11-06T16:00:00+00:00");
    expect(sortedEvents[2].startDate).toBe("2023-01-06T00:00:00+00:00");
    expect(sortedEvents[3].startDate).toBe("2024-04-27T10:30:00+01:00");
  })
})

describe('One off events', () => {
  test('Should fish out one off events', () => {
    const oneOffEvents = filters.eventsOneOff(events);
    expect(oneOffEvents).toBeInstanceOf(Array);
    expect(oneOffEvents.length).toEqual(2);
    expect(oneOffEvents[0].recurring).toBeFalsy();
  });
});


describe('Limit filter', () => {
  test('Should limit the input array', () => {
    const inArr = [1,2,3,4,5,6,7,8,9];
    const outArr = filters.limit(inArr, 2);
    expect(outArr.length).toEqual(2);
    expect(outArr).toEqual([1,2]);
  })
});
