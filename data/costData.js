// costData.js — All data extracted from Costos integrados.xlsx
// Virginia Transformer Corp — Transformer Material Cost Data

const costData = {

  // ─── Tanks Material Cost ─────────────────────────────────────────────────────
  // Fields: [supplier, program, location, description, cost, source, steelOrigin]
  tanksMaterialCost: [
    // ── E2X — Domestic Non-US ──
    { supplier: 'CORH',                program: 'E2X', location: 'Guanajuato', description: 'A36 Steel', cost: 4.30, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'CORH',                program: 'E2X', location: 'Guanajuato', description: 'SSTL 304',  cost: 6.20, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'CORH',                program: 'E2X', location: 'Guanajuato', description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'E2X', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 3.78, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 6.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'E2X', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 3.50, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 7.00, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 6.92, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'E2X', location: 'Guanajuato', description: 'A36 Steel', cost: 3.60, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'E2X', location: 'Guanajuato', description: 'SSTL 304',  cost: 6.43, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'E2X', location: 'Guanajuato', description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Recubrimientos y Mas',program: 'E2X', location: 'Chihuahua',  description: 'A36 Steel', cost: 3.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Recubrimientos y Mas',program: 'E2X', location: 'Chihuahua',  description: 'SSTL 304',  cost: 6.20, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Recubrimientos y Mas',program: 'E2X', location: 'Chihuahua',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Regger',              program: 'E2X', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 3.30, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Regger',              program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 5.90, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Regger',              program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GERPRESS',            program: 'E2X', location: 'Chihuahua',  description: 'A36 Steel', cost: 3.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GERPRESS',            program: 'E2X', location: 'Chihuahua',  description: 'SSTL 304',  cost: 6.00, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GERPRESS',            program: 'E2X', location: 'Chihuahua',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'H&B MAXXLINE',        program: 'E2X', location: 'Chihuahua',  description: 'A36 Steel', cost: 3.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'H&B MAXXLINE',        program: 'E2X', location: 'Chihuahua',  description: 'SSTL 304',  cost: 6.20, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'H&B MAXXLINE',        program: 'E2X', location: 'Chihuahua',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    // ── E2X — Domestic US ──
    { supplier: 'ACEROS DEL TORO',     program: 'E2X', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 4.20, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ACEROS DEL TORO',     program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 7.60, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ACEROS DEL TORO',     program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 7.52, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'E2X', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 4.08, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 6.78, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'E2X', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'US' },
    // ── E2X — Overseas Non-US ──
    { supplier: 'MPP',                 program: 'E2X', location: 'India',       description: 'A36 Steel', cost: 1.93, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'MPP',                 program: 'E2X', location: 'India',       description: 'SSTL 304',  cost: 7.15, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'MPP',                 program: 'E2X', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'E2X', location: 'China',       description: 'A36 Steel', cost: 1.51, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'E2X', location: 'China',       description: 'SSTL 304',  cost: 3.60, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'E2X', location: 'China',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'E2X', location: 'India',       description: 'A36 Steel', cost: 1.65, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'E2X', location: 'India',       description: 'SSTL 304',  cost: 4.30, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'E2X', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'E2X', location: 'India',       description: 'A36 Steel', cost: 1.52, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'E2X', location: 'India',       description: 'SSTL 304',  cost: 2.27, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'E2X', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Electroauto',         program: 'E2X', location: 'India',       description: 'A36 Steel', cost: 1.47, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Electroauto',         program: 'E2X', location: 'India',       description: 'SSTL 304',  cost: 3.45, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Electroauto',         program: 'E2X', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'E2X', location: 'India',       description: 'A36 Steel', cost: 1.60, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'E2X', location: 'India',       description: 'SSTL 304',  cost: 3.36, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'E2X', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },

    // ── MPU — Domestic Non-US ──
    { supplier: 'CORH',                program: 'MPU', location: 'Guanajuato', description: 'A36 Steel', cost: 4.30, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'CORH',                program: 'MPU', location: 'Guanajuato', description: 'SSTL 304',  cost: 6.20, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'CORH',                program: 'MPU', location: 'Guanajuato', description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'MPU', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 3.78, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 6.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'MPU', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 3.83, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 7.00, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 6.92, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'MPU', location: 'Guanajuato', description: 'A36 Steel', cost: 3.60, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'MPU', location: 'Guanajuato', description: 'SSTL 304',  cost: 6.43, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'MPU', location: 'Guanajuato', description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'HYMSA',               program: 'MPU', location: 'Nuevo Leon',  description: 'A36 Steel', cost: null, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'HYMSA',               program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: null, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'HYMSA',               program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: null, source: 'Domestic', steelOrigin: 'Non-US' },
    // ── MPU — Domestic US ──
    { supplier: 'ACEROS DEL TORO',     program: 'MPU', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 4.33, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ACEROS DEL TORO',     program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 7.00, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ACEROS DEL TORO',     program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 6.92, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'MPU', location: 'Nuevo Leon',  description: 'A36 Steel', cost: 4.08, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 6.78, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'MPU', location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'US' },
    // ── MPU — Overseas Non-US ──
    { supplier: 'MPP',                 program: 'MPU', location: 'India',       description: 'A36 Steel', cost: 1.93, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'MPP',                 program: 'MPU', location: 'India',       description: 'SSTL 304',  cost: 7.15, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'MPP',                 program: 'MPU', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'MPU', location: 'China',       description: 'A36 Steel', cost: 1.51, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'MPU', location: 'China',       description: 'SSTL 304',  cost: 3.60, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'MPU', location: 'China',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'MPU', location: 'India',       description: 'A36 Steel', cost: 1.65, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'MPU', location: 'India',       description: 'SSTL 304',  cost: 4.30, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'MPU', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'MPU', location: 'India',       description: 'A36 Steel', cost: 1.52, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'MPU', location: 'India',       description: 'SSTL 304',  cost: 2.27, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'MPU', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'MPU', location: 'India',       description: 'A36 Steel', cost: 1.60, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'MPU', location: 'India',       description: 'SSTL 304',  cost: 3.36, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'MPU', location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'ARES',                program: 'MPU', location: 'Turquia',     description: 'A36 Steel', cost: 3.06, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'ARES',                program: 'MPU', location: 'Turquia',     description: 'SSTL 304',  cost: 5.40, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'ARES',                program: 'MPU', location: 'Turquia',     description: 'SSTL 316',  cost: 10,   source: 'Overseas', steelOrigin: 'Non-US' },

    // ── P1 — Domestic Non-US ──
    { supplier: 'CORH',                program: 'P1',  location: 'Guanajuato', description: 'A36 Steel', cost: 4.30, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'CORH',                program: 'P1',  location: 'Guanajuato', description: 'SSTL 304',  cost: 6.20, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'CORH',                program: 'P1',  location: 'Guanajuato', description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'P1',  location: 'Nuevo Leon',  description: 'A36 Steel', cost: 3.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 5.90, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ABINSA',              program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'P1',  location: 'Nuevo Leon',  description: 'A36 Steel', cost: 3.83, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 7.00, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'ACEROS DEL TORO',     program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 8.22, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'P1',  location: 'Guanajuato', description: 'A36 Steel', cost: 3.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'P1',  location: 'Guanajuato', description: 'SSTL 304',  cost: 5.90, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'GT Steel',            program: 'P1',  location: 'Guanajuato', description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Ortega',              program: 'P1',  location: 'Chihuahua',  description: 'A36 Steel', cost: 3.82, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Ortega',              program: 'P1',  location: 'Chihuahua',  description: 'SSTL 304',  cost: 6.84, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Ortega',              program: 'P1',  location: 'Chihuahua',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Recubrimientos y Mas',program: 'P1',  location: 'Chihuahua',  description: 'A36 Steel', cost: 3.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Recubrimientos y Mas',program: 'P1',  location: 'Chihuahua',  description: 'SSTL 304',  cost: 6.20, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Recubrimientos y Mas',program: 'P1',  location: 'Chihuahua',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Regger',              program: 'P1',  location: 'Nuevo Leon',  description: 'A36 Steel', cost: 3.80, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Regger',              program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 5.90, source: 'Domestic', steelOrigin: 'Non-US' },
    { supplier: 'Regger',              program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'Non-US' },
    // ── P1 — Domestic US ──
    { supplier: 'ACEROS DEL TORO',     program: 'P1',  location: 'Nuevo Leon',  description: 'A36 Steel', cost: 4.20, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ACEROS DEL TORO',     program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 7.60, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ACEROS DEL TORO',     program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 7.52, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'P1',  location: 'Nuevo Leon',  description: 'A36 Steel', cost: 4.08, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 304',  cost: 6.78, source: 'Domestic', steelOrigin: 'US' },
    { supplier: 'ABINSA',              program: 'P1',  location: 'Nuevo Leon',  description: 'SSTL 316',  cost: 10,   source: 'Domestic', steelOrigin: 'US' },
    // ── P1 — Overseas Non-US ──
    { supplier: 'MPP',                 program: 'P1',  location: 'India',       description: 'A36 Steel', cost: 1.93, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'MPP',                 program: 'P1',  location: 'India',       description: 'SSTL 304',  cost: 7.15, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'MPP',                 program: 'P1',  location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'P1',  location: 'China',       description: 'A36 Steel', cost: 1.51, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'P1',  location: 'China',       description: 'SSTL 304',  cost: 3.60, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Baolian',             program: 'P1',  location: 'China',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'P1',  location: 'India',       description: 'A36 Steel', cost: 1.65, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'P1',  location: 'India',       description: 'SSTL 304',  cost: 4.30, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'New Bharat',          program: 'P1',  location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'P1',  location: 'India',       description: 'A36 Steel', cost: 1.52, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'P1',  location: 'India',       description: 'SSTL 304',  cost: 2.27, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Hi Tech',             program: 'P1',  location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Electroauto',         program: 'P1',  location: 'India',       description: 'A36 Steel', cost: 1.47, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Electroauto',         program: 'P1',  location: 'India',       description: 'SSTL 304',  cost: 3.45, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Electroauto',         program: 'P1',  location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'P1',  location: 'India',       description: 'A36 Steel', cost: 1.60, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'P1',  location: 'India',       description: 'SSTL 304',  cost: 3.36, source: 'Overseas', steelOrigin: 'Non-US' },
    { supplier: 'Krishna',             program: 'P1',  location: 'India',       description: 'SSTL 316',  cost: null, source: 'Overseas', steelOrigin: 'Non-US' },
  ],

  // ─── Core Material Cost ───────────────────────────────────────────────────────
  coreMaterialCost: [
    // Grade HO-DR
    { supplier: 'JFE',             type: 'Domestic', steelOrigin: 'Non-US', grade: 'HO-DR', priceMitter: 2.07, cuttingCostSupplier: null, freightCost: null,   totalCostMitter: 2.07,   priceSlit: 1.77,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.86,   totalCostSlitOutplant: 2.2551 },
    { supplier: 'VENAMECA',        type: 'Domestic', steelOrigin: 'Non-US', grade: 'HO-DR', priceMitter: 1.90, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 1.96,   priceSlit: 1.90,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 2.05,   totalCostSlitOutplant: 2.4451 },
    { supplier: 'AMOD',            type: 'Overseas', steelOrigin: 'Non-US', grade: 'HO-DR', priceMitter: 2.07, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 2.13,   priceSlit: null,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: null,   totalCostSlitOutplant: null },
    { supplier: 'LTC',             type: 'Domestic', steelOrigin: 'Non-US', grade: 'HO-DR', priceMitter: null, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 2.34,   priceSlit: 2.28,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 2.43,   totalCostSlitOutplant: 2.8251 },
    { supplier: 'NUCLEOS AVE',     type: 'Domestic', steelOrigin: 'Non-US', grade: 'HO-DR', priceMitter: 1.90, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 1.90,   priceSlit: 1.90,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 2.05,   totalCostSlitOutplant: 2.4451 },
    { supplier: 'CLEVELAND CLIFFS',type: 'Domestic', steelOrigin: 'US',     grade: 'HO-DR', priceMitter: null, cuttingCostSupplier: 0.33, freightCost: 0.30,   totalCostMitter: null,   priceSlit: 2.508, costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 2.898,  totalCostSlitOutplant: 3.2931 },
    // Grade M3
    { supplier: 'JFE',             type: 'Domestic', steelOrigin: 'Non-US', grade: 'M3',    priceMitter: 2.00, cuttingCostSupplier: null, freightCost: null,   totalCostMitter: 2.00,   priceSlit: 1.79,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.88,   totalCostSlitOutplant: 2.2751 },
    { supplier: 'CLEVELAND CLIFFS',type: 'Domestic', steelOrigin: 'US',     grade: 'M3',    priceMitter: null, cuttingCostSupplier: 0.33, freightCost: 0.30,   totalCostMitter: null,   priceSlit: 2.010, costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 2.40,   totalCostSlitOutplant: 2.7951 },
    // Grade M4
    { supplier: 'JFE',             type: 'Domestic', steelOrigin: 'Non-US', grade: 'M4',    priceMitter: 1.79, cuttingCostSupplier: null, freightCost: null,   totalCostMitter: 1.79,   priceSlit: 1.57,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.66,   totalCostSlitOutplant: 2.0551 },
    { supplier: 'VENAMECA',        type: 'Domestic', steelOrigin: 'Non-US', grade: 'M4',    priceMitter: 1.65, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 1.71,   priceSlit: 1.65,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.80,   totalCostSlitOutplant: 2.1951 },
    { supplier: 'NUCLEOS AVE',     type: 'Domestic', steelOrigin: 'Non-US', grade: 'M4',    priceMitter: 1.65, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 1.65,   priceSlit: 1.65,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.80,   totalCostSlitOutplant: 2.1951 },
    // Grade M5
    { supplier: 'JFE',             type: 'Domestic', steelOrigin: 'Non-US', grade: 'M5',    priceMitter: 1.43, cuttingCostSupplier: null, freightCost: null,   totalCostMitter: 1.43,   priceSlit: 1.65,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.74,   totalCostSlitOutplant: 2.1351 },
    { supplier: 'AMOD',            type: 'Overseas', steelOrigin: 'Non-US', grade: 'M5',    priceMitter: 1.61, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 1.67,   priceSlit: null,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: null,   totalCostSlitOutplant: null },
    { supplier: 'LTC',             type: 'Domestic', steelOrigin: 'Non-US', grade: 'M5',    priceMitter: null, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 1.66,   priceSlit: 1.60,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.75,   totalCostSlitOutplant: 2.1451 },
    { supplier: 'NUCLEOS AVE',     type: 'Domestic', steelOrigin: 'Non-US', grade: 'M5',    priceMitter: 1.59, cuttingCostSupplier: null, freightCost: 0.06,   totalCostMitter: 1.59,   priceSlit: 1.59,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.74,   totalCostSlitOutplant: 2.1351 },
    // Grade M6
    { supplier: 'JFE',             type: 'Domestic', steelOrigin: 'Non-US', grade: 'M6',    priceMitter: 2.01, cuttingCostSupplier: null, freightCost: null,   totalCostMitter: 2.01,   priceSlit: 1.79,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 1.88,   totalCostSlitOutplant: 2.2751 },
    { supplier: 'CLEVELAND CLIFFS',type: 'Domestic', steelOrigin: 'US',     grade: 'M6',    priceMitter: null, cuttingCostSupplier: 0.33, freightCost: 0.30,   totalCostMitter: null,   priceSlit: 2.06,  costCutInHouse: 0.09, outplantCost: 0.4851, totalCostSlitInHouse: 2.45,   totalCostSlitOutplant: 2.8451 },
  ],

  // ─── Tank Logistics ───────────────────────────────────────────────────────────
  tankLogistics: [
    // MPU Overseas
    { concept: 'Supplier to port',       amount: 7153.79,  source: 'Overseas', program: 'MPU' },
    { concept: 'Overseas freight',       amount: 21290.06, source: 'Overseas', program: 'MPU' },
    { concept: 'India/China customs',    amount: 2830.52,  source: 'Overseas', program: 'MPU' },
    { concept: 'Unloading - other costs',amount: 4132.15,  source: 'Overseas', program: 'MPU' },
    { concept: 'Customs clearance US',   amount: 100.92,   source: 'Overseas', program: 'MPU' },
    { concept: 'US freight cost',        amount: 11447.00, source: 'Overseas', program: 'MPU' },
    { concept: 'Handling at ELP',        amount: 4000.00,  source: 'Overseas', program: 'MPU' },
    { concept: 'Transport ELP - CUU',    amount: 3600.00,  source: 'Overseas', program: 'MPU' },
    // MPU Domestic
    { concept: 'Domestic freight cost',  amount: 5882.00,  source: 'Domestic', program: 'MPU' },
    // E2X Domestic
    { concept: 'Domestic freight cost',  amount: 932.35,   source: 'Domestic', program: 'E2X' },
    // E2X Overseas
    { concept: 'Supplier to port',       amount: null,     source: 'Overseas', program: 'E2X' },
    { concept: 'Overseas freight',       amount: 3075.00,  source: 'Overseas', program: 'E2X' },
    { concept: 'India/China customs',    amount: null,     source: 'Overseas', program: 'E2X' },
    { concept: 'Unloading - other costs',amount: null,     source: 'Overseas', program: 'E2X' },
    { concept: 'Customs clearance US',   amount: 100.92,   source: 'Overseas', program: 'E2X' },
    { concept: 'US freight cost',        amount: 2326.44,  source: 'Overseas', program: 'E2X' },
    { concept: 'Handling at ELP',        amount: 227.70,   source: 'Overseas', program: 'E2X' },
    { concept: 'Transport ELP - CUU',    amount: 900.00,   source: 'Overseas', program: 'E2X' },
    // P1 Domestic
    { concept: 'Domestic freight cost',  amount: 932.35,   source: 'Domestic', program: 'P1' },
    // P1 Overseas
    { concept: 'Supplier to port',       amount: 1234.00,  source: 'Overseas', program: 'P1' },
    { concept: 'Overseas freight',       amount: 4428.97,  source: 'Overseas', program: 'P1' },
    { concept: 'India/China customs',    amount: 568.06,   source: 'Overseas', program: 'P1' },
    { concept: 'Unloading - other costs',amount: 794.55,   source: 'Overseas', program: 'P1' },
    { concept: 'Customs clearance US',   amount: 100.92,   source: 'Overseas', program: 'P1' },
    { concept: 'US freight cost',        amount: 416.13,   source: 'Overseas', program: 'P1' },
    { concept: 'Handling at ELP',        amount: 227.70,   source: 'Overseas', program: 'P1' },
    { concept: 'Transport ELP - CUU',    amount: 900.00,   source: 'Overseas', program: 'P1' },
  ],

  // ─── Tanks BOM (lbs per program) ─────────────────────────────────────────────
  tanksBOM: {
    E2X: { A36: 3171,  SSTL304: 84 },
    MPU: { A36: 20984, SSTL304: 413 },
    P1:  { A36: 4922,  SSTL304: 141 },
  },

  // ─── Core BOM (lbs per program) ──────────────────────────────────────────────
  coreBOM: {
    E2X: 7320,
    MPU: 52346,
    P1:  8358,
  },

  // ─── Annual Demand & Tariffs ──────────────────────────────────────────────────
  annualDemand: {
    E2X: { weeklyDemand: 30,   demand2027: 1500,   avgBOMCost: 60270.35,    bomCostPlus50: 90405.525,      originalTariff: 22601.38,  reducedTariff10: 9040.55   },
    MPU: { weeklyDemand: 3.5,  demand2027: 180.25, avgBOMCost: 701064.80,   bomCostPlus50: 1051597.20,     originalTariff: 157739.58, reducedTariff10: 105159.72 },
    P1:  { weeklyDemand: 11,   demand2027: 550,    avgBOMCost: 84603.07,    bomCostPlus50: 126904.61,      originalTariff: 31726.15,  reducedTariff10: 12690.46  },
  },
};

module.exports = { costData };
