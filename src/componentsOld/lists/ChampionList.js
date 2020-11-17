import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import img_placeholder from "../../img/placeholder.svg";
import ListFilter from "./ListFilter";
import ListRow from "./ListRow";
import ChampionDetail from "./ChampionDetail";
import { getWinrate } from "../../helpers/general";

export class ChampionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "desc",
      order_var: "winRate",
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
    this.setState(
      {
        order: order || this.state.order,
        order_var: order_var || this.state.order_var,
      },
      () => {
        var list = this.filterList();
        if (list.length > 0) {
          this.setState({
            current_champ: list[0].championId,
          });
        }
      }
    );
  }

  filterList() {
    const { order, order_var, search, lane } = this.state;
    var new_list = [...this.props.list];
    new_list = new_list.filter((item) => {
      let name = item.name.toLowerCase();
      let champ_lane = item.lanes.map((el) => el.toLowerCase());
      return (
        name.indexOf(search.toLowerCase()) != -1 &&
        (champ_lane.indexOf(lane.toLowerCase()) != -1 || !lane)
      );
    });

    new_list = new_list.sort((a, b) => {
      if (order_var != "winRate") {
        if (a[order_var] > b[order_var]) {
          return order == "asc" ? 1 : -1;
        }
        if (a[order_var] < b[order_var]) {
          return order == "asc" ? -1 : 1;
        }
      } else {
        // Cambio el orden si es por winRate
        var winrateA = getWinrate(a, lane);
        var winrateB = getWinrate(b, lane);
        if (winrateA > winrateB) {
          return order == "asc" ? 1 : -1;
        }
        if (winrateA < winrateB) {
          return order == "asc" ? -1 : 1;
        }
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

    // Manejo cambio desde ranking
    var currentSearch = this.props.history.location.hash;
    if (currentSearch) {
      let championId = currentSearch.split("#")[1];
      if (championId) {
        this.props.history.push("/");

        this.setState(
          {
            lane: "",
            search: "",
          },
          () => {
            this.lockChamp(championId);
          }
        );
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

  changeLane = (lane) => {
    this.setState({ lane }, () => {
      this.scrollTop();
    });
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

    return (
      <div className="championlist">
        {/* Detalle */}
        {champ_data ? (
          <ChampionDetail champ_data={champ_data} />
        ) : (
          <div className="championdetail">
            <div className="detailcard">
              <div className="detailcard__background">
                <img src={img_placeholder} style={{ width: "485px" }} />
              </div>
            </div>
          </div>
        )}
        <div className="championlist__container">
          {/* Filtros */}
          <ListFilter
            search={search}
            order_var={order_var}
            handleInput={this.handleInput}
            lane={lane}
            order={order}
            changeLane={this.changeLane}
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
                    lane={lane}
                    changeLane={this.changeLane}
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

export default connect(mapStateToProps, null)(withRouter(ChampionList));
