import { Enigma } from '@/components/flow/guides/enigma'
import { Vigenere } from '@/components/flow/guides/vigenere'
import { Caesar } from '@/components/flow/guides/caesar'
import { Guide } from '@/components/flow/guides/types'
import { Rail } from '@/components/flow/guides/rail'

export const RegisteredGuides: Guide[] = [Rail, Caesar, Vigenere, Enigma]
