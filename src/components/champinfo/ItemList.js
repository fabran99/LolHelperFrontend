import React, { Component } from "react";
import { connect } from "react-redux";
import { getItem } from "../../helpers/getImgLinks";
import Tooltip from "@material-ui/core/Tooltip";

export class ItemList extends Component {
  render() {
    const { assets, champ } = this.props;

    return (
      <div className="build">
        <div className="buildrow">
          <div className="build__section">
            <div className="build__title">Objectos principales</div>
            <div className="build__list">
              {champ.build.items.map((item, i) => {
                var itemInfo = assets.items.find((x) => x.id == item);
                return (
                  <Tooltip
                    arrow
                    key={item}
                    placement="top"
                    title={
                      <div className="buildtooltip">
                        <div className="buildtooltip__name">
                          {itemInfo.name}
                        </div>

                        <div className="buildtooltip__desc">
                          {itemInfo.description}
                        </div>
                        <div className="buildtooltip__price">
                          Precio: {itemInfo.price}
                        </div>
                      </div>
                    }
                  >
                    <div className="build__item">
                      <img
                        src={getItem(assets.img_links, itemInfo.id)}
                        alt=""
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="build__section">
            <div className="build__title">Botas</div>
            <div className="build__list">
              {champ.build.boots.map((item, i) => {
                var itemInfo = assets.items.find((x) => x.id == item);
                return (
                  <Tooltip
                    arrow
                    key={item}
                    placement="top"
                    title={
                      <div className="buildtooltip">
                        <div className="buildtooltip__name">
                          {itemInfo.name}
                        </div>

                        <div className="buildtooltip__desc">
                          {itemInfo.description}
                        </div>
                        <div className="buildtooltip__price">
                          Precio: {itemInfo.price}
                        </div>
                      </div>
                    }
                  >
                    <div className="build__item">
                      <img
                        src={getItem(assets.img_links, itemInfo.id)}
                        alt=""
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        <div className="buildrow">
          <div className="build__section">
            <div className="build__title">Objectos Secundarios</div>
            <div className="build__list">
              {champ.build.secondary.map((item, i) => {
                var itemInfo = assets.items.find((x) => x.id == item);
                return (
                  <Tooltip
                    arrow
                    key={item}
                    placement="top"
                    title={
                      <div className="buildtooltip">
                        <div className="buildtooltip__name">
                          {itemInfo.name}
                        </div>

                        <div className="buildtooltip__desc">
                          {itemInfo.description}
                        </div>
                        <div className="buildtooltip__price">
                          Precio: {itemInfo.price}
                        </div>
                      </div>
                    }
                  >
                    <div className="build__item">
                      <img
                        src={getItem(assets.img_links, itemInfo.id)}
                        alt=""
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="build__section">
            <div className="build__title">Visión</div>
            <div className="build__list">
              {champ.build.trinket.map((item, i) => {
                var itemInfo = assets.items.find((x) => x.id == item);
                return (
                  <Tooltip
                    arrow
                    key={item}
                    placement="top"
                    title={
                      <div className="buildtooltip">
                        <div className="buildtooltip__name">
                          {itemInfo.name}
                        </div>

                        <div className="buildtooltip__desc">
                          {itemInfo.description}
                        </div>
                        <div className="buildtooltip__price">
                          Precio: {itemInfo.price}
                        </div>
                      </div>
                    }
                  >
                    <div className="build__item">
                      <img
                        src={getItem(assets.img_links, itemInfo.id)}
                        alt=""
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
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
