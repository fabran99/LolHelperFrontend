const { request } = require("league-connect");

// Runes
const parseRunepage = (runepage, champName, make_current) => {
  make_current = make_current || false;

  var edited = {
    primaryStyleId: runepage.primary.main,
    subStyleId: runepage.secondary.main,
    selectedPerkIds: [],
  };

  for (let i = 0; i < 4; i++) {
    edited.selectedPerkIds.push(runepage.primary[`perk${i}`]);
  }
  for (let i = 4; i < 6; i++) {
    edited.selectedPerkIds.push(runepage.secondary[`perk${i}`]);
  }

  for (let i = 0; i < 3; i++) {
    edited.selectedPerkIds.push(runepage.perks[`statPerk${i}`]);
  }

  if (make_current) {
    edited.isActive = true;
  }

  edited.name = `${champName}`;

  return edited;
};

const updateRunePage = async (event, data) => {
  var data = JSON.parse(data);
  const { runePage, champName, connection } = data;

  var rpage = parseRunepage(runePage, champName, true);

  var pageList = await request(
    {
      url: "/lol-perks/v1/pages",
      method: "GET",
    },
    connection
  );

  pageList = await pageList.json();
  var editable = pageList.filter((item) => {
    return item.isEditable;
  });

  if (!editable.length) {
    var postPage = await request(
      {
        url: `/lol-perks/v1/pages`,
        method: "POST",
        body: rpage,
      },
      connection
    );

    postPage = await postPage.json();

    return postPage;
  } else {
    // Busco una runa con el nombre del champ
    var editable_and_active = editable.find((x) => x.name == champName);
    if (!editable_and_active) {
      // Reviso si alguna de las editables esta activa
      editable_and_active = editable.find((x) => x.isActive);
    }
    var to_edit = editable_and_active ? editable_and_active : editable[0];

    to_edit = { ...rpage, id: to_edit.id };
    // Mando a actualizar
    var deletePage = await request(
      {
        url: `/lol-perks/v1/pages/${to_edit.id}`,
        method: "DELETE",
        body: to_edit,
      },
      connection
    );

    var postPage = await request(
      {
        url: `/lol-perks/v1/pages`,
        method: "POST",
        body: to_edit,
      },
      connection
    );

    postPage = await postPage.json();

    return postPage;
  }
};

// Player info
const getSummonerInfoById = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);
  var result = await request(
    {
      url: `/lol-summoner/v1/summoners/${summonerId}`,
      method: "GET",
      json: true,
    },
    connection
  );

  var parsedResult = await result.json();
  return parsedResult;
};

const getSummonerMasteries = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);

  var result = await request(
    {
      url: `/lol-collections/v1/inventories/${summonerId}/champion-mastery/`,
      method: "GET",
      json: true,
    },
    connection
  );

  var parsedResult = await result.json();
  return parsedResult;
};

const getBestChampsBySummoner = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);
  var result = await request(
    {
      url: `/lol-collections/v1/inventories/${summonerId}/champion-mastery/top?limit=3`,
      method: "GET",
      json: true,
    },
    connection
  );

  var parsedResult = await result.json();
  return parsedResult;
};

const getRankedStatsByPuuid = async (event, data) => {
  const { puuid, connection } = JSON.parse(data);
  var result = await request(
    {
      url: `/lol-ranked/v1/ranked-stats?puuids=["${puuid}"]`,
      method: "GET",
      json: true,
    },
    connection
  );

  var parsedResult = await result.json();
  return parsedResult;
};

// launcher actions
const checkReadyForMatch = async (event, data) => {
  const { connection } = JSON.parse(data);
  var result = await request(
    {
      url: `/lol-matchmaking/v1/ready-check/accept`,
      method: "POST",
      json: true,
    },
    connection
  );

  return result;
};

const AskLane = async (event, data) => {
  const { connection, chatRoomName, lane } = JSON.parse(data);
  var id = chatRoomName.split("@")[0];
  if (!id) {
    return null;
  }
  var result = await request(
    {
      url: `/lol-chat/v1/conversations/${id}/messages`,
      method: "POST",
      json: true,
      body: {
        body: lane,
      },
    },
    connection
  );

  result = await result.json();
  return result;
};

module.exports = {
  parseRunepage,
  updateRunePage,
  getSummonerInfoById,
  getBestChampsBySummoner,
  getRankedStatsByPuuid,
  checkReadyForMatch,
  AskLane,
  getSummonerMasteries,
};
