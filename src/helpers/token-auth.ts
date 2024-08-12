import { isLoggedIn } from 'axios-jwt'

export const checkIsLoggedIn = (onFail?: CallableFunction) => {
  try {
    return isLoggedIn()
  }
  catch {
    onFail && onFail()

    return true
  }
}
