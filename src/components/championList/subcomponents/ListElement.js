import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";

// Selectors
import { selectImgLinks } from "../../../redux/assets/assets.selectors";

// Utilidades
import { icon_dict } from "../../../helpers/iconDict";
import { getSquare } from "../../../helpers/getImgLinks";

const ListElement = ({ index, champion, imgLinks }) => {
  return (
    <div className="element">
      <div className="row">
        <div className="col-2">
          <div className="icon">
            <div className="icon__container">
              <img
                src={getSquare(imgLinks, champion.key)}
                className="champ_icon"
              />
            </div>
            {champion.lanes.map((lane, i) => {
              return (
                <div
                  key={lane}
                  className={classnames(
                    `icon__lanecontainer ${lane.toLowerCase()}`,
                    {
                      "icon__lanecontainer--secondary": i == 1,
                    }
                  )}
                >
                  <img
                    src={icon_dict[lane.toLowerCase()]}
                    className="lane_icon"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-4">
          <div className="element__data">
            <div className="element__name">{champion.name}</div>

            <div className="element_lanes">
              {champion.lanes.map((lane, i) => {
                return (
                  <div key={lane} className="lane">
                    <div className="lane__icon">
                      <img src={icon_dict[lane.toLowerCase()]} />
                    </div>
                    {/* <div className="lane__name">{lane}</div> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  imgLinks: selectImgLinks(state),
});

export default connect(mapStateToProps)(ListElement);
