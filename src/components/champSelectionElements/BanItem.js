import React, { Component } from "react";
import { connect } from "react-redux";
import CustomTooltip from "../utility/CustomTooltip";
import imgPlaceholder from "../../img/placeholder.svg";
import { getSquare, getSpell } from "../../helpers/getImgLinks";

export class BanItem extends Component {
  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  render() {
    const { champ, assets } = this.props;
    var championInfo = this.getChampInfo(champ);
    const Wrapper = (content) => {
      return championInfo ? (
        <CustomTooltip placement="top" title={championInfo.name}>
          {content}
        </CustomTooltip>
      ) : (
        <React.Fragment>{content}</React.Fragment>
      );
    };
    return Wrapper(
      <div className="ban fadeIn">
        <div className="img">
          <img src={imgPlaceholder} alt="" />
          {championInfo && (
            <img src={getSquare(assets.img_links, championInfo.key)} alt="" />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(BanItem);
