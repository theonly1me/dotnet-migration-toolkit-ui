import axios from 'axios';

import { GENERATE_REPORT, CLEAR_REPORT, SEARCH_NUGET } from './types';

export const generateReport = (path, reportType) => async dispatch => {
  const { data } = await axios.post(
    `http://localhost:5000/api/v1/analyze/${reportType}`,
    {
      path,
    }
  );
  dispatch({ type: GENERATE_REPORT, payload: { data, path, reportType } });
};

// https://localhost:44302

export const clearStore = () => {
  return {
    type: CLEAR_REPORT,
  };
};

export const nugetSearch = searchTerm => async (dispatch, getState) => {
  const state = getState();
  console.log(state);
  debugger;
  const { data } = await axios.get(`https://azuresearch-usnc.nuget.org/`, {
    params: {
      q: searchTerm,
      prerelease: false,
      packageType: 'dependency',
    },
  });
  return dispatch({
    type: SEARCH_NUGET,
    payload: data,
  });
};
