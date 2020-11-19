import React, { Component } from "react";
import { connect } from "react-redux";
import { selectChampions } from "../../redux/assets/assets.selectors";

import ListFilter from "./subcomponents/ListFilter";
import ListElement from "./subcomponents/ListElement";

// Utilidades
import { getWinrate } from "../../helpers/utilities";

import "./championList.styles.scss";

export class ChampionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBox: "",
      selectedLane: "any",
      column: "winRate",
      ascending: "desc",
    };

    this.listRef = React.createRef();
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleLaneSelector = (selectedLane) => {
    this.setState(
      {
        selectedLane,
      },
      () => {
        // this.scrollTop();
      }
    );
  };

  getFilteredChampions = () => {
    var { searchBox, selectedLane: lane, column, ascending } = this.state;
    var newlist = [...this.props.champions];
    var selectedLane = lane;
    if (selectedLane == "any") {
      selectedLane = "";
    }

    // Filtro por nombre
    newlist = newlist.filter((item) => {
      let name = item.name.toLowerCase();
      let lanes = item.lanes.map((el) => el.toLowerCase());
      return (
        name.includes(searchBox.toLowerCase()) &&
        (!selectedLane || lanes.indexOf(selectedLane.toLowerCase()) != -1)
      );
    });

    // Ordeno
    newlist = newlist.sort((a, b) => {
      if (column != "winRate") {
        if (a[column] > b[column]) {
          return ascending == "asc" ? 1 : -1;
        }
        if (a[column] < b[column]) {
          return ascending == "asc" ? -1 : 1;
        }
      } else {
        var winrateA = getWinrate(a, selectedLane);
        var winrateB = getWinrate(b, selectedLane);
        if (winrateA > winrateB) {
          return ascending == "asc" ? 1 : -1;
        }
        if (winrateA < winrateB) {
          return ascending == "asc" ? -1 : 1;
        }
      }

      return 0;
    });

    return newlist;
  };

  render() {
    const filteredList = this.getFilteredChampions();
    console.log(this.props);

    return (
      <div className="championlist">
        <div className="subtitle">Estadísticas de personajes</div>
        <div className="championlist__content">
          {/* Filtros */}
          {/* <ListFilter
              filters={this.state}
              handleLane={this.handleLaneSelector}
              handleInput={this.handleInput}
            /> */}

          {/* Lista */}
          <div className="championlist__list">
            {filteredList.length > 0 ? (
              filteredList.map((champion, i) => {
                return (
                  <ListElement
                    champion={champion}
                    index={i + 1}
                    key={champion.key}
                  />
                );
              })
            ) : (
              <div className="empty_list">No se encontraron resultados</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  champions: selectChampions(state),
});

export default connect(mapStateToProps, null)(ChampionList);
