export const logger = {
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...args)
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args)
  },
  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, ...args)
    }
  },
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(message, ...args)
    }
  }
}