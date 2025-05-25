export const convertBase64ToBlob = (base64: string, mimeType: string) => {
  const base64Data = base64.replace(/^data:[^;]+;base64,/, '')
  const byteCharacters = atob(base64Data);  
  const byteArrays = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays[i] = byteCharacters.charCodeAt(i);
  }

  return new Blob([byteArrays], { type: mimeType });
}
