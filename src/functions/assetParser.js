export const runesFromChamp = (champ_data, assets) => {
  var runes = assets.runes;
  var perks = assets.perks;
  var champ_runes = champ_data.runes;

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

export const itemsFromChamp = (champ_data, assets) => {
  var build = [];
  var boots = assets.items.find((item) => item.id == champ_data.build.boots[0]);
  if (boots) {
    build.push(boots);
  }

  champ_data.build.items.forEach((item_id) => {
    var match = assets.items.find((it) => it.id == item_id);
    if (match) {
      build.push(match);
    }
  });

  if (build.length < 6) {
    for (let i = 0; i < champ_data.build.secondary.length; i++) {
      if (build.length >= 6) {
        break;
      }
      var match = assets.items.find(
        (it) => it.id == champ_data.build.secondary[i]
      );
      if (match) {
        build.push(match);
      }
    }
  }

  var trinket = assets.items.find(
    (item) => item.id == champ_data.build.trinket[0]
  );
  build.push(trinket);

  return build;
};

export const spellsFromChamp = (champ_data, assets) => {
  var spells = assets.spells.filter((summ, i) => {
    return champ_data.spells.indexOf(parseInt(summ.key)) != -1;
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
