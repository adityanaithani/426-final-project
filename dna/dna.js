// validate dna middleware
const validDna = /^[ATCG]+$/;

export function validateDNA(req, res, next) {
  const { dna } = req.body;

  if (!validDna.test(dna)) {
    return res.status(400).json({
      error:
        "Invalid DNA sequence. Provide a sequence containing only A, T, C, G.",
    });
  }

  next();
}

// translate to RNA
export function translateToRNA(dna) {
  console.log(dna);
  return dna.replace(/T/g, "U");
}

// reverse complement
export function reverseComplement(dna) {
  const complement = { A: "T", C: "G", G: "C", T: "A" };
  return dna
    .split("")
    .reverse()
    .map((nucleotide) => complement[nucleotide])
    .join("");
}

// gc content calculation
export function gcContent(dna) {
  const gc = (dna.match(/[GC]/g) || []).length;
  const at = (dna.match(/[AT]/g) || []).length;

  if (gc + at === 0) {
    return 0;
  }

  return (gc / (gc + at)) * 100;
}

// nucleotide counts
export function nucleotideCounts(dna) {
  const counts = { A: 0, C: 0, G: 0, T: 0 };
  dna.split("").forEach((nucleotide) => counts[nucleotide]++);
  return counts;
}

// nucleotide frequency
export function nucleotideFrequency(dna) {
  const counts = nucleotideCounts(dna);
  const total = dna.length;
  return Object.keys(counts).reduce((acc, nucleotide) => {
    acc[nucleotide] = counts[nucleotide] / total;
    return acc;
  }, {});
}
