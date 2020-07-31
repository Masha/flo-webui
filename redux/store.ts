import { configureStore, createSelector } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { WsStatus } from "../types/ws";
import { selectWsPlayerSession } from "./modules/ws";

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof store.getState>;

export const selectSetupDone = (state: AppState) =>
  !!state.auth.playerInfo &&
  state.ws.status === WsStatus.Connected &&
  state.ws.playerSession;
export const selectPlayerInfo = (state: AppState) => state.auth.playerInfo;
export const selectPlayerInfoLoading = (state: AppState) =>
  state.auth.playerInfoLoading;
export const selectPlayerInfoError = (state: AppState) =>
  state.auth.playerInfoError;
export const selectCurrentGameId = createSelector(selectWsPlayerSession, (s) =>
  s ? s.game_id : null
);

export default store;
