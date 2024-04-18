const date = new Date()

const day = String(date.getDate()).padStart(2, '0')
const month = String(date.getMonth() + 1).padStart(2, '0') // Los meses en JavaScript comienzan desde 0
const year = String(date.getFullYear()).substr(2)

export const formattedDate = `${day}/${month}/${year}`
