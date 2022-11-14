const PREFIX_LOG_INFO = 'I/';
const PREFIX_LOG_WARN = 'W/';
const PREFIX_LOG_ERROR = 'E/';

const info = (key = '', data) => {
  const _key = key.startsWith(PREFIX_LOG_INFO)
    ? key
    : `${PREFIX_LOG_INFO}: ${key}`;
  console.log(_key)
};

const warn = (key = '', data) => {
  const _key = key.startsWith(PREFIX_LOG_WARN)
    ? key
    : `${PREFIX_LOG_WARN}: ${key}`;
  console.log(_key)
};

const error = (key = '', data) => {
  const _key = key.startsWith(PREFIX_LOG_ERROR)
    ? key
    : `${PREFIX_LOG_ERROR}: ${key}`;
  console.log(_key)
};
