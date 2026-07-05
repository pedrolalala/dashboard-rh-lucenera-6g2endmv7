const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

interface ZipEntry {
  name: string
  data: Uint8Array
}

const DOS_TIME = (12 << 11) | (0 << 5) | 0
const DOS_DATE = ((2024 - 1980) << 9) | (1 << 5) | 1

function u16(dv: DataView, o: number, v: number) {
  dv.setUint16(o, v, true)
}
function u32(dv: DataView, o: number, v: number) {
  dv.setUint32(o, v, true)
}

export function createZipBlob(files: ZipEntry[]): Blob {
  const enc = new TextEncoder()
  const localChunks: Uint8Array[] = []
  const centralEntries: Array<{ name: Uint8Array; dataLen: number; crc: number; offset: number }> =
    []
  let offset = 0

  for (const f of files) {
    const nameBytes = enc.encode(f.name)
    const crc = crc32(f.data)
    const lh = new Uint8Array(30 + nameBytes.length)
    const dv = new DataView(lh.buffer)
    u32(dv, 0, 0x04034b50)
    u16(dv, 4, 20)
    u16(dv, 6, 0)
    u16(dv, 8, 0)
    u16(dv, 10, DOS_TIME)
    u16(dv, 12, DOS_DATE)
    u32(dv, 14, crc)
    u32(dv, 18, f.data.length)
    u32(dv, 22, f.data.length)
    u16(dv, 26, nameBytes.length)
    u16(dv, 28, 0)
    lh.set(nameBytes, 30)
    localChunks.push(lh, f.data)
    centralEntries.push({ name: nameBytes, dataLen: f.data.length, crc, offset })
    offset += lh.length + f.data.length
  }

  const centralChunks: Uint8Array[] = []
  for (const e of centralEntries) {
    const cd = new Uint8Array(46 + e.name.length)
    const dv = new DataView(cd.buffer)
    u32(dv, 0, 0x02014b50)
    u16(dv, 4, 20)
    u16(dv, 6, 20)
    u16(dv, 8, 0)
    u16(dv, 10, 0)
    u16(dv, 12, DOS_TIME)
    u16(dv, 14, DOS_DATE)
    u32(dv, 16, e.crc)
    u32(dv, 20, e.dataLen)
    u32(dv, 24, e.dataLen)
    u16(dv, 28, e.name.length)
    u16(dv, 30, 0)
    u16(dv, 32, 0)
    u16(dv, 34, 0)
    u16(dv, 36, 0)
    u32(dv, 38, 0)
    u32(dv, 42, e.offset)
    cd.set(e.name, 46)
    centralChunks.push(cd)
  }

  const centralSize = centralChunks.reduce((s, c) => s + c.length, 0)
  const eocd = new Uint8Array(22)
  const edv = new DataView(eocd.buffer)
  u32(edv, 0, 0x06054b50)
  u16(edv, 4, 0)
  u16(edv, 6, 0)
  u16(edv, 8, files.length)
  u16(edv, 10, files.length)
  u32(edv, 12, centralSize)
  u32(edv, 16, offset)
  u16(edv, 20, 0)

  const all = [...localChunks, ...centralChunks, eocd]
  const total = all.reduce((s, c) => s + c.length, 0)
  const result = new Uint8Array(total)
  let pos = 0
  for (const c of all) {
    result.set(c, pos)
    pos += c.length
  }
  return new Blob([result], { type: 'application/zip' })
}
