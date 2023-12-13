<script>
  import { SequenceStore } from "./stores.js";

  let sequence = '';

  const newSequence = async (event) => {
    event.preventDefault();

    const res = await fetch('http://localhost:4000/sequences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sequence })
    });

    const data = await res.json();
    sequence = '';
    console.log(`Client: ${JSON.stringify(data)}`);
    SequenceStore.update((sequences) => {
      return { ...sequences, [data.id]: data };
    });
    };
</script>

<div>
  <form on:submit={newSequence}>
    <input type='text' size="47" bind:value={sequence} class="form-control"/>
    <button type="submit">Add Sequence</button>
  </form>
</div>
