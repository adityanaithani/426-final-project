<script>
  import UploadComponent from "./UploadComponent.svelte";
  import DnaComponent from "./DnaComponent.svelte";
  import SequenceDisplayComponent from "./SequenceDisplayComponent.svelte";
  import ChartComponent from "./ChartComponent.svelte";
</script>

<div class="container">
  <h1>Upload File</h1>
  <UploadComponent />

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
