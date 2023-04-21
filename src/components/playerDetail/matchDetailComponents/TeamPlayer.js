import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import CustomTooltip from "../../utility/CustomTooltip";
import { getSquare } from "../../../helpers/getImgLinks";
import { numberToDots } from "../../../helpers/general";
import { selectImgLinks } from "../../../redux/assets/assets.selectors";
import Build from "./Build";
import Runes from "./Runes";
import SummonerSpell from "./SummonerSpell";
import SummonersRiftMiniMap from "../../../img/summonersRiftMiniMap.png";

const timelinePositionToLeftBottom = ({ x, y }) => {
  let minX = 0;
  let maxX = 15000;
  let minY = 0;
  let maxY = 15000;

  let left = ((x - minX) * 100) / (maxX - minX);
  let bottom = ((y - minY) * 100) / (maxY - minY);

  return {
    left: Math.round(left) - 5,
    bottom: Math.round(bottom) - 5,
  };
};

const lineFromTo = (from, to) => {
  let fromX = from.left;
  let fromY = from.bottom;
  let toX = to.left;
  let toY = to.bottom;

  // Calculate the angle of the line
  var angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;
  angle = angle < 0 ? angle + 360 : angle;

  // Calculate the length of the line.
  var length = Math.sqrt(
    (toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY)
  );

  // Add an offset to the fromX and fromY coordinates depending on the angle, since the
  // line rotates from the center. Take into acount the angle being negative
  let yOffset = Math.sin(angle * (Math.PI / 180)) * (length / 2);
  let xOffset = Math.cos(angle * (Math.PI / 180)) * (length / 2);

  fromX = fromX + xOffset;
  fromY = fromY + yOffset;
  let style = {
    transform: ` translateX(-50%) rotate(${-Math.round(angle)}deg)`,
    width: `${Math.round(length)}%`,
    left: `${fromX + 3}%`,
    bottom: `${fromY + 6}%`,
  };
  return <div className="line" style={style}></div>;
};

const TeamPlayer = ({
  isCurrentPlayer,
  participant,
  items,
  runes,
  currentChamp,
  imgLinks,
}) => {
  return (
    <div
      className={classnames("team__player", {
        "team__player--current": isCurrentPlayer,
      })}
      key={participant.participantId}
    >
      <div className="row">
        {/* Nombre */}
        <div className="col-4">
          <div className="team__player__runes">
            <Runes runeData={runes} />
          </div>
          <div className="team__player__sums">
            <SummonerSpell spellId={participant.spell1Id} />
            <SummonerSpell spellId={participant.spell2Id} />
          </div>
          <div className="team__player__champ">
            <img src={getSquare(imgLinks, currentChamp.key)} alt="" />
          </div>{" "}
          <CustomTooltip
            placement="top"
            title={
              <div className="tooltip">
                <div className="player_timeline">
                  <div className="player_timeline__name">
                    {participant.identity.player.summonerName}
                  </div>
                  <div className="player_timeline__map">
                    <img src={SummonersRiftMiniMap} />

                    {participant.timeline.map((frame, index) => {
                      if (index > 4) {
                        return;
                      }
                      let totalSeconds = Math.round(frame.timestamp / 1000);
                      let minutes = Math.floor(totalSeconds / 60);
                      let seconds = totalSeconds - minutes * 60;
                      let time = `${minutes < 10 ? "0" + minutes : minutes}:${
                        seconds < 10 ? "0" + seconds : seconds
                      }`;

                      let nextElement =
                        index === 4 ? null : participant.timeline[index + 1];

                      let { left, bottom } = timelinePositionToLeftBottom(
                        frame.position
                      );
                      left = left + "%";
                      bottom = bottom + "%";

                      return (
                        <React.Fragment key={index}>
                          {nextElement &&
                            lineFromTo(
                              timelinePositionToLeftBottom(frame.position),
                              timelinePositionToLeftBottom(nextElement.position)
                            )}
                          <div
                            className={`player_timeline__map__element`}
                            style={{ left, bottom }}
                          >
                            <div className="icon">
                              <img
                                src={getSquare(imgLinks, currentChamp.key)}
                                alt=""
                              />
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
          >
            <div className="team__player__name">
              {participant.identity.player.summonerName}
            </div>
          </CustomTooltip>
        </div>
        {/* Items */}
        <div className="col-4">
          <div className="team__player__build">
            <Build build={items} />
          </div>
        </div>
        {/* Estadisticas */}
        <div className="col-4">
          <div className="team__player__data">
            <div className="team__player__kda">
              {participant.stats.kills} / {participant.stats.deaths} /{" "}
              {participant.stats.assists}
            </div>
            <div className="team__player__farm">
              {participant.stats.totalMinionsKilled}
            </div>
            <div className="team__player__gold">
              {numberToDots(participant.stats.goldEarned)}
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

export default connect(mapStateToProps, null)(TeamPlayer);
