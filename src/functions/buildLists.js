export const parseBuild = (champ) => {
  var response = {
    champion: champ.key,
    lanes: champ.lanes,
    builds: [],
  };

  champ.info_by_lane.forEach((lanedata) => {
    var buildObject = {
      title: `Bard App: ${champ.name} (${lanedata.lane})`,
      champion: champ.key,
      type: "custom",
      map: "any",
      mode: "any",
      priority: true,
      sortrank: 0,
      blocks: [],
    };

    // Vision / inicio
    var class1 = [...lanedata.build.starter];
    lanedata.build.boots.forEach((boot) => {
      if (class1.indexOf(boot) == -1) {
        class1.push(boot);
      }
    });
    lanedata.build.trinket.forEach((trnk) => {
      if (class1.indexOf(trnk) == -1) {
        class1.push(trnk);
      }
    });

    buildObject.blocks.push({
      type: `Inicio / Botas / Visión (${lanedata.lane})`,
      items: class1.map((item) => {
        return { id: `${item}`, count: 1 };
      }),
      recMath: false,
      minSummonerLevel: -1,
      maxSummonerLevel: -1,
      showIfSummonerSpell: "",
      hideIfSummonerSpell: "",
    });

    // Main objs

    var class2 = [...lanedata.build.items];

    buildObject.blocks.push({
      type: `Objetos principales (${lanedata.lane})`,
      items: class2.map((item) => {
        return { id: `${item}`, count: 1 };
      }),
      recMath: false,
      minSummonerLevel: -1,
      maxSummonerLevel: -1,
      showIfSummonerSpell: "",
      hideIfSummonerSpell: "",
    });

    // Secundarios
    var class3 = [...lanedata.build.secondary];

    buildObject.blocks.push({
      type: `Objetos situacionales (${lanedata.lane})`,
      items: class3.map((item) => {
        return { id: `${item}`, count: 1 };
      }),
      recMath: false,
      minSummonerLevel: -1,
      maxSummonerLevel: -1,
      showIfSummonerSpell: "",
      hideIfSummonerSpell: "",
    });

    response.builds.push(buildObject);
  });

  return response;
};
