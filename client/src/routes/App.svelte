<script>
  import AddComponent from "./AddComponent.svelte";
  import DnaComponent from "./DnaComponent.svelte";
  import SequenceDisplayComponent from "./SequenceDisplayComponent.svelte";
  import ChartComponent from "./ChartComponent.svelte";
</script>

<div class="container">
  <h1>Add Sequence</h1>
  <AddComponent />

  <hr />
  <h1>Your Sequences</h1>
  <SequenceDisplayComponent />

  <hr />
  <h1>Analysis</h1>
  <DnaComponent />

  <hr />
  <h1>Charts</h1>
  <ChartComponent />
</div>
