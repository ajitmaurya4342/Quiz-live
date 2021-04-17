import React from 'react';
import axios from 'axios';
import {BASEURL} from '../config/index';
// import { router } from "@/router";
// import cookieType from "@/helpers/cookieType";
// import Constant from "@/helpers/constant";

export default () => {
  const instance = axios.create({
    baseURL: BASEURL,
  });

  instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

  instance.interceptors.response.use(
    function (response) {
      // Do something with response data
      return response;
    },
    function (error) {
      return Promise.reject(error);
    },
  );
  return instance;
};
