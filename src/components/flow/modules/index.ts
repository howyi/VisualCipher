import { InputModule } from '@/components/flow/modules/input'
import { OutputModule } from '@/components/flow/modules/output'
import { SuffixModule } from '@/components/flow/modules/suffix'
import { PrefixModule } from '@/components/flow/modules/prefix'
import { CaesarModule } from '@/components/flow/modules/caesar'
import { VigenereModule } from '@/components/flow/modules/vigenere'
import { CharacterCounterModule } from '@/components/flow/modules/character-counter'
import { WordCounterModule } from '@/components/flow/modules/word-counter'
import { EnigmaScramblerInterfaceModule } from '@/components/flow/modules/enigma-scrambler-interface'
import { EnigmaReflectorModule } from '@/components/flow/modules/enigma-reflector'
import { EnigmaScramblerModule } from '@/components/flow/modules/enigma-scrambler'
import { EnigmaPlugBoardModule } from '@/components/flow/modules/enigma-plugboard'
import { EnigmaEntryWheelModule } from '@/components/flow/modules/enigma-entry-wheel'
import { SimpleSubstitutionModule } from '@/components/flow/modules/simple-substitution'
import { CompareOutputModule } from '@/components/flow/modules/compare-output'
import { ToUpperCaseModule } from '@/components/flow/modules/to-upper-case'
import { ReplaceModule } from '@/components/flow/modules/replace'
import { RailFenceCipherModule } from '@/components/flow/modules/rail-fence-cipher'
import { Module } from '@/components/flow/modules/types'

export const RegisteredModules = [
  InputModule,
  OutputModule,
  CompareOutputModule,
  PrefixModule,
  SuffixModule,
  CaesarModule,
  SimpleSubstitutionModule,
  RailFenceCipherModule,
  VigenereModule,
  CharacterCounterModule,
  WordCounterModule,
  ToUpperCaseModule,
  ReplaceModule,
  EnigmaPlugBoardModule,
  EnigmaEntryWheelModule,
  EnigmaScramblerModule,
  EnigmaScramblerInterfaceModule,
  EnigmaReflectorModule,
].reduce(
  (acc, m) => {
    if (acc[m.type]) {
      throw Error('module node type conflict: ' + m.type)
    }
    acc[m.type] = m
    return acc
  },
  {} as { [type in string]: Module }
)
