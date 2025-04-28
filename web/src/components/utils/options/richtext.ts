export function uuid() {
  const aA = ['a', 'A']
  let timestamp = ''
  for (let i = 0; i < 20; i++) {
    if (timestamp.length % 5 === 0 && timestamp.length !== 0) {
      timestamp += ','
    }
    timestamp += Math.floor(Math.random() * 10).toString()
  }
  let ids = []
  for (const item of timestamp.split(',')) {
    let num = Number(item)
    let letters = ''
    while (num > 0) {
      num--
      const a = aA[Math.floor(Math.random() * 2)]
      letters = String.fromCharCode((num % 26) + a.charCodeAt(0)) + letters
      num = Math.floor(num / 26)
    }
    ids.push(letters)
  }
  return ids.join('')
}
