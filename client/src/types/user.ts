export interface User {
  _id?: string
  name: string | undefined
  email: string | undefined
  seller?: boolean
  created?: Date | string
  updated?: Date | string
  password?: string
}

export interface UserCreation {
  name: string | undefined
  email: string | undefined
  password: string | undefined
}

export interface UserSignIn {
  email: string | undefined
  password: string | undefined
}

export interface UserAuth extends Response {
  token: string
  error?: string
}

export interface UserReducerState {
  userList: User[]
}

export interface LoginType {
  email: string
  password: string
}
