const UNIDADES = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']
const ESPECIAIS = [
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
  'dezesseis',
  'dezessete',
  'dezoito',
  'dezenove',
]
const DEZENAS = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
]
const CENTENAS = [
  '',
  'cento',
  'duzentos',
  'trezentos',
  'quatrocentos',
  'quinhentos',
  'seiscentos',
  'setecentos',
  'oitocentos',
  'novecentos',
]

function numberToText(n: number): string {
  if (n === 0) return 'zero'
  if (n < 10) return UNIDADES[n]
  if (n < 20) return ESPECIAIS[n - 10]
  if (n < 100) {
    const d = Math.floor(n / 10)
    const u = n % 10
    return u === 0 ? DEZENAS[d] : `${DEZENAS[d]} e ${UNIDADES[u]}`
  }
  if (n === 100) return 'cem'
  if (n < 1000) {
    const c = Math.floor(n / 100)
    const rest = n % 100
    return rest === 0 ? CENTENAS[c] : `${CENTENAS[c]} e ${numberToText(rest)}`
  }
  if (n < 1000000) {
    const thousands = Math.floor(n / 1000)
    const rest = n % 1000
    const tText = thousands === 1 ? 'mil' : `${numberToText(thousands)} mil`
    return rest === 0 ? tText : `${tText} e ${numberToText(rest)}`
  }
  const millions = Math.floor(n / 1000000)
  const rest = n % 1000000
  const mText = millions === 1 ? 'um milhão' : `${numberToText(millions)} milhões`
  return rest === 0 ? mText : `${mText} e ${numberToText(rest)}`
}

export function valorPorExtenso(valor: number): string {
  const totalCentavos = Math.round(Math.abs(valor) * 100)
  const reais = Math.floor(totalCentavos / 100)
  const centavos = totalCentavos % 100

  let result: string
  if (reais === 0) {
    result = 'zero reais'
  } else if (reais === 1) {
    result = 'um real'
  } else {
    result = `${numberToText(reais)} reais`
  }

  if (centavos > 0) {
    result += centavos === 1 ? ' e um centavo' : ` e ${numberToText(centavos)} centavos`
  }

  return result
}
