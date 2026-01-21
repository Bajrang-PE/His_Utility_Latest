// printWorker.js
self.onmessage = async(e)=> {
  const { multipleTables, widgetLimit, safeLimit } = e.data;

 const processed = multipleTables.map(t => ({
    columns: t.columns
      .filter(c => c.name !== "Action" && c.name !== "pkcolumn")
      .map(c => ({
        ...c,
        render: undefined,  
        Cell: undefined,    
      })),
    data: widgetLimit ? t.data.slice(0, widgetLimit) :
          safeLimit   ? t.data.slice(0, safeLimit)   : t.data
  }));


  self.postMessage(processed);
};
