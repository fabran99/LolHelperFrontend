import React, { Component } from "react";
import { connect } from "react-redux";
import { getItem } from "../../helpers/getImgLinks";
import CustomTooltip from "../utility/CustomTooltip";

export class ItemList extends Component {
  render() {
    const { assets, champ } = this.props;

    return (
      <div className="build">
        <div className="build__section">
          <div className="build__title">Objectos principales</div>
          <div className="build__list">
            {champ.build.items.map((item, i) => {
              var itemInfo = assets.items.find((x) => x.id == item);
              return (
                <CustomTooltip
                  key={item}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title">{itemInfo.name}</div>

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
          <div className="build__title">Objectos Secundarios</div>
          <div className="build__list">
            {champ.build.secondary.map((item, i) => {
              var itemInfo = assets.items.find((x) => x.id == item);
              return (
                <CustomTooltip
                  key={item}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title">{itemInfo.name}</div>

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
                20 * (champ.build.boots.length + champ.build.trinket.length)
              }%`,
            }}
          >
            {champ.build.boots.map((item, i) => {
              var itemInfo = assets.items.find((x) => x.id == item);
              return (
                <CustomTooltip
                  key={item}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title">{itemInfo.name}</div>

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
            {champ.build.trinket.map((item, i) => {
              var itemInfo = assets.items.find((x) => x.id == item);
              return (
                <CustomTooltip
                  key={item}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title">{itemInfo.name}</div>

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
});

export default connect(mapStateToProps, null)(ItemList);
