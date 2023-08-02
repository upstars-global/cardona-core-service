const generatePassword = (passwordLength = 10): string => {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const specialChars = '!@#$%^&*()'
  const numbers = '0123456789'
  const allChars = lowercaseChars + uppercaseChars + specialChars + numbers

  const getRandomChar = (charSet: string): string => {
    return charSet[Math.floor(Math.random() * charSet.length)]
  }

  const hasLowercase = (): string => getRandomChar(lowercaseChars)
  const hasUppercase = (): string => getRandomChar(uppercaseChars)
  const hasSpecialChar = (): string => getRandomChar(specialChars)
  const hasNumber = (): string => getRandomChar(numbers)

  let password = ''
  password += hasLowercase()
  password += hasUppercase()
  password += hasSpecialChar()
  password += hasNumber()

  for (let i = password.length; i < passwordLength; i++) {
    password += getRandomChar(allChars)
  }

  return password
}
export default generatePassword
