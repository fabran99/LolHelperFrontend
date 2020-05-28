export const statsUrls = {
  get_runes: "/stats/runes/list",
  get_runes_by_id: "/stats/runes/by_id",
};

export const url_champ_runes = (championId, elo) => {
  elo = elo || "high_elo";
  var url = `${process.env.REACT_APP_HOST}${statsUrls.get_runes_by_id}?id=${championId}&elo=${elo}`;
  console.log(url);
  return url;
};
