/* eslint-disable global-require */
import {resolvePromiseMap} from 'universal/utils/promises';
import makeReducer from 'universal/redux/makeReducer';

const setImports = () =>
  new Map([
    ['component', System.import('universal/containers/Dashboard/DashboardContainer')],
    ['socket', System.import('redux-socket-cluster')],
  ]);

const getImports = importMap => ({
  component: importMap.get('component'),
  socket: importMap.get('socket').socketClusterReducer,
});

export default store => ({
  path: 'newteam',
  getComponent: async(location, cb) => {
    const promiseMap = setImports();
    const importMap = await resolvePromiseMap(promiseMap);
    const {component, ...asyncReducers} = getImports(importMap);
    const newReducer = makeReducer(asyncReducers);
    store.replaceReducer(newReducer);
    cb(null, component);
  },
  getIndexRoute: async(location, cb) => {
    const component =
      await System.import('universal/modules/newTeam/components/NewTeam/NewTeam');
    cb(null, {component});
  }
});
