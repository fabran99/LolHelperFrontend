import { createSelector } from "reselect";

const selectLobby = (state) => state.lobby;

export const selectMembers = createSelector([selectLobby], (lobby) =>
  lobby ? lobby.members : null
);

export const selectLocalMember = createSelector([selectLobby], (lobby) =>
  lobby ? lobby.localMember : null
);

export const selectLocalSummonerId = createSelector([selectLobby], (lobby) =>
  lobby && lobby.localMember ? lobby.localMember.summonerId : null
);
