import validationInput from './validateInput'

function getInputError(value, type) {
  switch (type) {
    case "email":
      if (validationInput.verifyEmail(value)) {
        return false
      } else {
        return true
      }
    case "phone":
      if (validationInput.verifyPhone(value)) {
        return false
      } else {
        return true
      }
    case "password":
      if (validationInput.verifyLenght(value)) {
        return false
      } else {
        return true
      }
    default:
      break;
  }
}

var validateError = {
  getInputError
}
export default validateError;