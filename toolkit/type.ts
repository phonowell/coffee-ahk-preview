export type Env = 'dev' | 'development' | 'prd' | 'pre' | 'preview' | 'production'

export type FnAsync = (...arg: unknown[]) => Promise<unknown>

export type Type = 'activity' | 'default' | 'mp' | 'spa'
