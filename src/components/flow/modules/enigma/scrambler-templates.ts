type EnigmaScramblerTemplate = {
  name: string
  wiring: string
  notch: string
  mapType: 'TOP' | 'BOTTOM'
}

//  https://en.wikipedia.org/wiki/Enigma_rotor_details#Rotor_wiring_tables
export const ScramblerTemplates: EnigmaScramblerTemplate[] = [
  {
    name: 'Enigma I - I',
    wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
    notch: 'Q',
    mapType: 'TOP',
  },
  {
    name: 'Enigma I - II',
    wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
    notch: 'E',
    mapType: 'TOP',
  },
  {
    name: 'Enigma I - III',
    wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
    notch: 'V',
    mapType: 'TOP',
  },
  {
    name: 'M3 Army - IV',
    wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
    notch: 'J',
    mapType: 'TOP',
  },
  {
    name: 'M3 Army - V',
    wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK',
    notch: 'Z',
    mapType: 'TOP',
  },
  {
    name: '	M3 & M4 Naval (FEB 1942) - VI',
    wiring: 'JPGVOUMFYQBENHZRDKASXLICTW',
    notch: 'ZM',
    mapType: 'TOP',
  },
  {
    name: '	M3 & M4 Naval (FEB 1942) - VII',
    wiring: 'NZJHGRCXMYSWBOUFAIVLPEKQDT',
    notch: 'ZM',
    mapType: 'TOP',
  },
  {
    name: '	M3 & M4 Naval (FEB 1942) - VIII',
    wiring: 'FKQHTLXOCBJSPDZRAMEWNIUYGV',
    notch: 'ZM',
    mapType: 'TOP',
  },
  {
    name: 'CYPHER Ⅰ',
    wiring: 'UWYGADFPVZBECKMTHXSLRINQOJ',
    notch: '',
    mapType: 'BOTTOM',
  },
  {
    name: 'CYPHER Ⅱ',
    wiring: 'AJPCZWRLFBDKOTYUQGENHXMIVS',
    notch: '',
    mapType: 'BOTTOM',
  },
  {
    name: 'CYPHER Ⅲ',
    wiring: 'TAGBPCSDQEUFVNZHYIXJWLRKOM',
    notch: '',
    mapType: 'BOTTOM',
  },
]
