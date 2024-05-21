export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader()

  reader.onload = () => resolve(reader.result)
  reader.onerror = error => reject(error)
  reader.readAsDataURL(file)
})

export const fromBase64 = (data, sliceSize = 512) => {
  const parts = data.split(';base64,')
  const mime = parts[0].split(':').pop()
  const base64Content = parts[1]

  const byteCharacters = atob(base64Content, mime)
  const byteArrays = []
    
  let offset = 0
  while (offset < byteCharacters.length) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)
    const byteNumbers = new Array(slice.length)
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
    offset += sliceSize
  }
  
  return new Blob(byteArrays, { type: mime })
}

export const downloadFormBase64 = (data, name) => {
  if (data) {
    const blob = fromBase64(data)

    const anchor = document.createElement('a')

    anchor.style.display = 'none'
    anchor.href = URL.createObjectURL(blob)
    anchor.download = name

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
        
    URL.revokeObjectURL(anchor.href)
  }
}

export const openFormInNewTabBase64 = (data, name) => {
  if (data) {
    const blob = fromBase64(data)

    const newTab = window.open('', '_blank')

    if (newTab) {
      newTab.document.write('<html><head><title>' + name + '</title></head><body>')
      newTab.document.write('<iframe width="100%" height="100%" src="' + URL.createObjectURL(blob) + '"></iframe>')
      newTab.document.write('</body></html>')
    } else {
      console.error('Falha ao abrir. Verifique as configurações do navegador')
    }
  }
}
