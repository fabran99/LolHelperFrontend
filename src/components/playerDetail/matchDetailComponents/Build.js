import React from "react";
import { connect } from "react-redux";
import { getItem } from "../../../helpers/getImgLinks";
import CustomTooltip from "../../utility/CustomTooltip";

import {
  selectItemsAsDict,
  selectImgLinks,
} from "../../../redux/assets/assets.selectors";

const Build = (props) => {
  const { itemsDict, imgLinks, build } = props;

  return (
    <div className="team__build">
      {build.map((item, index) => {
        let itemInfo = itemsDict[item];
        if (!itemInfo) {
          return (
            <div
              key={index}
              className="team__build__item team__build__item--empty"
            ></div>
          );
        }
        return (
          <CustomTooltip
            key={index}
            placement="top"
            title={
              <div className="tooltip">
                <div className="tooltip__title tooltip__title--image">
                  <img src={getItem(imgLinks, itemInfo.id)} alt="" />{" "}
                  <span>{itemInfo.name}</span>
                </div>

                <div className="tooltip__content">{itemInfo.description}</div>
                <div className="tooltip__subcontent">
                  Precio: {itemInfo.price}
                </div>
              </div>
            }
          >
            <div className="team__build__item">
              <img src={getItem(imgLinks, itemInfo.id)} alt="" />
            </div>
          </CustomTooltip>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  itemsDict: selectItemsAsDict(state),
  imgLinks: selectImgLinks(state),
});

export default connect(mapStateToProps, null)(Build);
