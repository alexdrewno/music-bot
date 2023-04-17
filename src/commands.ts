import { Command } from './command'
import { Hello } from './commands/hello'
import { Play, Skip } from './commands/play'

export const Commands: Command[] = [Hello, Play, Skip]
