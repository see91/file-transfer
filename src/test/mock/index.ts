import Mock from "mockjs";

import unlockData from "./auth/unlock.json";
import meData from "./auth/me.json";
import fileListData from "./file/list.json";
import fileDetail from "./file/detail.json";
import uploadedFiles from "./account/uploadedFiles.json";
import filesInfo from "./account/filesInfo.json";
import getAccountInfo from "./account/accountGet.json";
import policyInfosAsUser from "./account/policyInfosAsUser.json";
import publishedPolicyInfos from "./account/publishedPolicyInfos.json";

//TODO:
// Mock.mock(/http:\/\/dev_domain.com\/pay\/policyServerFee/, "post", () => {
//   return {};
// });

Mock.mock(/http:\/\/dev_domain.com\/account\/get/, "post", () => {
  return getAccountInfo;
});
Mock.mock(/http:\/\/dev_domain.com\/auth\/unlock/, "post", () => {
  return unlockData;
});
Mock.mock(/http:\/\/dev_domain.com\/auth\/me/, "get", () => {
  return meData;
});
Mock.mock(/http:\/\/dev_domain.com\/file\/list/, "post", () => {
  return fileListData;
});
Mock.mock(/http:\/\/dev_domain.com\/file\/detail/, "post", () => {
  return fileDetail;
});
Mock.mock(/http:\/\/dev_domain.com\/account\/uploadedFiles/, "post", () => {
  return uploadedFiles;
});
Mock.mock(/http:\/\/dev_domain.com\/account\/filesInfo/, "post", () => {
  return filesInfo;
});
Mock.mock(/http:\/\/dev_domain.com\/account\/policyInfosAsUser/, "post", () => {
  return policyInfosAsUser;
});
Mock.mock(
  /http:\/\/dev_domain.com\/account\/publishedPolicyInfos/,
  "post",
  () => {
    return publishedPolicyInfos;
  },
);
