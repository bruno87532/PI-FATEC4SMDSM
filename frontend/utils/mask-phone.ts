export const maskPhone = (value: string) => {
  const number = value.replace(/\D/g, "")
  if (number.length === 0) {
    return ""
  } else if (number.length === 1) {
    return `(${number}`
  } else if (number.length <= 6) {
    return `(${number.slice(0, 2)}) ${number.slice(2)}`
  } else if (number.length === 7) {
    return `(${number.slice(0, 2)}) ${number.slice(2)} - `
  } else {
    return `(${number.slice(0, 2)}) ${number.slice(2, 7)} - ${number.slice(7, 11)}`
  }
}