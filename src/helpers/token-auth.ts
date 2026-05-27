export const checkIsLoggedIn = (onFail?: CallableFunction): boolean => {
  try {
    const tokenKey = Object.keys(localStorage).find(key => key.startsWith('auth-tokens-'))
    if (!tokenKey)
      return false

    const raw = localStorage.getItem(tokenKey)
    if (!raw)
      return false

    const tokens = JSON.parse(raw)

    return Boolean(tokens?.accessToken && tokens?.refreshToken)
  }
  catch {
    onFail && onFail()

    return false
  }
}
