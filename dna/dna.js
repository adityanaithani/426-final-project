import log from "./index.js";

// validate dna middleware
const validDna = /^[ATCG]+$/;

export function validateDNA(req, res, next) {
  const { dna } = req.body;

  if (!validDna.test(dna)) {
    log.error(`Invalid DNA sequence: ${dna}`);
    return res.status(400).json({
      error:
        "Invalid DNA sequence. Provide a sequence containing only A, T, C, G.",
    });
  }

  next();
}

// translate to RNA
export function translateToRNA(dna) {
  log.info(`Translating ${dna} to RNA`);
  return dna.replace(/T/g, "U");
}

// reverse complement
export function reverseComplement(dna) {
  log.info(`Calculating reverse complement of ${dna}`);
  const complement = { A: "T", C: "G", G: "C", T: "A" };
  return dna
    .split("")
    .reverse()
    .map((nucleotide) => complement[nucleotide])
    .join("");
}

// gc content calculation
export function gcContent(dna) {
  log.info(`Calculating GC content of ${dna}`);
  const gc = (dna.match(/[GC]/g) || []).length;
  const at = (dna.match(/[AT]/g) || []).length;

  if (gc + at === 0) {
    log.info(`GC content of ${dna} is 0`);
    return 0;
  }

  return (gc / (gc + at)) * 100;
}

// nucleotide counts
export function nucleotideCounts(dna) {
  log.info(`Calculating nucleotide counts of ${dna}`);
  const counts = { A: 0, C: 0, G: 0, T: 0 };
  dna.split("").forEach((nucleotide) => counts[nucleotide]++);
  return counts;
}

// nucleotide frequency
export function nucleotideFrequency(dna) {
  log.info(`Calculating nucleotide frequency of ${dna}`);
  const counts = nucleotideCounts(dna);
  const total = dna.length;
  return Object.keys(counts).reduce((acc, nucleotide) => {
    acc[nucleotide] = counts[nucleotide] / total;
    return acc;
  }, {});
}
