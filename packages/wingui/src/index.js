import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../node_modules/realgrid/dist/realgrid-style.css'
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import feather from 'feather-icons';
import * as Icon from 'react-feather';
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap/dist/css/bootstrap.css'

import flatpickr from "flatpickr";
window.flatpickr
import "flatpickr/dist/flatpickr.min.css";

import App from './App';

import { userStoreApi } from '@zionex/wingui-core/store/userStore';

import { installSearchKey, itemsToColDefs } from '@zionex/wingui-core';

import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartDragdata from 'chartjs-plugin-dragdata'
import annotationPlugin from 'chartjs-plugin-annotation';
import EqualizerBarChart from './component/chart/EqualizerBarChart'
import { BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot";

import {
  Chart as ChartJS,
  registerables
} from 'chart.js';

ChartJS.register(...registerables);
ChartJS.register({ annotationPlugin, ChartDataLabels, ChartDragdata, EqualizerBarChart, BoxPlotController, BoxAndWiskers });

installSearchKey();

if (sessionStorage.getItem('token')) {
  userStoreApi.getState().setUserInfo();
}
let packageJson = require('../package.json');
if(packageJson.version !== localStorage.getItem('wingui-version')){
  localStorage.clear()
  localStorage.setItem('wingui-version', packageJson.version)
  localStorage.setItem('themeMode', 'system')
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export * from '@wingui/style/CommonStyle'
export * from '@zionex/wingui-core/component/grid/PopupGridLayout'
export * from '@zionex/wingui-core/component/grid/PopExcelOption';

export * from '@zionex/wingui-core/utils/polyfill'
export * from '@zionex/wingui-core/common/const';
export * from '@zionex/wingui-core/utils/common';
export * from '@zionex/wingui-core/component/grid/grid';
export * from '@zionex/wingui-core/component/gantt/gantt';
export { getActiveViewId } from '@zionex/wingui-core/store/contentStore';
export { settings, transLangKey, baseURI, initI18n, getHeaders } from '@zionex/wingui-core/index';
export {
  Icon,
  axios,
  feather,
  flatpickr
};