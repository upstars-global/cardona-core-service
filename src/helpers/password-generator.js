const generatePassword = (passwordLength = 10) => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()';
    const numbers = '0123456789';
    const allChars = lowercaseChars + uppercaseChars + specialChars + numbers;
    const getRandomChar = (charSet) => {
        return charSet[Math.floor(Math.random() * charSet.length)];
    };
    const hasLowercase = () => getRandomChar(lowercaseChars);
    const hasUppercase = () => getRandomChar(uppercaseChars);
    const hasSpecialChar = () => getRandomChar(specialChars);
    const hasNumber = () => getRandomChar(numbers);
    let password = '';
    password += hasLowercase();
    password += hasUppercase();
    password += hasSpecialChar();
    password += hasNumber();
    for (let i = password.length; i < passwordLength; i++) {
        password += getRandomChar(allChars);
    }
    return password;
};
export default generatePassword;
//# sourceMappingURL=password-generator.js.map