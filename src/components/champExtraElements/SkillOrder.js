import React from "react";

const NUMBER_TO_KEY = {
  1: "Q",
  2: "W",
  3: "E",
  4: "R",
};

const SkillOrder = ({ champ }) => {
  if (!champ) {
    return null;
  }

  var skill_order = champ.skill_order;
  var order = [];
  var skill_counter = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  for (let i = 1; i <= 18; i++) {
    let current_skill = skill_order[i];
    if (current_skill) {
      skill_counter[current_skill] += 1;
      if (
        skill_counter[current_skill] >= 3 &&
        order.indexOf(current_skill) == -1
      ) {
        order.push(current_skill);
      }
    }
  }

  if (order.length < 4) {
    for (let i = 1; i <= 4; i++) {
      if (order.indexOf(i) == -1) {
        order.push(i);
        if (order.length == 4) {
          break;
        }
      }
    }
  }

  return (
    <div className="skill_order">
      <div className="early">
        <div className="level">
          <div className={`button button--${NUMBER_TO_KEY[skill_order[1]]}`}>
            {NUMBER_TO_KEY[skill_order[1]]}
          </div>
          <div className="text">Nivel 1</div>
        </div>
        <div className="level">
          <div className={`button button--${NUMBER_TO_KEY[skill_order[2]]}`}>
            {NUMBER_TO_KEY[skill_order[2]]}
          </div>
          <div className="text">Nivel 2</div>
        </div>
        <div className="level">
          <div className={`button button--${NUMBER_TO_KEY[skill_order[3]]}`}>
            {NUMBER_TO_KEY[skill_order[3]]}
          </div>
          <div className="text">Nivel 3</div>
        </div>
      </div>
      <div className="max">
        <div className="buttons">
          {order.map((button) => {
            let buttonKey = NUMBER_TO_KEY[button];
            return (
              <div className={`button button--${buttonKey}`} key={buttonKey}>
                {buttonKey}
              </div>
            );
          })}
        </div>
        <div className="text">Maxeo de habilidades</div>
      </div>
    </div>
  );
};

export default SkillOrder;
