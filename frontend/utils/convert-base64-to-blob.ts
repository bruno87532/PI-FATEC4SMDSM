export const convertBase64ToBlob = (base64: string, mimeType: string) => {
  const byteCharacters = atob(base64);  
  const byteArrays = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([byteArrays], { type: mimeType });
}
