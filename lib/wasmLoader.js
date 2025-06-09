// lib/wasmLoader.js
export async function loadWasmConverter() {
    const imports = {
        env: {
            memory: new WebAssembly.Memory({ initial: 256 }),
            table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
        }
    };

    const { instance } = await WebAssembly.instantiateStreaming(
        fetch('/wasm/code_converter.wasm'),
        imports
    );

    return {
        convert: (codePtr, langFrom, langTo) => {
            const encoder = new TextEncoder();
            const encoded = encoder.encode(code);
            const memory = new Uint8Array(instance.exports.memory.buffer);

            // Copy code to WASM memory
            memory.set(encoded, codePtr);

            // Call WASM function
            const outputPtr = instance.exports.convert(codePtr, encoded.length, langFrom, langTo);

            // Read result from memory
            return new TextDecoder().decode(
                memory.slice(outputPtr, outputPtr + instance.exports.get_output_length())
            );
        }
    };
}
