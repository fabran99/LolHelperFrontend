// Manejo de queues
export const NORMALQUEUE = 430;
export const NORMALRECQUEUE = 400;
export const RANKEDQUEUE = 420;
export const FLEXQUEUE = 440;

export const SUMMONER_RIFT = 11;

export const QUEUENAMES = {
  [NORMALQUEUE]: "blind5",
  [NORMALRECQUEUE]: "draft5",
  [RANKEDQUEUE]: "rank5solo",
  [FLEXQUEUE]: "rank5flex",
};

export const queueTypeToName = (queue) => {
  var dictQueues = {
    rank5solo: "Ranked",
    rank5flex: "Flex",
  };

  if (queue in dictQueues) {
    return dictQueues[queue];
  } else {
    return "Normal";
  }
};

export const VALID_QUEUES = [
  NORMALQUEUE,
  NORMALRECQUEUE,
  RANKEDQUEUE,
  FLEXQUEUE,
];

// Manejo de lanes
export const API_LANES = {
  adc: "BOTTOM",
  top: "TOP",
  jungla: "JUNGLE",
  mid: "MID",
  support: "SUPPORT",
};
