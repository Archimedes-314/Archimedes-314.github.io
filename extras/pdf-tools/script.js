let pyodide;

async function initPyodide() {
    try {
        pyodide = await loadPyodide();
        await pyodide.loadPackage(["micropip"]);
        const micropip = pyodide.pyimport("micropip");
        await micropip.install("pypdf");
        await micropip.install("Pillow");

        const response = await fetch("logic.py");
        const pythonCode = await response.text();
        await pyodide.runPythonAsync(pythonCode);

        document.getElementById("status").innerText = "Python Ready!";
        document.getElementById("merge-btn").disabled = false;
        document.getElementById("compress-btn").disabled = false;
    } catch (err) {
        document.getElementById("status").innerText = "Error loading Python: " + err;
    }
}

initPyodide();

async function runMerge() {
    const files = document.getElementById("merge-input").files;
    if (files.length < 2) return alert("Please select at least 2 files.");

    const fileBuffers = [];
    for (let file of files) {
        fileBuffers.push(new Uint8Array(await file.arrayBuffer()));
    }

    pyodide.globals.set("js_files", fileBuffers);
    const resultProxy = await pyodide.runPythonAsync(`merge_pdfs(js_files.to_py())`);
    
    const pdfData = resultProxy.toJs(); 
    downloadBlob(pdfData, "merged.pdf");
    
    resultProxy.destroy();
}

async function runCompress() {
    const file = document.getElementById("compress-input").files[0];
    if (!file) return alert("Please select a file.");

    const buffer = new Uint8Array(await file.arrayBuffer());
    pyodide.globals.set("js_buffer", buffer);
    const resultProxy = await pyodide.runPythonAsync(`compress_pdf_bridge(js_buffer.to_py())`);

    const pdfData = resultProxy.toJs();
    downloadBlob(pdfData, "compressed.pdf");
    
    resultProxy.destroy();
}

function downloadBlob(data, fileName) {
    const blob = new Blob([data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}