<script>
  import AddComponent from "./AddComponent.svelte";
  import AnalysisComponent from "./AnalysisComponent.svelte";
  import SequenceDisplayComponent from "./SequenceDisplayComponent.svelte";
  import ResultsComponent from "./ResultsComponent.svelte";
</script>

<h1>Genome Analytics</h1>
<div class="container">
  <h2>Add Sequence</h2>
  <AddComponent />

  <hr />
  <h2>Your Sequences</h2>
  <SequenceDisplayComponent />

  <hr />
  <h2>Sequence Analysis</h2>
  <AnalysisComponent />

  <hr />
  <h2>Whole Genome Analysis</h2>
  <ResultsComponent />
</div>
