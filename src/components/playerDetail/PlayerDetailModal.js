import React, { Component } from "react";
import { connect } from "react-redux";
// import { electron } from "../../helpers/outsideObjects";
import { getIcon, getSquare } from "../../helpers/getImgLinks";
import {
  numberToDots,
  getStatsFromMatchlist,
  getTagsFromMatchlist,
  getTagsFromData,
} from "../../helpers/general";
import Matchlist from "./MatchList";
import PlayerStats from "./PlayerStats";
import moment from "moment";
import bg from "../../img/universe-bg.jpg";
import Tag from "../utility/Tag";
import CustomTooltip from "../utility/CustomTooltip";

export class PlayerDetailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchingMatchDetail: false,
      matchDetail: null,
    };

    this.escFunction = this.escFunction.bind(this);
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.props.close();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  getMatchDetail(gameId) {}

  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  render() {
    const { data, close, assets, selectedChamp } = this.props;

    var stats = getStatsFromMatchlist(data.matchlist);

    var icon = getIcon(assets.img_links, data.profileIconId, selectedChamp);

    var tags = [
      ...getTagsFromMatchlist(data.matchlist, assets, selectedChamp),
      ...getTagsFromData(data, assets, selectedChamp),
    ];

    var current_champ_mastery = null;
    if (data.masteryLevels && selectedChamp) {
      current_champ_mastery = data.masteryLevels.find(
        (el) => el.championId == parseInt(selectedChamp.championId)
      );
    }

    const bestChamps = () => {
      return (
        data.bestChamps && (
          <div className="tooltip">
            <div className="tooltip__title">Campeones mas jugados</div>
            <div className="tooltip__champlist mt-0">
              {data.bestChamps.map((item) => {
                var champData = this.getChampInfo(item.championId);
                return (
                  <div key={item.championId} className="tooltip__champ">
                    <img src={getSquare(assets.img_links, champData.key)} />
                  </div>
                );
              })}
            </div>
          </div>
        )
      );
    };

    return (
      <div className="modal">
        <div className="modal__background" onClick={close}></div>
        <div
          className="modal__content"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="modal__close" onClick={close}>
            <i className="fas fa-times"></i>
          </div>

          {/* Contenido */}
          <div className="modal__bar">Detalle de jugador</div>
          <div className="modal__content_data">
            <div className="playerdetail">
              <div className="row">
                {/* Fila izquierda */}
                <div className="col-8">
                  <div className="row">
                    {/* Icono */}
                    <div className="col-3">
                      <CustomTooltip title={bestChamps()} placement="bottom">
                        <div className="playerdetail__img">
                          <div className="border"></div>
                          {<img src={icon} />}
                          <div className="playerdetail__level">
                            {data.summonerLevel}
                          </div>
                        </div>
                      </CustomTooltip>
                    </div>
                    {/* Data del jugador */}
                    <div className="col-4">
                      <div className="playerinfo__title">
                        {data.displayName}
                      </div>
                      {data.tier &&
                        data.division &&
                        data.wins != null &&
                        data.tier != "NONE" &&
                        data.division != "NA" && (
                          <div className="playerinfo__item">
                            <span className="value">
                              {data.tier} {data.division} ({data.wins} wins)
                            </span>
                          </div>
                        )}
                      {/* Tags */}

                      <div className="playerinfo__tags">
                        {tags.map((tag, i) => {
                          return (
                            <Tag
                              key={i}
                              tooltip={tag.tooltip}
                              value={tag.value}
                              type={tag.type}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Champ actual */}
                    <div className="col-5">
                      {selectedChamp && current_champ_mastery && (
                        <div className="mastery">
                          <div className="mastery__image">
                            <div className="champ_image_container">
                              <img
                                src={getSquare(
                                  assets.img_links,
                                  selectedChamp.key
                                )}
                              />
                            </div>
                          </div>
                          <div className="mastery__name">
                            {selectedChamp.name}
                          </div>
                          <div className="mastery__data">
                            <div>
                              Nivel de maestria:{" "}
                              <div className="value ">
                                {current_champ_mastery.championLevel}
                              </div>
                            </div>

                            <div>
                              Puntos de maestria:{" "}
                              <div className="value">
                                {numberToDots(
                                  current_champ_mastery.championPoints
                                )}
                              </div>
                            </div>

                            <div>
                              Jugado:{" "}
                              <div className="value">
                                {moment
                                  .unix(
                                    current_champ_mastery.lastPlayTime / 1000
                                  )
                                  .format("DD/MM/YYYY HH:mm")}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedChamp && !current_champ_mastery && (
                        <div className="mastery">
                          <div className="mastery__image">
                            <div className="champ_image_container">
                              <img
                                src={getSquare(
                                  assets.img_links,
                                  selectedChamp.key
                                )}
                              />
                            </div>
                          </div>
                          <div className="mastery__name">
                            {selectedChamp.name}
                          </div>
                          <div className="mastery__data mastery__data--not_played">
                            <div>Nunca jugado</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Matchlist matchlist={data.matchlist} />
                </div>
                <div className="col-4">
                  {/* Estadisticas */}
                  <PlayerStats
                    stats={stats}
                    masteryLevels={data.masteryLevels}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
  connection: state.lcuConnector.connection,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetailModal);
