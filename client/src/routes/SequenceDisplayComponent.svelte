<script>
  import { onMount } from "svelte";
  import { SequenceStore } from "./stores.js";

  let sequences = {};

  onMount(async () => {
    const res = await fetch("http://localhost:4000/sequences");
    sequences = await res.json();
    SequenceStore.set(sequences);
  });

  let sequenceText = '';
  SequenceStore.subscribe((_sequences) => {
    sequences = _sequences;
    sequenceText = Object.values(sequences).map(seq => seq.sequence).join('\n');
  });

  // function to send all sequences to server for analysis
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
    sequences = {};
    console.log(`Client: ${JSON.stringify(data)}`);

    SequenceStore.set(sequences);
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

<button>Drop Sequences</button>