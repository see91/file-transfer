import { faucetUrl } from '@/lib/url'

/**
 * Give Me TNLK
 * @param params address
 * @returns 
 */
export const giveMeTnlk = async (params): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetch(`${faucetUrl}/faucet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson)
      })
      .catch(function (err) {
        reject(err)
      })
  })
};