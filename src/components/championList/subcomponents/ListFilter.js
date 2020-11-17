import React from "react";
import classnames from "classnames";
import { icon_dict } from "../../../helpers/iconDict";

const ListFilter = ({ filters, handleLane, handleInput }) => {
  const { searchBox, selectedLane, column, ascending } = filters;

  return (
    <div className="championlist__filters">
      <div className="search">
        <input
          type="text"
          placeholder="Buscar campeón"
          value={searchBox}
          onChange={(e) => {
            handleInput(e);
          }}
          name="searchBox"
        />
      </div>
      <div className="column">
        <select
          name="column"
          value={column}
          onChange={(e) => {
            handleInput(e);
          }}
        >
          <option value="winRate">Winrate</option>
          <option value="pickRate">Pickrate</option>
          <option value="banRate">Banrate</option>
        </select>
      </div>
      <div className="order">
        <select
          name="ascending"
          value={ascending}
          onChange={(e) => {
            handleInput(e);
          }}
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>
      <div className="lanes">
        {Object.keys(icon_dict).map((lane) => {
          return (
            <div
              key={lane}
              className={classnames("optionbutton", {
                "optionbutton--active": lane == selectedLane,
              })}
              onClick={() => {
                handleLane(lane);
              }}
            >
              <img src={icon_dict[lane]} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListFilter;
