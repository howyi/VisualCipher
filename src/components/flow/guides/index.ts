import { Enigma } from '@/components/flow/guides/enigma'
import { Vigenere } from '@/components/flow/guides/vigenere'
import { Caesar } from '@/components/flow/guides/caesar'
import { Guide } from '@/components/flow/guides/types'

export const RegisteredGuides: Guide[] = [ 
  Caesar,
  Vigenere,
  Enigma,
]
