'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const MSG = new Map([
  // error code postrgresql ==> https://www.postgresql.org/docs/8.2/errcodes-appendix.html
  ['23505', { httpStatus: 400, code: '23505', message: 'data already exists.' }],
  ['42P01', { httpStatus: 500, code: '42P01', message: 'An error occurred in the database query.' }],
  ['42703', { httpStatus: 500, code: '42703', message: 'An error occurred in the database query.' }],
  ['42601', { httpStatus: 500, code: '42601', message: 'An error occurred in the database query.' }],
  ['23503', { httpStatus: 400, code: '23503', message: 'data already exists.' }],
  ['23502', { httpStatus: 400, code: '23502', message: 'field cannot be empty (database).' }],

  ['REGISTER_SUCCESS', { httpStatus: 200, code: 'M2001', message: 'Congratulations! You are successfully registered' }],
  ['SAVE_SUCCESS', { httpStatus: 200, code: '2001', message: 'save successfully.' }],
  ['VALID_SESSION', { httpStatus: 200, code: 'VALID_SESSION', message: 'Session is valid' }],
  ['SUCCESS', { httpStatus: 200, code: '2002', message: 'Action executed successfully' }],
  ['UPDATE_SUCCESS', { httpStatus: 200, code: '2003', message: 'update successfully.' }],
  ['DELETE_SUCCESS', { httpStatus: 200, code: '2004', message: 'deleted successfully.' }],
  ['NOT_FOUND', { httpStatus: 404, code: 'N4004', message: null }],
  ['USER_IS_INACTIVE', { httpStatus: 400, code: 'U4001', message: 'Sorry, your account is inactive. Please contact Admin for further information.' }],
  ['USER_NOT_REGISTER', { httpStatus: 400, code: 'U4000', message: 'Your email is not registered.' }],
  ['LOGIN_FAILED', { httpStatus: 400, code: 'L4000', message: 'Invalid username or password.' }],
  ['LOGIN_ATTEMPT_FAILED', { httpStatus: 400, code: 'L4001', message: 'Your account has reached the maximum number of failed login attempts and has been temporarily locked.' }],
  ['E_INVALID_SESSION', { httpStatus: 400, code: 'E_INVALID_SESSION', message: 'Session is invalid' }],
  ['E_CREATE_SESSION', { httpStatus: 400, code: 'E_CREATE_SESSION', message: 'Failed while creating session' }],
  ['E_CLOSE_SESSION', { httpStatus: 400, code: 'E_CLOSE_SESSION', message: 'Failed while closing session' }],
  ['PASSWORD_NOT_MATCH', { httpStatus: 400, code: 'P4000', message: 'password does not match.' }],
  ['ERROR_VALIDATION', { httpStatus: 400, code: 'V4000', message: null }],
  ['EXCEL_PARSE_ERROR', { httpStatus: 400, code: '400', message: null }],
  ['EXCEL_MOVE_ERROR', { httpStatus: 400, code: '400', message: null }],
  ['E_INVALID_AUTHORIZE', { httpStatus: 401, code: '401', message: 'Invalid authorize' }],
  ['EMAIL_ALREADY_USED', { httpStatus: 400, code: '400', message: 'Email is already registered by another account' }],
  ['ACCESS_DENIED', { httpStatus: 403, code: '403', message: 'permission denied' }],
  ['INTERNAL_SERVER_ERROR', { httpStatus: 500, code: '500', message: 'Internal server error.' }],
  ['RECORD_NOT_FOUND', { httpStatus: 404, code: '404', message: 'Record not found.' }],

  ['E_ACCESS_DENIED', { httpStatus: 401, code: 'E_ACCESS_DENIED' }],
  ['E_INVALID_USER_ROLE', { httpStatus: 400, code: 'E_INVALID_USER_ROLE' }],
  ['E_FETCH_DATA_FAILED', { httpStatus: 200, code: 'E_FETCH_DATA_FAILED' }],
  ['E_SAVE_DATA_FAILED', { httpStatus: 400, code: 'E_SAVE_DATA_FAILED' }],
  ['E_INVALID_PARAMETER', { httpStatus: 200, code: 'E_INVALID_PARAMETER' }],
  ['E_UPDATE_DATA_FAILED', { httpStatus: 200, code: 'E_UPDATE_DATA_FAILED' }],
  ['E_DELETE_DATA_FAILED', { httpStatus: 200, code: 'E_DELETE_DATA_FAILED' }],
  ['FAILED_INSERT', { httpStatus: 400, code: 'FAILED_INSERT', message: 'Failed Insert To Database' }],
  ['DUPLICATE_KEY', { httpStatus: 400, code: 'DUPLICATE_KEY', message: 'Unique Key Is Already Exist.' }],
  ['FAILED_UPDATE', { httpStatus: 400, code: 'FAILED_UPDATE', message: 'Failed Update Data.' }],
  ['FAILED_UPDATE_DUPLICATE', { httpStatus: 400, code: 'FAILED_UPDATE_DUPLICATE', message: 'Failed Update Data Because Duplicate Key.' }],
])

class CustomException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  static getMessage(message_code) {
    const msg = MSG.get(message_code)
    return msg.message
  }

  static getResponse({ message_code, response, data }) {
    const msg = MSG.get(message_code)
    if (msg !== undefined) {
      return response
        .status(msg.httpStatus)
        .json({
          code: msg.httpStatus,
          message_code: msg.code,
          message: msg.message,
          data: data
        })
    } else {
      return response
        .status(500)
        .json({
          code: 500,
          message: 'error mapping http response (message code not found)',
          data: data
        })
    }
  }

  static getErrorResponse(error, response) {
    const msg = MSG.get(error.code)
    if (msg !== undefined) {
      if (typeof msg.message !== 'undefined')
        return response
          .status(msg.httpStatus)
          .json({
            code: msg.httpStatus,
            message_code: msg.code,
            message: msg.message
          })
      else
        return response
          .status(msg.httpStatus)
          .json({
            code: msg.httpStatus,
            message_code: msg.code,
            message: error.message
          })
    } else {
      return response
        .status(500)
        .json({
          code: 500,
          message_code: error.code,
          message: error.message
        })
    }
  }

  static getErrorResponseOauth(response, code, errorMessageID, errorMessageEng) {
    return response
      .status(code)
      .json({
        ErrorCode: String(code),
        ErrorMessage: {
          Indonesian: errorMessageID,
          English: errorMessageEng
        }
      })
  }
}

module.exports = CustomException
