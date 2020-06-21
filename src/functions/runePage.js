import { url_champ_runes } from "../endpoints/stats";
import axios from "axios";
import { league_connect } from "../helpers/outsideObjects";
const { request } = league_connect;

export const parseRunepage = (runepage, champName, make_current) => {
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

export const updateRunePage = (
  runepage,
  champName,
  connection,
  stateChanger
) => {
  var rpage = parseRunepage(runepage, champName, true);

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
        var editable = rlist.filter((item) => {
          return item.isEditable;
        });

        // Si no encuentro una intento crearla
        if (!editable.length) {
          request(
            {
              url: `/lol-perks/v1/pages`,
              method: "POST",
              body: rpage,
            },
            connection
          )
            .then((ed) => {
              stateChanger({
                runeButtonDisabled: false,
                runesApplied: true,
              });
            })
            .catch((err) => {
              stateChanger({
                runeButtonDisabled: false,
              });
            });
        } else {
          // Reviso si alguna de las editables esta activa
          var editable_and_active = editable.find((x) => x.isActive);
          var to_edit = editable_and_active ? editable_and_active : editable[0];

          to_edit = { ...rpage, id: to_edit.id };
          // Mando a actualizar
          request(
            {
              url: `/lol-perks/v1/pages/${to_edit.id}`,
              method: "DELETE",
              body: to_edit,
            },
            connection
          )
            .then((ed) => {
              request(
                {
                  url: `/lol-perks/v1/pages`,
                  method: "POST",
                  body: to_edit,
                },
                connection
              ).then((ed) => {
                stateChanger({
                  runeButtonDisabled: false,
                  runesApplied: false,
                });
              });
            })
            .catch((err) => {
              stateChanger({
                runeButtonDisabled: false,
              });
            });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
