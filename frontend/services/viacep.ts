export class viacep {
  static async getDataCep(cep: string) {
    try {
      const res = await fetch("https://viacep.com.br/ws/" + cep + "/json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) throw new Error("Failed to fetching data by cep")

      return await res.json()
    } catch (error) {
      console.error("An error ocurred while fetching data by cep", error)
    }
  }
}