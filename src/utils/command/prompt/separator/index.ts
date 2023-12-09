import pc from 'picocolors';
import { Separator } from '@inquirer/prompts';

const separator = (str: string = '────────────────────────────'): Separator => new Separator(pc.dim(str));

export default separator;
