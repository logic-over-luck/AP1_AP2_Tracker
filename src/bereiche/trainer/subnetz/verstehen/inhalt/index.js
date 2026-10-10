// Erklärung und Ausprobieren je Lektion, gesammelt aus den Block-Dateien: { [lektionId]: { Erklaerung, Ausprobieren } }

import { ADRESSE } from './adresse.jsx';
import { SUBNETTING } from './subnetting.jsx';
import { KONFIGURATION } from './konfiguration.jsx';
import { LOKAL } from './lokal.jsx';
import { IPV6 } from './ipv6.jsx';

export const INHALT = { ...ADRESSE, ...SUBNETTING, ...KONFIGURATION, ...LOKAL, ...IPV6 };
