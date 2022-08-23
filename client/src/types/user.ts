export interface User {
  _id: number
  name: string
  email: string
  seller: boolean
  created: Date | string
  updated?: Date | string
}

export interface UserReducerState {
  userList: User[]
}

export interface LoginType {
  email: string
  password: string
}
