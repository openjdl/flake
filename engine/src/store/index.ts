import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all, call, race, spawn, take } from "redux-saga/effects";
import * as sentry from "@sentry/react";
import { Actions } from "./Actions.ts";

export interface GlobalState {}

export interface ReduxAction {
  type: string;
}

const InitialState: GlobalState = {};

function reducer(state = InitialState, action: ReduxAction) {
  switch (action.type) {
  }
}

const reducers = {};

const Sagas = [function* () {}];

function* rootSaga(sagasToRun = Sagas): any {
  const result = yield race({
    running: all(
      sagasToRun.map((saga) =>
        spawn(function* () {
          while (true) {
            try {
              yield call(saga);
              break;
            } catch (e) {
              // TODO: use logger
              console.error(e);
              sentry.captureException(e);
            }
          }
        }),
      ),
    ),
    crashed: take(Actions.SafeCrash),
  });

  if (result.crashed) {
    yield call(rootSaga);
  }
}

export const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

export const runSagaMiddleware = () => sagaMiddleware.run(rootSaga);
