// pages/tools/programming/languageList.js

const languageNames = [
    'Assembly',
    'Awk',
    'Bash',
    'C',
    'C#',
    'C++',
    'COBOL',
    'Common Lisp',
    'Crystal',
    'Dart',
    'Elixir',
    'Erlang',
    'F#',
    'Fortran',
    'Go',
    'Groovy',
    'Hack',
    'Haskell',
    'Java',
    'JavaScript',
    'Julia',
    'Kotlin',
    'Lua',
    'Matlab',
    'Nim',
    'Objective-C',
    'OCaml',
    'Pascal',
    'Perl',
    'PHP',
    'PowerShell',
    'Prolog',
    'Python',
    'R',
    'ReasonML',
    'ReScript',
    'Ruby',
    'Rust',
    'SAS',
    'Scala',
    'Scheme',
    'Shell',
    'Smalltalk',
    'Solidity',
    'Swift',
    'Tcl',
    'TypeScript',
    'VB.NET',
    'Verilog',
    'VHDL',
    'Zig',
];

// Helper to generate code slug from language name
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/\+/g, 'plus')     // Replace + with 'plus'
        .replace(/#/g, 'sharp')     // Replace # with 'sharp'
        .replace(/\./g, '')         // Remove dots
        .replace(/ /g, '-')         // Replace spaces with dash
        .replace(/[^\w-]+/g, '');   // Remove all non-word chars except dash
}

const languages = languageNames.map(name => ({
    code: slugify(name),
    name,
}));

export default languages;
