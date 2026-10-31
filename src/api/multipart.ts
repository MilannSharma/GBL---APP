export interface UploadFile {
  uri: string;
  name?: string;
  type?: string;
}

// Photo uploads on slow mobile networks need far more than the 15s JSON default.
const UPLOAD_TIMEOUT_MS = 60000;

/**
 * Axios must not serialize the React Native FormData (it would corrupt the file
 * part), and the multipart boundary is added by the native networking layer.
 */
export const multipartConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: UPLOAD_TIMEOUT_MS,
  transformRequest: (body: unknown) => body,
};

export function appendFile(
  form: FormData,
  field: string,
  file: UploadFile,
  fallbackName: string
): void {
  form.append(field, {
    uri: file.uri,
    name: file.name ?? fallbackName,
    type: file.type ?? 'image/jpeg',
  } as unknown as Blob);
}
