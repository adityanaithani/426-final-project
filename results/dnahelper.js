// validate dna middleware
const validDna = /^[ATCG]+$/;

function validateDNA(req, res, next) {
  const { dna } = req.body;

  if (!validDna.test(dna)) {
    return res.status(400).json({
      error:
        'Invalid DNA sequence. Provide a sequence containing only A, T, C, G.',
    });
  }

  next();
}

// translate to RNA
function translateToRNA(dna) {
  return dna.replace(/T/g, 'U');
}

// reverse complement
function reverseComplement(dna) {
  const complement = { A: 'T', C: 'G', G: 'C', T: 'A' };
  return dna
    .split('')
    .reverse()
    .map((nucleotide) => complement[nucleotide])
    .join('');
}

// gc content calculation
function gcContent(dna) {
  const gc = (dna.match(/[GC]/g) || []).length;
  const at = (dna.match(/[AT]/g) || []).length;

  if (gc + at === 0) {
    return 0;
  }

  const gcContent = (gc / (gc + at)) * 100;
  const rounded = Math.round(gcContent * 100) / 100;
  return rounded;
}

// nucleotide counts
function nucleotideCounts(dna) {
  const counts = { A: 0, C: 0, G: 0, T: 0 };
  dna.split('').forEach((nucleotide) => counts[nucleotide]++);
  return counts;
}

// nucleotide frequency
function nucleotideFrequency(dna) {
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
