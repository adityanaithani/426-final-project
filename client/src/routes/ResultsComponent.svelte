<script>
    import { buttonClicked, SequenceStore, AnalysisStore, ResultsStore } from "./stores";

    let results = {};

    const formatObject = (obj) => {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    };

    const nuclearReset = async (event) => {
        SequenceStore.set({});
        const seqDelete = await fetch("http://localhost:4000/sequences", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const seqDeleteData = await seqDelete.json();
        AnalysisStore.set({});
        const analysisDelete = await fetch("http://localhost:4001/analyze", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const analysisDeleteData = await analysisDelete.json();
        ResultsStore.set({});
        const resultsDelete = await fetch("http://localhost:4002/results", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const resultsDeleteData = await resultsDelete.json();
    };

    const displayAnalysis = async (event) => {

        const res = await fetch("http://localhost:4002/results");
        const data = await res.json();
        if(data) {
            console.log("Data exists");
        }
        console.log(data);
        results = data;
        console.log(`Client: ${JSON.stringify(results)}`);
        ResultsStore.set(results);

        if (data.ok) {
            buttonClicked.set(false);
            const del = await fetch("http://localhost:4002/results", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const delData = await del.json();
        }
    };

    let genome = "";
    let rna = "";
    let rev = "";
    let gc = "";
    let ncount = "";
    let nfreq = "";
    
    buttonClicked.subscribe((clicked) => {
        if (clicked) {
            console.log("Button clicked");
            displayAnalysis();
            buttonClicked.set(false);
        }
    });
    
    ResultsStore.subscribe((_results) => {
        results = _results;
    });

    $: {
        const resultsArray = Object.values(results);
        console.log(resultsArray);
        genome = resultsArray[0];
        rna = resultsArray[1];
        rev = resultsArray[2];
        gc = resultsArray[3];
        ncount = resultsArray[4];
        if (ncount !== undefined) {
        ncount = formatObject(ncount);
        }
        nfreq = resultsArray[5];
        if (nfreq !== undefined) {
            nfreq = formatObject(nfreq);
        }
    }

</script>


<h3>Full Genome</h3>
<textarea
  readonly
  id="genome-analysis"
  rows="4"
  cols="40"
  bind:value={genome}
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
<h3>Nucelotide Counts</h3>
<textarea
  readonly
  id="ncount-analysis"
  rows="10"
  cols="40"
  bind:value={ncount}
></textarea>
<h3>Nucelotide Frequency</h3>
<textarea
  readonly
  id="nfreq-analysis"
  rows="10"
  cols="100"
  bind:value={nfreq}
></textarea>

<button on:click={nuclearReset}>Drop All Sequences In Genome</button>