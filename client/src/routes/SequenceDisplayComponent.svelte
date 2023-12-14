<script>
  import { onMount } from "svelte";
  import { SequenceStore, AnalysisStore } from "./stores.js";

  let sequences = {};
  let sequenceText = '';

  onMount(async () => {
    const res = await fetch("http://localhost:4000/sequences");
    sequences = await res.json();
    SequenceStore.set(sequences);
    
    SequenceStore.subscribe((_sequences) => {
    sequences = _sequences;
    sequenceText = Object.values(sequences).map(seq => seq.sequence).join('\n');
  });
  });



  // send all sequences to dna server for analysis
  const analyzeSequences = async (event) => {
    console.log(JSON.stringify({ sequences }));
    event.preventDefault();

    const res = await fetch("http://localhost:4001/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sequences }),
    });

    const data = await res.json();
    console.log(`Client: ${JSON.stringify(data)}`);
    AnalysisStore.set(data);

    // erase sequences from store
    // sequenceText = '';
    // sequences = {};
    // SequenceStore.set({sequences});
  };

</script>

<!-- display sequences from store in textarea here -->
<form on:submit={analyzeSequences}>
  <textarea
    readonly
    id="seq_staging"
    rows="10"
    cols="40"
    placeholder="Add sequences above"
    bind:value={sequenceText}
  ></textarea>
<button type="submit">Analyze</button>
</form>