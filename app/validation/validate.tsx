export const isValidNormalText = (text: string, prefix?: string) => {
  return text.length != 0 ?
    getSuccessValidation()
    :
    getFailValidation((prefix ?? 'Text') + ' can not empty')
}

export const validateLoginInfo = (email: string, password: string): ValidateResultType => {
  if (email.length == 0) {
    return getFailValidation('Please fill in email')
  }

  if (password.length == 0) {
    return getFailValidation('Please fill in password')
  }

  return getSuccessValidation()
}

export const isValidPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.toLowerCase()
      .match(
        /(84|0[3|5|7|8|9])+([0-9]{8})\b/
      ) ?
      getSuccessValidation()
      : getFailValidation('Phone number is incorrect format')
}

export const isValidEmail = (email: string) => {
  return email.toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) ?
    getSuccessValidation()
    : getFailValidation('Email is incorrect format')
}

export const isValidPassword = (password: string) => {
  for (let i = 0; i < password.length; i++) {
    if (password[i] == password[i].toUpperCase())
      break
    else if (i == password.length - 1)
      return getFailValidation('Password need 1 uppercase character')
  }

  return password.length > 8 ?
    getSuccessValidation() :
    getFailValidation('Password need atleast 8 characters')
}

export const getFailValidation = (message: string): ValidateResultType => {
  return {
    qualify: false,
    message: message
  }
}

export const getSuccessValidation = (): ValidateResultType => {
  return {
    qualify: true,
    message: ''
  }
}

export type ValidateResultType = {
  qualify: boolean,
  message: string
}