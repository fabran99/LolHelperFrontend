import Emblem_Bronze from "../img/emblems/Emblem_Bronze.png";
import Emblem_Challenger from "../img/emblems/Emblem_Challenger.png";
import Emblem_Diamond from "../img/emblems/Emblem_Diamond.png";
import Emblem_Gold from "../img/emblems/Emblem_Gold.png";
import Emblem_Iron from "../img/emblems/Emblem_Iron.png";
import Emblem_Master from "../img/emblems/Emblem_Master.png";
import Emblem_Platinum from "../img/emblems/Emblem_Platinum.png";
import Emblem_Silver from "../img/emblems/Emblem_Silver.png";
import Emblem_Grandmaster from "../img/emblems/Emblem_Grandmaster.png";

export const runesFromChamp = (champ_data, assets, lane) => {
  if (!lane || champ_data.lanes.indexOf(lane) == -1) {
    lane = champ_data.lanes[0];
  }
  var current_lane_data = champ_data.info_by_lane.find((el) => el.lane == lane);
  var runes = assets.runes;
  var perks = assets.perks;
  var champ_runes = current_lane_data.runes;

  //  Runas primarias
  var primaryRune = runes.find((item) => {
    return item.id == champ_runes.primary.main;
  });

  var primaryPerks = [];
  for (let i = 0; i < 4; i++) {
    let selected = champ_runes.primary[`perk${i}`];
    let current_rune = primaryRune.slots.find((item) => item.id == selected);
    if (current_rune) {
      primaryPerks.push(current_rune);
    }
  }

  // Runas secundarias
  var secondaryRune = runes.find((item) => {
    return item.id == champ_runes.secondary.main;
  });

  var secondaryPerks = [];

  for (let i = 4; i < 6; i++) {
    let selected = champ_runes.secondary[`perk${i}`];
    let current_rune = secondaryRune.slots.find((item) => item.id == selected);
    if (current_rune) {
      secondaryPerks.push(current_rune);
    }
  }

  // Perks
  var perkList = [];

  for (let i = 0; i < 3; i++) {
    let perk_id = champ_runes.perks[`statPerk${i}`];
    let perk_data = perks.find((x) => x.id == perk_id);
    if (perk_data) {
      perkList.push(perk_data);
    }
  }

  return {
    primaryRune,
    secondaryRune,
    primaryPerks,
    secondaryPerks,
    perkList,
  };
};

export const runesFromPlayer = (champ_runes, assets) => {
  var runes = assets.runes;
  var perks = assets.perks;

  //  Runas primarias
  var primaryRune = runes.find((item) => {
    return item.id == champ_runes.primary.main;
  });

  var primaryPerks = [];
  for (let i = 0; i < 4; i++) {
    let selected = champ_runes.primary[`perk${i}`];
    let current_rune = primaryRune.slots.find((item) => item.id == selected);
    if (current_rune) {
      primaryPerks.push(current_rune);
    }
  }

  // Runas secundarias
  var secondaryRune = runes.find((item) => {
    return item.id == champ_runes.secondary.main;
  });

  var secondaryPerks = [];

  for (let i = 4; i < 6; i++) {
    let selected = champ_runes.secondary[`perk${i}`];
    let current_rune = secondaryRune.slots.find((item) => item.id == selected);
    if (current_rune) {
      secondaryPerks.push(current_rune);
    }
  }

  // Perks
  var perkList = [];

  for (let i = 0; i < 3; i++) {
    let perk_id = champ_runes.perks[`statPerk${i}`];
    let perk_data = perks.find((x) => x.id == perk_id);
    if (perk_data) {
      perkList.push(perk_data);
    }
  }

  return {
    primaryRune,
    secondaryRune,
    primaryPerks,
    secondaryPerks,
    perkList,
  };
};

export const itemsFromChamp = (champ_data, assets, lane) => {
  if (!lane || champ_data.lanes.indexOf(lane) == -1) {
    lane = champ_data.lanes[0];
  }
  var current_lane_data = champ_data.info_by_lane.find((el) => el.lane == lane);

  var build = [];
  var boots = assets.items.find(
    (item) => item.id == current_lane_data.build.boots[0]
  );
  if (boots) {
    build.push(boots);
  }

  current_lane_data.build.items.forEach((item_id) => {
    var match = assets.items.find((it) => it.id == item_id);
    if (match) {
      build.push(match);
    }
  });

  if (build.length < 6) {
    for (let i = 0; i < current_lane_data.build.secondary.length; i++) {
      if (build.length >= 6) {
        break;
      }
      var match = assets.items.find(
        (it) => it.id == current_lane_data.build.secondary[i]
      );
      if (match) {
        build.push(match);
      }
    }
  }

  var trinket = assets.items.find(
    (item) => item.id == current_lane_data.build.trinket[0]
  );
  build.push(trinket);

  return build;
};

export const spellsFromChamp = (champ_data, assets, lane = "") => {
  if (!lane || champ_data.lanes.indexOf(lane) == -1) {
    lane = champ_data.lanes[0];
  }
  var current_lane_data = champ_data.info_by_lane.find((el) => el.lane == lane);
  var spells = assets.spells.filter((summ, i) => {
    return current_lane_data.spells.indexOf(parseInt(summ.key)) != -1;
  });

  const flash = 4;
  spells = spells.sort((a, b) => {
    if (parseInt(a.key) == flash) {
      return -1;
    }
    if (a == b) {
      return 0;
    }
    return parseInt(a.key) > parseInt() ? -1 : 1;
  });

  return spells;
};

export const emblems = {
  DIAMOND: Emblem_Diamond,
  BRONZE: Emblem_Bronze,
  GOLD: Emblem_Gold,
  IRON: Emblem_Iron,
  SILVER: Emblem_Silver,
  PLATINUM: Emblem_Platinum,
  GRANDMASTER: Emblem_Grandmaster,
  CHALLENGER: Emblem_Challenger,
  Master: Emblem_Master,
};
