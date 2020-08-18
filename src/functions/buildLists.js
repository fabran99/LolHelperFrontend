export const parseBuild = (champ) => {
  var class1 = [...champ.build.boots, ...champ.build.trinket];
  var class2 = [...champ.build.items];
  var class3 = [...champ.build.secondary];
  var class4 = [class1[0], ...class2, champ.build.trinket[0]];

  var buildObject = {
    title: `Lol Helper ${champ.name}`,
    champion: champ.key,
    blocks: [
      {
        type: "Botas / Visión",
        items: class1.map((item) => {
          return { id: `${item}`, count: 1 };
        }),
        recMath: false,
        minSummonerLevel: -1,
        maxSummonerLevel: -1,
        showIfSummonerSpell: "",
        hideIfSummonerSpell: "",
      },
      {
        type: "Objetos principales",
        items: class2.map((item) => {
          return { id: `${item}`, count: 1 };
        }),
        recMath: false,
        minSummonerLevel: -1,
        maxSummonerLevel: -1,
        showIfSummonerSpell: "",
        hideIfSummonerSpell: "",
      },
      {
        type: "Objetos situacionales",
        items: class3.map((item) => {
          return { id: `${item}`, count: 1 };
        }),
        recMath: false,
        minSummonerLevel: -1,
        maxSummonerLevel: -1,
        showIfSummonerSpell: "",
        hideIfSummonerSpell: "",
      },
      {
        type: "Build Completa",
        items: class4.map((item) => {
          return { id: `${item}`, count: 1 };
        }),
        recMath: false,
        minSummonerLevel: -1,
        maxSummonerLevel: -1,
        showIfSummonerSpell: "",
        hideIfSummonerSpell: "",
      },
    ],
    type: "custom",
    map: "any",
    mode: "any",
    priority: true,
    sortrank: 0,
  };

  return buildObject;
};
