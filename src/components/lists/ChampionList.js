import React, { Component } from "react";
import { connect } from "react-redux";
import { RiArrowDropUpLine } from "react-icons/ri";

import img_placeholder from "../../img/placeholder.svg";
import ListFilter from "./ListFilter";
import ListRow from "./ListRow";
import ChampionDetail from "./ChampionDetail";
import {
  itemsFromChamp,
  runesFromChamp,
  spellsFromChamp,
} from "../../functions/assetParser";

export class ChampionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "desc",
      order_var: "high_elo_winrate",
      current_champ: null,
      champ_locked: false,
      search: "",
      lane: "",
    };
    this.listRef = React.createRef();
  }

  scrollTop = () => {
    if (this.listRef && this.listRef.current) {
      this.listRef.current.scrollTo({ top: 0 });
    }
  };

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
    const { order, order_var } = this.props;
    this.setState({
      order: order || this.state.order,
      order_var: order_var || this.state.order_var,
    });
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.lane != this.state.lane ||
      prevState.search != this.state.search
    ) {
      var new_list = this.filterList();
      const { current_champ } = this.state;

      if (!current_champ && new_list.length > 0) {
        this.setState({
          current_champ: new_list[0].championId,
        });
      } else if (current_champ && new_list.length > 0) {
        var is_in_list = new_list.find(
          (item) => item.championId == current_champ
        );
        if (!is_in_list) {
          this.setState({
            current_champ: new_list[0].championId,
          });
        }
      }
    }
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

  render() {
    const { current_champ, search, order_var, order, lane } = this.state;
    const { assets } = this.props;
    // Busco el champ seleccionado
    var list = this.filterList();

    var champ_data = list.find((champ) => champ.championId == current_champ);
    if (!champ_data && list.length) {
      champ_data = list[0];
    }
    var working_runes = champ_data ? runesFromChamp(champ_data, assets) : null;
    var build = champ_data ? itemsFromChamp(champ_data, assets) : null;
    var spells = champ_data ? spellsFromChamp(champ_data, assets) : null;

    return (
      <div className="championlist">
        {/* Detalle */}
        {champ_data ? (
          <ChampionDetail
            working_runes={working_runes}
            build={build}
            champ_data={champ_data}
            spells={spells}
          />
        ) : (
          <div className="championdetail">
            <div className="championdetail__img championdetail__img--placeholder">
              <img src={img_placeholder} />
            </div>
          </div>
        )}
        <div className="championlist__container">
          {this.props.list && list.length > 10 ? (
            <div
              className="championlist__up"
              onClick={this.scrollTop.bind(this)}
            >
              <RiArrowDropUpLine />
            </div>
          ) : null}
          {/* Filtros */}
          <ListFilter
            search={search}
            order_var={order_var}
            handleInput={this.handleInput}
            lane={lane}
            order={order}
          />
          {/* Lista */}

          <div className="list_wrapper" ref={this.listRef}>
            {!this.props.list || !list.length ? (
              <h2 className="empty">No se encontraron resultados</h2>
            ) : (
              list.map((champ, i) => {
                return (
                  <ListRow
                    key={champ.championId}
                    champ={champ}
                    i={i}
                    current_champ={current_champ}
                    lockChamp={this.lockChamp}
                  />
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
