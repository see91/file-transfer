import { post } from '@/lib/request'

/**
 * 获取历史期数
 */
export const getRankingPeriods = async (params = {}) => {
  return await post('/ranking/periods', params)
};

/**
 * 获取指定期数的排行榜
 * @param period 期数   -1表示当前期 
 * @returns 
 */
export const getRankingPeriodsData = async (params) => {
  return await post('/ranking/list', params)
};
