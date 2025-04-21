import { convertBase64ToBlob } from "@/utils/convert-base64-to-blob"

export class googleDriveService {
  private static pathBackend = process.env.NEXT_PUBLIC_BACKEND

  static async getImageFromGoogleDrive(id: string): Promise<File> {
    try {
      const res = await fetch(this.pathBackend + "/google-drive/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const {buffer, fileName, mimeType} = await res.json()
      const blob = convertBase64ToBlob(buffer, mimeType)
      
      const file = new File([blob], fileName, { type: mimeType } )
      return file
    } catch (error) {
      console.error("An error ocurred while downloading the image from google drive", error)
      throw error
    }
  }
}