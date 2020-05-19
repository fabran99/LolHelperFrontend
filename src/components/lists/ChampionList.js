import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";

import classnames from "classnames";
import { icon_dict } from "../../helpers/iconDict";
import img_placeholder from "../../img/placeholder.svg";

export class ChampionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      order: "desc",
      order_var: "high_elo_winrate",
      current_champ: null,
      champ_locked: false,
      search: "",
      lane: "",
    };
  }

  changeCurrentChamp = (current_champ) => {
    if (!this.state.champ_locked) {
      this.setState({ current_champ });
    }
  };

  lockChamp = (champ) => {
    const { current_champ, champ_locked } = this.state;
    if (current_champ == champ && champ_locked) {
      this.setState({
        champ_locked: false,
      });
    } else if (!champ_locked || current_champ != champ) {
      this.setState({
        champ_locked: true,
        current_champ: champ,
      });
    }
  };

  componentDidMount() {
    const { list, order, order_var } = this.props;
    this.setState(
      {
        list: list || this.state.list,
        order: order || this.state.order,
        order_var: order_var || this.state.order_var,
      },
      () => {
        this.setState({
          list: this.filterList(),
        });
      }
    );
  }

  filterList() {
    const { order, order_var, search, lane } = this.state;
    var new_list = [...this.props.list];
    new_list = new_list.filter((item) => {
      let name = item.name.toLowerCase();
      let champ_lane = item.lane.toLowerCase();
      return (
        name.indexOf(search.toLowerCase()) != -1 &&
        champ_lane.indexOf(lane.toLowerCase()) != -1
      );
    });
    new_list = new_list.sort((a, b) => {
      if (a[order_var] > b[order_var]) {
        return order == "asc" ? 1 : -1;
      }
      if (a[order_var] < b[order_var]) {
        return order == "asc" ? -1 : 1;
      }
      return 0;
    });

    return new_list;
  }

  handleInput = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {
        this.setState({
          list: this.filterList(),
        });
      }
    );
  };

  runesFromChamp(champ_data) {
    const { content } = this.props.assets.general;

    var runes = content.runes;
    var perks = content.perks;
    var champ_runes = champ_data.runes;

    //  Runas primarias
    var primaryRune = runes.find((item) => {
      return item.id == champ_runes.primary.main;
    });

    var primaryPerks = [];
    for (let i = 0; i < 4; i++) {
      let selected = champ_runes.primary[`perk${i}`];
      let current_rune = primaryRune.slots.find((item) => item.id == selected);
      if (current_rune) {
        primaryPerks.push(current_rune);
      }
    }

    // Runas secundarias
    var secondaryRune = runes.find((item) => {
      return item.id == champ_runes.secondary.main;
    });

    var secondaryPerks = [];

    for (let i = 4; i < 6; i++) {
      let selected = champ_runes.secondary[`perk${i}`];
      let current_rune = secondaryRune.slots.find(
        (item) => item.id == selected
      );
      if (current_rune) {
        secondaryPerks.push(current_rune);
      }
    }

    // Perks
    var perkList = [];

    for (let i = 0; i < 3; i++) {
      let perk_id = champ_runes.perks[`statPerk${i}`];
      let perk_data = perks.find((x) => x.id == perk_id);
      if (perk_data) {
        perkList.push(perk_data);
      }
    }

    return {
      primaryRune,
      secondaryRune,
      primaryPerks,
      secondaryPerks,
      perkList,
    };
  }

  itemsFromChamp(champ_data) {
    const { content } = this.props.assets.general;
    var build = [];
    var boots = content.items.find(
      (item) => item.id == champ_data.build.boots[0]
    );
    if (boots) {
      build.push(boots);
    }

    champ_data.build.items.forEach((item_id) => {
      var match = content.items.find((it) => it.id == item_id);
      if (match) {
        build.push(match);
      }
    });

    return build;
  }

  render() {
    const { current_champ, search, list, order_var, order, lane } = this.state;

    // Busco el champ seleccionado
    var champ_data = list.find((champ) => champ.championId == current_champ);
    if (!champ_data && list.length) {
      champ_data = list[0];
    }
    var working_runes = champ_data ? this.runesFromChamp(champ_data) : null;
    var build = champ_data ? this.itemsFromChamp(champ_data) : null;

    return (
      <div className="championlist">
        {/* Detalle */}
        {champ_data ? (
          <div className="championdetail">
            <Link
              to={`/champion/${champ_data.championId}`}
              className="championdetail__img"
            >
              <img src={champ_data.images.loading} alt={champ_data} />
            </Link>
            <div className="championdetail__name">Runas</div>
            <div className="runes">
              {working_runes && (
                <div className="runes__primary">
                  <Tooltip
                    title={working_runes.primaryRune.name}
                    placement="top"
                  >
                    <div className="runes__primary__first--inline">
                      <img src={working_runes.primaryRune.image} alt="" />
                    </div>
                  </Tooltip>
                  {working_runes.primaryPerks.map((perk, i) => {
                    if (i == 0) {
                      return (
                        <Tooltip key={i} title={perk.name} placement="top">
                          <div className="runes__primary__perk--inline">
                            <img src={perk.image} alt="" />
                          </div>
                        </Tooltip>
                      );
                    }
                    return (
                      <Tooltip key={i} title={perk.name} placement="top">
                        <div className="runes__primary__perk ">
                          <img src={perk.image} />
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
              {working_runes && (
                <div className="runes__secondary">
                  <Tooltip
                    title={working_runes.secondaryRune.name}
                    placement="top"
                  >
                    <div className="runes__secondary__first ">
                      <img src={working_runes.secondaryRune.image} />
                    </div>
                  </Tooltip>
                  {working_runes.secondaryPerks.map((perk, i) => {
                    return (
                      <Tooltip key={i} title={perk.name} placement="top">
                        <div className="runes__secondary__perk">
                          <img src={perk.image} alt="" />
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
              {working_runes && (
                <div className="runes__perks">
                  {working_runes.perkList.map((perk, i) => {
                    return (
                      <Tooltip key={i} title={perk.description} placement="top">
                        <div className="runes__secondary__perk">
                          <img src={perk.image} alt="" />
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Build */}
            <div className="championdetail__name">Build</div>
            <div className="build build--notop">
              {build &&
                build.map((item, i) => {
                  return (
                    <Tooltip key={i} title={item.name}>
                      <div className="build__item">
                        <img src={item.image} alt="" />
                      </div>
                    </Tooltip>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="championdetail">
            <div className="championdetail__img championdetail__img--placeholder">
              <img src={img_placeholder} />
            </div>
          </div>
        )}

        <div className="championlist__container">
          {/* Filtros */}
          <div className="championlist__filters">
            <div className="championlist__filters__input">
              <div className="championlist__filters__icon">
                <i className="fas fa-search"></i>
              </div>
              <input
                type="text"
                placeholder="Buscar campeón"
                value={search}
                onChange={this.handleInput}
                name="search"
              />
            </div>
            <div className="championlist__filters__select">
              <select
                value={order_var}
                onChange={this.handleInput}
                name="order_var"
              >
                <option value="name">Nombre</option>
                <option value="high_elo_pickrate">Pickrate</option>
                <option value="high_elo_winrate">Winrate</option>
                <option value="high_elo_banrate">Banrate</option>
              </select>
            </div>
            <div className="championlist__filters__select">
              <select value={order} onChange={this.handleInput} name="order">
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
            <div className="championlist__filters__select">
              <select value={lane} onChange={this.handleInput} name="lane">
                <option value="">Cualquier línea</option>
                <option value="Top">Top</option>
                <option value="ADC">Adc</option>
                <option value="Support">Support</option>
                <option value="Mid">Mid</option>
                <option value="Jungla">Jungla</option>
              </select>
            </div>
          </div>
          {/* Lista */}

          <div className="list_wrapper">
            {!this.props.list || !list.length ? (
              <h2 className="empty">No se encontraron resultados</h2>
            ) : (
              list.map((champ, i) => {
                return (
                  <div
                    key={i}
                    className={classnames("championlist__element", {
                      "championlist__element--active":
                        champ.championId == current_champ,
                    })}
                    onMouseOver={this.changeCurrentChamp.bind(
                      this,
                      champ.championId
                    )}
                    onClick={this.lockChamp.bind(this, champ.championId)}
                  >
                    <div className="championlist__number">{i + 1}</div>
                    <div className="championlist__icon">
                      <img
                        className="championlist__img__preloader"
                        src={img_placeholder}
                      ></img>
                      <img src={champ.images.square} alt={champ.name} />
                    </div>
                    <div className="championlist__info">
                      <Link
                        to={`/champion/${champ.championId}`}
                        className="championlist__name"
                      >
                        {champ.name}
                      </Link>
                      <div className="championlist__lane">
                        <img src={icon_dict[champ.lane.toLowerCase()]} />
                        <span>{champ.lane}</span>
                      </div>
                    </div>
                    <div className="championlist__stats">
                      <div className="championlist__stat">
                        <div className="championlist__stat__bar">
                          <div
                            className="championlist__stat__fill"
                            style={{ width: `${champ.high_elo_winrate}%` }}
                          ></div>
                        </div>
                        <div className="championlist__stat__name">Winrate</div>
                        <div className="championlist__stat__value">
                          {champ.high_elo_winrate} %
                        </div>
                      </div>
                      <div className="championlist__stat">
                        <div className="championlist__stat__bar">
                          <div
                            className="championlist__stat__fill championlist__stat__fill--pink"
                            style={{ width: `${champ.high_elo_banrate}%` }}
                          ></div>
                        </div>
                        <div className="championlist__stat__name">Banrate</div>
                        <div className="championlist__stat__value">
                          {champ.high_elo_banrate} %
                        </div>
                      </div>
                      <div className="championlist__stat">
                        <div className="championlist__stat__bar">
                          <div
                            className="championlist__stat__fill championlist__stat__fill--green"
                            style={{ width: `${champ.high_elo_pickrate}%` }}
                          ></div>
                        </div>
                        <div className="championlist__stat__name">Pickrate</div>
                        <div className="championlist__stat__value">
                          {champ.high_elo_pickrate} %
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(ChampionList);
