import React, { Component } from "react";
import jungle_icon from "../../img/jungla_icon.png";
import adc_icon from "../../img/adc_icon.png";
import all_icon from "../../img/all_icon.png";
import mid_icon from "../../img/mid_icon.png";
import support_icon from "../../img/support_icon.png";
import top_icon from "../../img/top_icon.png";
import CustomTooltip from "../utility/CustomTooltip";
import classnames from "classnames";

const ListFilter = ({
  search,
  order_var,
  handleInput,
  lane,
  order,
  changeLane,
}) => {
  return (
    <div className="championlist__filters">
      <div className="championlist__filters__input">
        <div className="championlist__filters__icon">
          <i className="fas fa-search"></i>
        </div>
        <input
          type="text"
          placeholder="Buscar campeón"
          value={search}
          onChange={handleInput}
          name="search"
        />
      </div>
      <div className="championlist__filters__select">
        <select value={order_var} onChange={handleInput} name="order_var">
          <option value="name">Nombre</option>
          <option value="pickRate">Pickrate</option>
          <option value="winRate">Winrate</option>
          <option value="banRate">Banrate</option>
        </select>
      </div>
      <div className="championlist__filters__select">
        <select value={order} onChange={handleInput} name="order">
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>

      <div className="championlist__filters__iconlist">
        <CustomTooltip title="Cualquier linea">
          <div
            className={classnames("icon_element", {
              "icon_element--selected": lane == "",
            })}
            onClick={() => changeLane("")}
          >
            <img src={all_icon} alt="" />
          </div>
        </CustomTooltip>
        <CustomTooltip title="Top">
          <div
            className={classnames("icon_element", {
              "icon_element--selected": lane == "Top",
            })}
            onClick={() => changeLane("Top")}
          >
            <img src={top_icon} alt="" />
          </div>
        </CustomTooltip>
        <CustomTooltip title="Mid">
          <div
            className={classnames("icon_element", {
              "icon_element--selected": lane == "Mid",
            })}
            onClick={() => changeLane("Mid")}
          >
            <img src={mid_icon} alt="" />
          </div>
        </CustomTooltip>
        <CustomTooltip title="Adc">
          <div
            className={classnames("icon_element", {
              "icon_element--selected": lane == "ADC",
            })}
            onClick={() => changeLane("ADC")}
          >
            <img src={adc_icon} alt="" />
          </div>
        </CustomTooltip>
        <CustomTooltip title="Support">
          <div
            className={classnames("icon_element", {
              "icon_element--selected": lane == "Support",
            })}
            onClick={() => changeLane("Support")}
          >
            <img src={support_icon} alt="" />
          </div>
        </CustomTooltip>
        <CustomTooltip title="Jungla">
          <div
            className={classnames("icon_element", {
              "icon_element--selected": lane == "Jungla",
            })}
            onClick={() => changeLane("Jungla")}
          >
            <img src={jungle_icon} alt="" />
          </div>
        </CustomTooltip>
      </div>
    </div>
  );
};

export default ListFilter;
