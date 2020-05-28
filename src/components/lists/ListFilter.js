import React, { Component } from "react";

export class ListFilter extends Component {
  render() {
    const { search, order_var, handleInput, lane, order } = this.props;
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
            <option value="high_elo_pickrate">Pickrate</option>
            <option value="high_elo_winrate">Winrate</option>
            <option value="high_elo_banrate">Banrate</option>
          </select>
        </div>
        <div className="championlist__filters__select">
          <select value={order} onChange={handleInput} name="order">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
        <div className="championlist__filters__select">
          <select value={lane} onChange={handleInput} name="lane">
            <option value="">Cualquier línea</option>
            <option value="Top">Top</option>
            <option value="ADC">Adc</option>
            <option value="Support">Support</option>
            <option value="Mid">Mid</option>
            <option value="Jungla">Jungla</option>
          </select>
        </div>
      </div>
    );
  }
}

export default ListFilter;
