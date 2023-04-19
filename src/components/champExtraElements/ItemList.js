import React from "react";
import { connect } from "react-redux";
import { getItem } from "../../helpers/getImgLinks";
import CustomTooltip from "../utility/CustomTooltip";
import { selectLaneSelectedForRecommendations } from "../../redux/settings/settings.selectors";
import {
  selectImgLinks,
  selectItemsAsDict,
} from "../../redux/assets/assets.selectors";

const ItemList = ({
  champ,
  buildType,
  laneForRecommendations,
  itemsDict,
  imgLinks,
  lane,
}) => {
  var current_champ_laneinfo = null;

  if (buildType == "champSelection") {
    // Filtro por la linea actual
    var current_lane = laneForRecommendations;

    if (!current_lane || champ.lanes.indexOf(current_lane) == -1) {
      current_lane = champ.lanes[0];
    }
    current_champ_laneinfo = champ.info_by_lane.find(
      (el) => el.lane == current_lane
    );
  } else if (buildType == "home") {
    // Filtro por la linea actual
    var current_lane = lane;

    if (!current_lane || champ.lanes.indexOf(current_lane) == -1) {
      current_lane = champ.lanes[0];
    }
    current_champ_laneinfo = champ.info_by_lane.find(
      (el) => el.lane == current_lane
    );
  }

  if (!current_champ_laneinfo) {
    return null;
  }

  return (
    <div className="build">
      <div className="build__section">
        <div className="build__title">principales</div>
        <div className="build__list">
          {current_champ_laneinfo.build.items.map((item, i) => {
            var itemInfo = itemsDict[item];
            var category = "";

            if (itemInfo.tags && itemInfo.tags.length > 0) {
              category = itemInfo.tags[0];
            }

            return (
              <CustomTooltip
                key={item}
                placement="top"
                title={
                  <div className="tooltip">
                    <div className="tooltip__title tooltip__title--image">
                      <img src={getItem(imgLinks, itemInfo.id)} alt="" />{" "}
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
                  <div className={`build__item__container ${category}`}>
                    <img src={getItem(imgLinks, itemInfo.id)} alt="" />
                  </div>
                  <div className="build__item__background">
                    <img src={getItem(imgLinks, itemInfo.id)} alt="" />
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
            var itemInfo = itemsDict[item];
            return (
              <CustomTooltip
                key={item}
                placement="top"
                title={
                  <div className="tooltip">
                    <div className="tooltip__title tooltip__title--image">
                      <img src={getItem(imgLinks, itemInfo.id)} alt="" />{" "}
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
                    <img src={getItem(imgLinks, itemInfo.id)} alt="" />
                  </div>
                  <div className="build__item__background">
                    <img src={getItem(imgLinks, itemInfo.id)} alt="" />
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
            var itemInfo = itemsDict[item];
            return (
              <CustomTooltip
                key={item}
                placement="top"
                title={
                  <div className="tooltip">
                    <div className="tooltip__title tooltip__title--image">
                      <img src={getItem(imgLinks, itemInfo.id)} alt="" />{" "}
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
                    <img src={getItem(imgLinks, itemInfo.id)} alt="" />
                  </div>
                  <div className="build__item__background">
                    <img src={getItem(imgLinks, itemInfo.id)} alt="" />
                  </div>
                </div>
              </CustomTooltip>
            );
          })}
          {current_champ_laneinfo.build.trinket.map((item, i) => {
            var itemInfo = itemsDict[item];
            return (
              <CustomTooltip
                key={item}
                placement="top"
                title={
                  <div className="tooltip">
                    <div className="tooltip__title tooltip__title--image">
                      <img src={getItem(imgLinks, itemInfo.id)} alt="" />{" "}
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
                    <img src={getItem(imgLinks, itemInfo.id)} alt="" />
                  </div>
                  <div className="build__item__background">
                    <img src={getItem(imgLinks, itemInfo.id)} alt="" />
                  </div>
                </div>
              </CustomTooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  laneForRecommendations: selectLaneSelectedForRecommendations(state),
  itemsDict: selectItemsAsDict(state),
  imgLinks: selectImgLinks(state),
});

export default connect(mapStateToProps, null)(ItemList);
