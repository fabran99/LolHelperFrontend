const { request } = require("league-connect");
const rp = require("request-promise");

class GenericHandler {
  constructor(connection) {
    this.connection = connection;
  }

  async genericGet(url) {
    var result = await request(
      {
        url,
        method: "GET",
        json: true,
      },
      this.connection
    );

    result = result.json();

    return result;
  }
}

// ==========================
// Runas
// ==========================
class RuneHandler extends GenericHandler {
  // Retorna lista de paginas de runas
  async getRunePages() {
    var pageList = await this.genericGet("/lol-perks/v1/pages");
    return pageList;
  }

  // Crea una pagina de runas
  async postRunePage(runePage) {
    var postPage = await request(
      {
        url: `/lol-perks/v1/pages`,
        method: "POST",
        body: runePage,
      },
      this.connection
    );

    postPage = await postPage.json();

    return postPage;
  }

  // Elimino una pagina de runas
  async deleteRunePage(runePage) {
    var deletePage = await request(
      {
        url: `/lol-perks/v1/pages/${runePage.id}`,
        method: "DELETE",
        body: runePage,
      },
      this.connection
    );

    return deletePage;
  }

  // Devuelve la pagina de runas activa
  async getCurrentRunePage() {
    var pageList = await this.getRunePages();
    var current = pageList.find((x) => x.isActive);

    return current;
  }

  // Actualiza una pagina de runa (elimina la actual y pone la nueva en su lugar)
  // Debido a bugs en el launcher
  async updateRunePage(currentRunePage, updatedRunePage) {
    if (currentRunePage && currentRunePage.isEditable) {
      var finalRunePage = { ...updatedRunePage, id: currentRunePage.id };
      var deletePage = await this.deleteRunePage(finalRunePage);
      var postPage = await this.postRunePage(finalRunePage);
      return postPage;
    }
    // Si la runa que me pasaron no existe retorno error
    else {
      return Promise.reject("La pagina solicitada no existe");
    }
  }

  // Actualiza una pagina de runas usando el metodo put, la interfaz del launcher
  // puede buguearse al usarla
  async realUpdateRunePage(currentRunePage, updatedRunePage) {
    if (currentRunePage && currentRunePage.isEditable) {
      var finalRunePage = { ...updatedRunePage, id: currentRunePage.id };
      var updatePage = await request(
        {
          url: `/lol-perks/v1/pages/${finalRunePage.id}`,
          method: "PUT",
          body: finalRunePage,
        },
        this.connection
      );
      return updatePage;
    }
    // Si la runa que me pasaron no existe retorno error
    else {
      return Promise.reject("La pagina solicitada no existe");
    }
  }

  // Setea una pagina de runas sobre la actual, o crea una si no es editable
  async setRunePage(runePage) {
    var currentRune = await this.getCurrentRunePage();

    // Intento modificar la actual si es posible
    if (
      currentRune &&
      currentRune.isEditable &&
      currentRune.name == runePage.name
    ) {
      var setedRunePage = await this.updateRunePage(currentRune, runePage);
      return setedRunePage;
    } else {
      var pageList = await this.getRunePages();

      var editable = pageList.filter((item) => {
        return item.isEditable;
      });

      // Si no hay paginas editables creo una
      if (!editable.length) {
        var postPage = await this.postRunePage(runePage);
        return postPage;
      } else {
        // Busco una runa con el mismo nombre que la deseada
        var editable_and_active = editable.find((x) => x.name == runePage.name);

        if (!editable_and_active) {
          // Reviso si alguna de las editables esta activa para modificar esa
          editable_and_active = editable.find((x) => x.isActive);
        }
        var to_edit = editable_and_active ? editable_and_active : editable[0];

        to_edit = { ...runePage, id: to_edit.id };
        // Elimino la actual y la creo nuevamente para que la interfaz la tome correctamente
        var deletePage = await this.deleteRunePage(to_edit);
        var postPage = await this.postRunePage(to_edit);
        return postPage;
      }
    }
  }
}

// ==========================
// Jugadores
// ==========================
class SummonersHandler extends GenericHandler {
  // Info de un jugador por su summonerId
  async getSummonerDataById(summonerId) {
    var result = await this.genericGet(
      `/lol-summoner/v1/summoners/${summonerId}`
    );

    return result;
  }
  // Info de un jugador por su summonerName
  async getSummonerDataByName(summonerName) {
    var result = await this.genericGet(
      encodeURI(`/lol-summoner/v1/summoners?name=${summonerName}`)
    );

    return result;
  }

  // Maestrias de un jugador por su summonerId
  async getSummonerMasteriesById(summonerId, top = null) {
    var url = `/lol-collections/v1/inventories/${summonerId}/champion-mastery/`;

    if (top) {
      url = `${url}top?limit=${top}`;
    }
    var result = await this.genericGet(url);
    return result;
  }

  // Estadisticas de ranked de jugador por su puuid
  async getRankedStatsByPuuid(puuid) {
    var result = await this.genericGet(`/lol-ranked/v1/ranked-stats/${puuid}`);
    return result;
  }

  // Retorna la lista de partidas de un jugador por su puuid
  async getMatchlistByPuuid(puuid) {
    var result = await this.genericGet(
      `/lol-career-stats/v1/summoner-games/${puuid}`
    );

    return result;
  }

  // Estadisticas del jugador actual
  async getCurrentSummonerData() {
    var result = await this.genericGet(`/lol-summoner/v1/current-summoner`);

    return result;
  }
  // Solicita el detalle de un match
  async getMatchDetail(matchId) {
    var result = await this.genericGet(
      `/lol-match-history/v1/games/${matchId}`
    );
    return result;
  }

  // Obtiene datos de la region del jugador
  async getRegionData() {
    var result = await this.genericGet(`/riotclient/get_region_locale`);
    return result;
  }
}

// ==========================
// Eventos del launcher
// ==========================
class LauncherHandler extends GenericHandler {
  // Acepta la partida una vez salta el evento
  async checkReadyForMatch() {
    var result = await request(
      {
        url: `/lol-matchmaking/v1/ready-check/accept`,
        method: "POST",
        json: true,
      },
      this.connection
    );

    return result;
  }

  // Rechaza la partida una vez salta el evento
  async declineMatch() {
    var result = await request(
      {
        url: `/lol-matchmaking/v1/ready-check/decline`,
        method: "POST",
        json: true,
      },
      this.connection
    );

    return result;
  }

  // Escribe en una sala de chat determinada
  async writeInChat(id, text) {
    var result = await request(
      {
        url: `/lol-chat/v1/conversations/${id}/messages`,
        method: "POST",
        json: true,
        body: {
          body: text,
        },
      },
      this.connection
    );

    result = await result.json();
    return result;
  }

  // Manda a reiniciar la interfaz del launcher
  async restartUx() {
    var result = await request(
      {
        url: `/riotclient/kill-and-restart-ux`,
        method: "POST",
        json: true,
      },
      this.connection
    );

    return result;
  }

  // ==========================================
  // Datos del juego
  // ==========================================

  // Solicita los datos de la partida actual
  async getCurrentGameData() {
    var options = {
      method: "GET",
      uri: `https://127.0.0.1:2999/liveclientdata/allgamedata`,
      resolveWithFullResponse: true,
      strictSSL: false,
    };

    var result = await rp(options);
    return JSON.parse(result.body);
  }

  // Solicita datos de la seleccion
  async getChampSelectData() {
    var result = await this.genericGet("/lol-champ-select/v1/session");
    return result;
  }

  // Solicita datos del lobby
  async getLobbyData() {
    var result = await this.genericGet("/lol-lobby/v2/lobby");
    return result;
  }

  // Solicita datos de la sesion
  async getSessionData() {
    var result = await this.genericGet("/lol-gameflow/v1/session");
    return result;
  }
}

module.exports = { RuneHandler, SummonersHandler, LauncherHandler };
