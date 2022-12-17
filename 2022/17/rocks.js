export const types = [
  {
    s: [
      [1, 1, 1, 1]
    ],
    h: 1,
    w: 4
  },
  {
    s: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    h: 3,
    w: 3
  },
  {
    s: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1]
    ],
    h: 3,
    w: 3
  },
  {
    s: [
      [1],
      [1],
      [1],
      [1]
    ],
    h: 4,
    w: 1
  },
  {
    s: [
      [1, 1],
      [1, 1]
    ],
    h: 2,
    w: 2
  },
];

export const getRock = n => types[n % types.length];
