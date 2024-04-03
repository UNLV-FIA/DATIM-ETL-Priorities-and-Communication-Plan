function RetrieveLoadedDataAsync() {
    // const baseAddress = "http://localhost:50452/"; // for local testing
    const baseAddress = "https://apps.fs.usda.gov/datim/";
    const targetEndpoint = "endPoints/atim/RetrieveLoadedData.ashx";
    let fullTargetEndpoint = baseAddress + targetEndpoint;
    
    $.post(fullTargetEndpoint, null, (result) => {
        // Skip failed retrievals
        if (!result.Success)
            return;

        let cellStates = document.querySelectorAll(".stateCell");
        for (let cellState of cellStates) {
            // Retrieve associated state data
            let rowStateName = cellState.innerHTML;
            let associatedStateData = result.StateData.filter(i => { return i.Name == rowStateName})[0];

            // Retrieve associate state cells
            let cellInventoryYears = $(cellState).siblings(".rangeCell")[0];
            let cellLoadDate = $(cellState).siblings(".loadCell")[0];
            let cellEvaluations = $(cellState).siblings(".evaluationsCell")[0];
            let cellEvaluationList = $(cellEvaluations).find("ol")[0];

            // Apply state data to cells
            if (associatedStateData) {
                cellInventoryYears.innerHTML = `${associatedStateData.InventoryYearBegin}-${associatedStateData.InventoryYearEnd}`;
                cellLoadDate.innerHTML = associatedStateData.LoadDate;
                cellEvaluationList.innerHTML = "";
                for (let evaluation of associatedStateData.EvaluationGroupDescriptions) {
                    let evaluationSplit = evaluation.split(":");
                    cellEvaluationList.innerHTML += `<li><b>${evaluationSplit[0]}:</b>${evaluationSplit[1]}</li>`;
                }
            }
        }

    });
}
