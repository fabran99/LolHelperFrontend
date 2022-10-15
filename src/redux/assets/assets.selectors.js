import { createSelector } from "reselect";

const selectAssets = (state) => state.assets;

// General
export const selectAssetError = createSelector(
  [selectAssets],
  (assets) => assets.error
);
export const selectLolVersion = createSelector(
  [selectAssets],
  (assets) => assets.lol_version
);

export const selectAssetsLoaded = createSelector(
  [selectAssets],
  (assets) => !!assets.champions
);

// Runas
export const selectRunes = createSelector(
  [selectAssets],
  (assets) => assets.runes
);

export const selectPerks = createSelector(
  [selectAssets],
  (assets) => assets.perks
);

// Imagenes
export const selectImgLinks = createSelector(
  [selectAssets],
  (assets) => assets.img_links
);

// Spells
export const selectSpells = createSelector(
  [selectAssets],
  (assets) => assets.spells
);

// Champions
export const selectChampionInfoExists = createSelector(
  [selectAssets],
  (assets) => !!assets.champions
);

export const selectChampions = createSelector(
  [selectAssets],
  (assets) => assets.champions
);

export const selectChampionsAsDict = createSelector(
  [selectChampions],
  (champions) =>
    champions.reduce((accumulatedObject, champion) => {
      accumulatedObject[champion.championId] = champion;
      return accumulatedObject;
    }, {})
);

export const selectChampionById = (championId) =>
  createSelector([selectChampionsAsDict], (champions) => champions[championId]);

// Ranking
export const selectRanking = createSelector(
  [selectAssets],
  (assets) => assets.ranking
);

// Items
export const selectItems = createSelector(
  [selectAssets],
  (assets) => assets.items
);

export const selectItemsAsDict = createSelector([selectAssets], (assets) =>
  assets.items.reduce((accumulatedObject, item) => {
    accumulatedObject[item.id] = item;
    return accumulatedObject;
  }, {})
);

export const selectItemById = (itemId) =>
  createSelector([selectItemsAsDict], (items) => items[itemId]);

// radar_stats
export const selectRadarStatsByElo = createSelector([selectAssets], (assets) =>
  assets.radar_stats.reduce((accumulatedObject, radar_stat) => {
    accumulatedObject[radar_stat.elo] = radar_stat;
    return accumulatedObject;
  })
);
