let currentUserId: string | null = null

export function setAuthState(userId: string | null) {
  currentUserId = userId
}

export function isAuthed(): boolean {
  return currentUserId !== null
}
