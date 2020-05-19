import { url_champ_runes } from "../endpoints/stats";
import axios from "axios";
// import { request } from "../helpers/lcuConnect";

export const parseRunepage = (runepage, champName, make_current) => {
  make_current = make_current || false;
  console.log(runepage);

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

  // edited.name = `Auto Runes for ${champName}`;

  return edited;
};

export const updateRunePage = (index, runepage, connection) => {
  request(
    {
      url: "/lol-perks/v1/pages",
      method: "GET",
    },
    connection
  )
    .then((res) => {
      res.json().then((rlist) => {
        //  Edito la pagina actual con los valores nuevos
        console.log(rlist);
        var edited = rlist.find((item) => {
          return item.isEditable;
        });
        edited = { ...runepage, id: edited.id, name: edited.name };
        console.log(edited);
        // Mando a actualizar
        request({
          url: `/lol-perks/v1/pages/${edited.id}`,
          method: "PUT",
          body: edited,
        })
          .then((ed) => {
            // request({
            //   url: `/lol-perks/v1/pages`,
            //   method: "POST",
            //   body: edited,
            // }).then((ed) => {
            console.log(ed);
            // });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateFirstRunepageByChampStats = (connection, champ, elo) => {
  elo = elo || "high_elo";
  // Solicito runas

  axios
    .get(url_champ_runes(champ, elo))
    .then((res) => {
      if (res.status == 200) {
        var rpage = parseRunepage(res.data.runes, res.data.champName, true);
        console.log(rpage);
        updateRunePage(0, rpage, connection);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
