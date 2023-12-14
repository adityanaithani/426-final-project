import log from './index.js';

// validate dna middleware
const validDna = /^[ATCG]+$/;

function validateDNA(req, res, next) {
  const { dna } = req.body;

  if (!validDna.test(dna)) {
    log.error(`Invalid DNA sequence: ${dna}`);
    return res.status(400).json({
      error:
        'Invalid DNA sequence. Provide a sequence containing only A, T, C, G.',
    });
  }

  next();
}

// translate to RNA
function translateToRNA(dna) {
  log.info(`Translating ${dna} to RNA`);
  return dna.replace(/T/g, 'U');
}

// reverse complement
function reverseComplement(dna) {
  log.info(`Calculating reverse complement of ${dna}`);
  const complement = { A: 'T', C: 'G', G: 'C', T: 'A' };
  return dna
    .split('')
    .reverse()
    .map((nucleotide) => complement[nucleotide])
    .join('');
}

// gc content calculation
function gcContent(dna) {
  log.info(`Calculating GC content of ${dna}`);
  const gc = (dna.match(/[GC]/g) || []).length;
  const at = (dna.match(/[AT]/g) || []).length;

  if (gc + at === 0) {
    log.info(`GC content of ${dna} is 0`);
    return 0;
  }

  const gcContent = (gc / (gc + at)) * 100;
  const rounded = Math.round(gcContent * 100) / 100;
  return rounded;
}

// nucleotide counts
function nucleotideCounts(dna) {
  log.info(`Calculating nucleotide counts of ${dna}`);
  const counts = { A: 0, C: 0, G: 0, T: 0 };
  dna.split('').forEach((nucleotide) => counts[nucleotide]++);
  return counts;
}

// nucleotide frequency
function nucleotideFrequency(dna) {
  log.info(`Calculating nucleotide frequency of ${dna}`);
  const counts = nucleotideCounts(dna);
  const total = dna.length;
  return Object.keys(counts).reduce((acc, nucleotide) => {
    acc[nucleotide] = counts[nucleotide] / total;
    return acc;
  }, {});
}

export default {
  validateDNA,
  translateToRNA,
  reverseComplement,
  gcContent,
  nucleotideCounts,
  nucleotideFrequency,
};
