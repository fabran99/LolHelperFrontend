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

// Imagenes
export const selectImgLinks = createSelector(
  [selectAssets],
  (assets) => assets.img_links
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
    accumulatedObject[item.key] = item;
  }, {})
);

export const selectItemById = (itemId) =>
  createSelector([selectItemsAsDict], (items) => items[itemId]);
