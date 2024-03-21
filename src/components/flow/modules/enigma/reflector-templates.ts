// if wiring "EJMZALYXVBWFCRQUONTSPIKHGD"
// request "B" => "J"
// ABCDEFGHIJKLMNOPQRSTUVWXYZ
//  └───────┐
// EJMZALYXVBWFCRQUONTSPIKHGD  <- wiring
//          │
// ABCDEFGHIJKLMNOPQRSTUVWXYZ
type EnigmaReflectorTemplate = {
  name: string
  wiring: string
}

export const ReflectorTemplates: EnigmaReflectorTemplate[] = [
  {
    name: 'UKW-A',
    wiring: 'EJMZALYXVBWFCRQUONTSPIKHGD',
  },
  {
    name: 'UKW-B',
    wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  },
  {
    name: 'UKW-C',
    wiring: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
  },
]
