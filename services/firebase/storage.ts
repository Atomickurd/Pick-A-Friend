import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../../lib/firebase';

export interface UploadProgress {
  progress: number; // 0–100
  downloadURL: string | null;
  error: Error | null;
}

/**
 * Upload a local file URI to Firebase Storage.
 * Calls onProgress with progress updates; resolves with the download URL.
 */
export async function uploadFile(
  storagePath: string,
  localUri: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const storageRef = ref(storage, storagePath);
  const task = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      },
    );
  });
}

export async function deleteFile(storagePath: string): Promise<void> {
  await deleteObject(ref(storage, storagePath));
}
