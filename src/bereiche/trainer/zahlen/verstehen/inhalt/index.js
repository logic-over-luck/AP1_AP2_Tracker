// Erklärung und Ausprobieren je Lektion, gesammelt aus den Block-Dateien: { [lektionId]: { Erklaerung, Ausprobieren } }

import { ZAHLENSYSTEME } from './zahlensysteme.jsx';
import { DATENMENGEN } from './datenmengen.jsx';
import { BITS } from './bits.jsx';
import { STROM } from './strom.jsx';

export const INHALT = { ...ZAHLENSYSTEME, ...DATENMENGEN, ...BITS, ...STROM };
