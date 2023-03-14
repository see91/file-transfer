import { axios } from "@/lib/axios";
import { FileData } from '@/types';
import { post } from '@/lib/request'
import { sendMessageSync } from "@/lib/sendMessage";
import { isMock } from "@/config";
import { BigNumber } from "ethers";

export type AccountUploadedFilesRequestOptions = {
  fileName?: string;
  pageIndex?: number;
  pageSize?: number;
};

export type PolicyServerFeeRequestOptions = {
  startSeconds?: number; // start time
  endSeconds?: number; // end time
  ursulaShares?: number; // ursulan, pre of shares
};
// export type ApprovalUseFilesRequestOptions = {
//   userAccountId: string
//   applyId: string;
//   remark?: string;
// };
export type FilesInfoRequestByStatusRequestOptions = {
  fileId?: string;
  proposerId?: string;
  fileOwnerId?: string;
  applyId?: string;
  status?: number;
  pageIndex?: number;
  pageSize?: number;
};
export type RefuseApplicationOfUseFilesRequestOptions = {
  applyId: string;
  remark?: string;
};

export type FilesByStatusForAllApplyAsPublisherRequestOptions = {
  status?: number;
  pageIndex?: number;
  pageSize?: number;
}

export const getAccountUploadedFiles: (args: AccountUploadedFilesRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/account/uploadedFiles')
    : await sendMessageSync("getAccountUploadedFiles", data);
};


export const getPolicyServerFee: (args: PolicyServerFeeRequestOptions) => Promise<any> = async (
  data
): Promise<BigNumber> => {
  return isMock
    ? await axios.post('/pay/policyServerFee')
    : await sendMessageSync("getPolicyServerFee", data);
};

// export const ApprovalUseFiles: (args: ApprovalUseFilesRequestOptions) => Promise<any> = async (
//   data
// ): Promise<BigNumber> => {
//   return isMock
//     ? await axios.post('/account/approval')
//     : await sendMessageSync("ApprovalUseFiles", data);
// };

export const getFilesInfoByStatus: (args: FilesInfoRequestByStatusRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/account/filesInfo')
    : await sendMessageSync("getFilesInfoByStatus", data);
};

export const refuseApplicationOfUseFiles: (args: RefuseApplicationOfUseFilesRequestOptions) => Promise<any> = async (
  data
): Promise<unknown> => {
  return isMock
    ? await axios.post('/account/refuse')
    : await sendMessageSync("refuseApplicationOfUseFiles", data);
};

export const getFilesByStatusForAllApplyAsPublisher: (args: FilesByStatusForAllApplyAsPublisherRequestOptions) => Promise<any> = async (
  data
): Promise<unknown> => {
  return await axios.post('/apply/list', data)
  // return isMock
  //   ? await axios.post('/account/filesInfo')
  //   : await sendMessageSync("getFilesByStatusForAllApplyAsPublisher", data);
};

//the method be obsoleted please call method of getUserInfo below, from the agent
export const getUserInfo = async (params) => await post('/account/get', params)

// export const getUserInfo: (account_id: string) => Promise<any> = async (
//   data,
// ): Promise<unknown> => {
//   return isMock
//     ? await axios.post("/account/get")
//     : await sendMessageSync("getUserInfo", {
//         accountId: data,
//       });
// };

/**
 * 返回用户指定时间段内上传的文件总数
 * @param account_id string
 * @param start_at timestamp
 * @param end_at timestamp
 * @returns 
 */
export const getUserFileTotal = async (params) => await post('/file/total', params)

/**
 * 返回用户指定时间段内分享的文件总数
 * @param account_id string
 * @param start_at timestamp
 * @param end_at timestamp
 * @returns 
 */
export const getUserShareTotal = async (params) => await post('/apply/share-total', params)