export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...args)
    }
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(message, ...args)
  },
  warn: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, ...args)
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(message, ...args)
    }
  }
}