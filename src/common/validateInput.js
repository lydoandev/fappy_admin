// function that returns true if value is email, false otherwise
function verifyEmail(value) {
  var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailRex.test(value) && value.length < 255) {
    return true;
  }
  return false;
}

function verifyPhone(value) {
  if (value.length === 10 || value.length === 11) {
    return true;
  }
  return false;
}

function verifyNumber(value) {
  var numberRex = new RegExp("^[0-9]+$");
  if (numberRex.test(value)) {
    return true;
  }
  return false;
}

function verifyLenght(value) {
  if (value.length >= 6) {
    return true;
  }
  return false;
}

var validationInput = {
  verifyEmail,
  verifyPhone,
  verifyNumber,
  verifyLenght
}

export default validationInput;