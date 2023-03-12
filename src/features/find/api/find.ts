import { axios } from "@/lib/axios";
import { post } from "@/lib/request";
import { FileData } from '@/types';
import { sendMessageSync } from "@/lib/sendMessage";
import { isMock } from "@/config";
export type FileListRequestOptions = {
  fileName?: string;
  fileCategory?: string;
  fileType?: string;
  descOrder?: boolean;
  pageIndex?: number;
  pageSize?: number;
  include?: boolean; // /file/other-list API, include: indicates whether the query result contains file list data of the current account 
};
export type FileDetailRequestOptions = {
  fileId: string;
  fileUserAccountId?: string;
}
export const getFileList: (args: FileListRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  const accountID = '913dddef1c97cad769ffab5369cc414f563b703449f84fb54fb6dbce583a2e30'
  let sendData = {
    account_id: accountID,
    paginate: {
      page: 1,
      page_size: 50,
    },
  };
  return await axios.post('/file/others-list', sendData)
  // return await axios.post('/file/list', sendData)
  // return isMock
  //   ? await axios.post('/file/list') //should be file/others-list
  //   : await sendMessageSync("getOtherShareFiles", data);
};

export const getFileDetail: (args: FileDetailRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  const accountID = '913dddef1c97cad769ffab5369cc414f563b703449f84fb54fb6dbce583a2e30'
  let sendData = {
      file_id: data.fileId,
      consumer_id: accountID,
  };
  return await axios.post('/file/detail', sendData)
  // return isMock
  //   ? await axios.post('/file/detail')
  //   : await sendMessageSync("getFileDetailInfo", data);
};

export const getFileListByCreator = async (params) => await post('/file/list', params)
