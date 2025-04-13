export const maskPrice = (value: string) => {
  const number = value.replace(/\D/g, "").replace(/^0+/g, "")
  if (number.length > 2) {
    const numberFormateed = number.length === 3 ? "0" + number.slice(0, -2) + "." + number.slice(-2) : number.slice(0, -2) + '.' + number.slice(-2)
    return numberFormateed
  } else {
    const numberFormateed = number.length === 1 ?  "00.0" + number : number.length === 2 ? "00" + "." + number : "00.00"
    return numberFormateed
  }
}