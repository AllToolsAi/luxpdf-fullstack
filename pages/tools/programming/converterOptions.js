// pages/tools/programming/converterOptions.js

const converterOptions = [
    {
        label: 'JavaScript to TypeScript',
        value: 'js-to-ts',
    },
    {
        label: 'TypeScript to JavaScript',
        value: 'ts-to-js',
    },
    {
        label: 'JS Object to JSON',
        value: 'jsobj-to-json',
    },
    {
        label: 'JSON to JS Object',
        value: 'json-to-jsobj',
    },
];

function convert(input, type) {
    try {
        switch (type) {
            case 'js-to-ts':
                return input.replace(/: any/g, ''); // very naive example
            case 'ts-to-js':
                return input.replace(/:\s*\w+/g, ''); // remove type annotations
            case 'jsobj-to-json':
                // eslint-disable-next-line no-eval
                return JSON.stringify(eval('(' + input + ')'), null, 2);
            case 'json-to-jsobj':
                return 'const obj = ' + input + ';';
            default:
                return '// No conversion implemented';
        }
    } catch (err) {
        return '// Error converting: ' + err.message;
    }
}

export default converterOptions;
export { convert };
