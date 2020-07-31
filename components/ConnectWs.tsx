import { Spinner } from "./Spinner";
import { useState } from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { useApiClient } from "../helpers/api-client";
import { Alert } from "./Alert";
import { Button, Callout, Intent } from "@blueprintjs/core";
import { useSelector, useDispatch } from "react-redux";
import {
  selectWsStatus,
  selectWsError,
  selectWsPort,
  selectWsClientInfo,
  selectWsClientInfoReload,
  reloadClientInfo,
} from "../redux/modules/ws";
import { WsStatus, War3InfoError } from "../types/ws";
import { useWs } from "../providers/ws";

export default function ConnectWs() {
  const dispatch = useDispatch();
  const status = useSelector(selectWsStatus);
  const error = useSelector(selectWsError);
  const port = useSelector(selectWsPort);
  const clientInfo = useSelector(selectWsClientInfo);
  const { reloading, error: reloadError } = useSelector(
    selectWsClientInfoReload
  );
  const ws = useWs();

  const gameLocated =
    clientInfo && clientInfo.war3_info.located ? (
      <p>
        Warcraft III located, version{" "}
        <span className="flo-text-info font-semibold">
          {clientInfo.war3_info.version}
        </span>
        .
      </p>
    ) : null;

  const detectGamePath = clientInfo && !clientInfo.war3_info.located && (
    <p>
      <span className="flo-text-warn">
        {formatClientErrorMessage(clientInfo.war3_info.error)}
      </span>
      {ws && clientInfo.war3_info.error === War3InfoError.InstallationPath && (
        <>
          <br />
          <span className="flo-text-warn">Please start the game then</span>
          <br />
          {reloading ? (
            <Spinner />
          ) : (
            <Button
              intent={Intent.WARNING}
              onClick={() => dispatch(reloadClientInfo(ws))}
            >
              Detect Game Path
            </Button>
          )}
        </>
      )}
    </p>
  );

  return (
    <div className="leading-normal">
      {error && (
        <Callout intent={Intent.DANGER} title="Connection failed">
          Please ensure Flo is running on port {port}.
        </Callout>
      )}
      {reloadError && (
        <Callout intent={Intent.DANGER} title="Detect game path failed">
          {reloadError.message}.
        </Callout>
      )}
      {status === WsStatus.Connecting && <Spinner />}
      {clientInfo && status === WsStatus.Connected ? (
        <>
          <p>
            Connected.
            <br />
            Running on local port{" "}
            <span className="flo-text-info font-semibold">{port}</span>, version{" "}
            <span className="flo-text-info font-semibold">
              {clientInfo.version}
            </span>
            .
          </p>
          {gameLocated}
          {detectGamePath}
        </>
      ) : (
        <p>Download and run Flo.</p>
      )}
    </div>
  );
}

function formatClientErrorMessage(error: War3InfoError) {
  switch (error) {
    case War3InfoError.UserDataPath:
      return "Could not locate Warcraft III user data path.";
    case War3InfoError.InstallationPath:
      return "Could not locate Warcraft III installation path.";
    default:
      return "Internal error, please check the logs.";
  }
}
