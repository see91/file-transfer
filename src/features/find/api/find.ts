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
  include?:boolean; // /file/other-list API, include: indicates whether the query result contains file list data of the current account 
};
export type FileDetailRequestOptions = {
  fileId: string;
  fileUserAccountId?: string;
}
export const getFileList: (args: FileListRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return await axios.post('/file/list')
  // return isMock
  //   ? await axios.post('/file/list') //should be file/others-list
  //   : await sendMessageSync("getOtherShareFiles", data);
};

export const getFileDetail: (args: FileDetailRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/file/detail')
    : await sendMessageSync("getFileDetailInfo", data);
};

export const getFileListByCreator = async (params) => await post('/file/list',params)
