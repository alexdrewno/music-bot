import { Command } from './command'
import { Play } from './commands/play'
import { Clear } from './commands/clear'
import { Stop } from './commands/stop'
import { Skip } from './commands/skip'

export const Commands: Command[] = [Play, Skip, Clear, Stop]
