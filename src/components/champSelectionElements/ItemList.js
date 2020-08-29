import React, { Component } from "react";
import { connect } from "react-redux";
import { getItem } from "../../helpers/getImgLinks";
import CustomTooltip from "../utility/CustomTooltip";

export class ItemList extends Component {
  render() {
    const { assets, champ, configuration } = this.props;
    const { laneSelectedForRecommendations: lane } = configuration;

    // Filtro por la linea actual
    var current_lane = lane;

    if (!current_lane || champ.lanes.indexOf(current_lane) == -1) {
      current_lane = champ.lanes[0];
    }
    var current_champ_laneinfo = champ.info_by_lane.find(
      (el) => el.lane == current_lane
    );
    return (
      <div className="build">
        <div className="build__section">
          <div className="build__title">principales</div>
          <div className="build__list">
            {current_champ_laneinfo.build.items.map((item, i) => {
              var itemInfo = assets.items.find((x) => x.id == item);
              return (
                <CustomTooltip
                  key={item}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title tooltip__title--image">
                        <img
                          src={getItem(assets.img_links, itemInfo.id)}
                          alt=""
                        />{" "}
                        <span>{itemInfo.name}</span>
                      </div>

                      <div className="tooltip__content">
                        {itemInfo.description}
                      </div>
                      <div className="tooltip__subcontent">
                        Precio: {itemInfo.price}
                      </div>
                    </div>
                  }
                >
                  <div className="build__item">
                    <div className="build__item__container">
                      <img
                        src={getItem(assets.img_links, itemInfo.id)}
                        alt=""
                      />
                    </div>
                  </div>
                </CustomTooltip>
              );
            })}
          </div>
        </div>

        <div className="build__section d-none">
          <div className="build__title">Secundarios</div>
          <div className="build__list">
            {current_champ_laneinfo.build.secondary.map((item, i) => {
              var itemInfo = assets.items.find((x) => x.id == item);
              return (
                <CustomTooltip
                  key={item}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title tooltip__title--image">
                        <img
                          src={getItem(assets.img_links, itemInfo.id)}
                          alt=""
                        />{" "}
                        <span>{itemInfo.name}</span>
                      </div>

                      <div className="tooltip__content">
                        {itemInfo.description}
                      </div>
                      <div className="tooltip__subcontent">
                        Precio: {itemInfo.price}
                      </div>
                    </div>
                  }
                >
                  <div className="build__item">
                    <div className="build__item__container">
                      <img
                        src={getItem(assets.img_links, itemInfo.id)}
                        alt=""
                      />
                    </div>
                  </div>
                </CustomTooltip>
              );
            })}
          </div>
        </div>

        <div className="build__section">
          <div className="build__title">Botas / Visión</div>
          <div
            className="build__list"
            style={{
              width: `${
                20 *
                (current_champ_laneinfo.build.boots.length +
                  current_champ_laneinfo.build.trinket.length)
              }%`,
            }}
          >
            {current_champ_laneinfo.build.boots.map((item, i) => {
              var itemInfo = assets.items.find((x) => x.id == item);
              return (
                <CustomTooltip
                  key={item}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title tooltip__title--image">
                        <img
                          src={getItem(assets.img_links, itemInfo.id)}
                          alt=""
                        />{" "}
                        <span>{itemInfo.name}</span>
                      </div>

                      <div className="tooltip__content">
                        {itemInfo.description}
                      </div>
                      <div className="tooltip__subcontent">
                        Precio: {itemInfo.price}
                      </div>
                    </div>
                  }
                >
                  <div className="build__item">
                    <div className="build__item__container">
                      <img
                        src={getItem(assets.img_links, itemInfo.id)}
                        alt=""
                      />
                    </div>{" "}
                  </div>
                </CustomTooltip>
              );
            })}
            {current_champ_laneinfo.build.trinket.map((item, i) => {
              var itemInfo = assets.items.find((x) => x.id == item);
              return (
                <CustomTooltip
                  key={item}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title tooltip__title--image">
                        <img
                          src={getItem(assets.img_links, itemInfo.id)}
                          alt=""
                        />{" "}
                        <span>{itemInfo.name}</span>
                      </div>

                      <div className="tooltip__content">
                        {itemInfo.description}
                      </div>
                      <div className="tooltip__subcontent">
                        Precio: {itemInfo.price}
                      </div>
                    </div>
                  }
                >
                  <div className="build__item">
                    <div className="build__item__container">
                      <img
                        src={getItem(assets.img_links, itemInfo.id)}
                        alt=""
                      />
                    </div>{" "}
                  </div>
                </CustomTooltip>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  configuration: state.configuration,
});

export default connect(mapStateToProps, null)(ItemList);
