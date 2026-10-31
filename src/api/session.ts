type UnauthorizedHandler = () => void;

let handler: UnauthorizedHandler | null = null;

/** The app shell registers how to leave the signed-in area once the token is rejected. */
export function setUnauthorizedHandler(next: UnauthorizedHandler | null): void {
  handler = next;
}

export function notifyUnauthorized(): void {
  handler?.();
}
