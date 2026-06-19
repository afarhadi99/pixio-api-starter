import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

function extensionForMediaType(mediaType: string): string {
  return mediaType === 'video' ? 'mp4' : 'png';
}

/** Download remote media to the app cache and return the local URI. */
export async function downloadMediaToCache(
  url: string,
  mediaType: string,
): Promise<string> {
  const ext = extensionForMediaType(mediaType);
  const dest = `${FileSystem.cacheDirectory}pixio-${Date.now()}.${ext}`;
  const result = await FileSystem.downloadAsync(url, dest);
  return result.uri;
}

/** Open the native share sheet for a remote media URL. */
export async function shareMediaUrl(url: string, mediaType: string): Promise<void> {
  const localUri = await downloadMediaToCache(url, mediaType);
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device');
  }
  await Sharing.shareAsync(localUri, {
    mimeType: mediaType === 'video' ? 'video/mp4' : 'image/png',
    dialogTitle: 'Share generation',
  });
}
