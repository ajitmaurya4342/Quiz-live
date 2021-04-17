import Api from './Api';
import { API_VERSION } from '../config/index';



export default {
  GetGameList() {
    return Api().get('admin/gameList');
  },
  addUser(payload) {
    return Api().post('admin/addEditUser', payload);
  },

  LoginUser(payload) {
    return Api().post('admin/login', payload);
  },
  getGameLevelScreen(payload) {
    return Api().get(`admin/level-list-by-game?game_id=${payload.game_id}&user_id=${payload.user_id}`);
  },
  getQuestionByLevel(payload) {
    return Api().get(`admin/LevelList?level_id=${payload.level_id}`);
  },
  updateToken(payload) {
    console.log(payload, "OBJECT")
    return Api().post(`admin/tokenUpdate`, payload);
  },
  addUserScore(payload) {
    console.log(payload, "sdfdsdf2");
    return Api().post(`admin/addScore`, payload);
  },
  getLeaderBoard(payload) {
    console.log(payload, "sdfdsdf2");
    return Api().get(`admin/getLeaderBoard?game_id=${payload.game_id}&user_id=${payload.user_id}`);
  },
  transaction_detail(payload){
      return Api().post(`admin/transaction_detail`, payload);
  }
  //   LoginUser(payload) {
  //     console.log(Api, 'uiyiuyi');
  //     return Api().post('admin/login', payload);
  //   },
  //   GetSubmissionFeedbacks(payload) {
  //     return Api().post(
  //       `/${API_VERSION}/section/feedback/${payload.feedback_id}`,
  //       payload,
  //     );
  //   },
};
