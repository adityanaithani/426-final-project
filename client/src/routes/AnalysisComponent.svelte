<script>
  import { onMount } from "svelte";
  import { buttonClicked, AnalysisStore } from "./stores";

  let analyzed = {};

  const formatObject = (obj) => {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    // return obj;
  };

  onMount(async () => {
    const res = await fetch("http://localhost:4001/analyze");
    analyzed = await res.json();
    AnalysisStore.set(analyzed);
  });

  let rna = "";
  let rev = "";
  let gc = "";
  let ncount = "";
  let nfreq = "";

  AnalysisStore.subscribe((_analyzed) => {
    analyzed = _analyzed;
  });

  $: {
    const analyzedArray = Object.values(analyzed);
    console.log(analyzedArray);
    rna = analyzedArray.map(obj => obj.rna).join('\n');
    rev = analyzedArray.map(obj => obj.reverse).join('\n');
    gc = analyzedArray.map(obj => obj.gc).join('\n');
    if (ncount !== undefined) {
      ncount = analyzedArray.map(obj => formatObject(obj.counts)).join('\n');
    }
    if (nfreq !== undefined) {
      nfreq = analyzedArray.map(obj => formatObject(obj.frequency)).join('\n');
    }
  }

  async function handleClick() {
    const res = await fetch("http://localhost:4002/compute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analyzed),
    });
    const data = await res.json();
    console.log(data);
    buttonClicked.set(true);
  }

</script>


<h3>RNA</h3>
<textarea
  readonly
  id="rna-analysis"
  rows="4"
  cols="40"
  bind:value={rna}
></textarea>
<h3>Reverse Complement</h3>
<textarea
  readonly
  id="rev-analysis"
  rows="4"
  cols="40"
  bind:value={rev}
></textarea>
<h3>GC Content</h3>
<textarea
  readonly
  id="gc-analysis"
  rows="4"
  cols="40"
  bind:value={gc}
></textarea>
<h3>Nucleotide Counts</h3>
<textarea
  readonly
  id="ncount-analysis"
  rows="10"
  cols="40"
  bind:value={ncount}
></textarea>
<h3>Nucleotide Frequencies</h3>
<textarea
  readonly
  id="nfreq-analysis"
  rows="10"
  cols="100"
  bind:value={nfreq}
></textarea>

<button on:click={handleClick}>Add to Genome</button>