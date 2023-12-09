// translate to RNA
export async function translateToRNA(dna) {
  return dna.replace(/T/g, "U");
}

// reverse complement
export async function reverseComplement(dna) {
  const complement = { A: "T", C: "G", G: "C", T: "A" };
  return dna
    .split("")
    .reverse()
    .map((nucleotide) => complement[nucleotide])
    .join("");
}

// gc content calculation
export async function gcContent(dna) {
  const gc = dna.match(/[GC]/g).length;
  const at = dna.match(/[AT]/g).length;
  return (gc / (gc + at)) * 100;
}

// nucleotide counts
export async function nucleotideCounts(dna) {
  const counts = { A: 0, C: 0, G: 0, T: 0 };
  dna.split("").forEach((nucleotide) => counts[nucleotide]++);
  return counts;
}

// nucleotide frequency
export async function nucleotideFrequency(dna) {
  const counts = await nucleotideCounts(dna);
  const total = dna.length;
  return Object.keys(counts).reduce((acc, nucleotide) => {
    acc[nucleotide] = counts[nucleotide] / total;
    return acc;
  }, {});
}
