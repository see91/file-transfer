import { post } from '@/lib/request'

/**
 * 获取消息列表
 * @param params account_id
 * @param params signature
 * @param params page_size
 * @param params 
 * @returns 
 */
export const getNoticeList = async (params) => {
  return await post('/notice/list', params)
};

/**
 * 将通知标记为已读
 * @param params notice_id
 * @param params account_id
 * @param params signature
 * @returns 
 */
export const setNoticeRead = async (params) => {
  return await post('/notice/read', params)
};

/**
 * 获取申请详情
 * @param params 
 * @returns 
 */
export const getApplyDetail = async (params) => {
  return await post('/apply/detail', params)
};

/**
 * 批量设置消息已读
 * @param notice_ids [string|number]
 * @param account_id string
 * @param signature string
 * @returns 
 */
export const setBatchRead = async (params) => {
  return await post('/notice/batch-read', params)
};