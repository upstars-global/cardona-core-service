export type ChatStatus = 'online' | 'offline' | 'busy' | 'away'

export interface ChatContact {
  id: number
  fullName: string
  role: string
  about: string
  avatar: string
  status: ChatStatus
}

export interface ChatMessage {
  message: string
  time: string
  senderId: number
  feedback: {
    isSent: boolean
    isDelivered: boolean
    isSeen: boolean
  }
}

export interface Chat {
  id: number
  userId: number
  unseenMsgs: number
  messages: ChatMessage[]
}

// ℹ️ This is chat type received in response of user chat
export interface ChatOut {
  id: Chat['id']
  unseenMsgs: Chat['unseenMsgs']
  messages: ChatMessage[]

  // @ts-expect-error Indexed Access Types
  lastMessage: ChatMessage[number]
}

export interface ChatContactWithChat extends ChatContact {
  chat: ChatOut
}
