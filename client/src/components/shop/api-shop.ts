import { ShopCreation } from '../../types/shop'

// const URL = 'https://backend-online-shop-sla686.herokuapp.com/api/v1'
const URL = 'http://localhost:4000/api/v1'

const create = (
  params: { userId: string },
  credentials: { t: string },
  shop: ShopCreation
) => {
  console.log('shop:', shop)
  return fetch(`${URL}/shops/by/` + params.userId, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + credentials.t,
    },
    body: shop,
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

const list = async (signal: AbortSignal) => {
  try {
    const response = await fetch(`${URL}/shops/`, {
      method: 'GET',
      signal: signal,
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

export { create, list }
