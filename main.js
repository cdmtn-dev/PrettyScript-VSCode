const vscode = require("vscode");

function activate(context) {
    const provider = {
        provideHover(document, position) {
            const wordRange = document.getWordRangeAtPosition(position, /@?[a-zA-Z_][a-zA-Z0-9_]*/);
            if (!wordRange) return;

            const word = document.getText(wordRange);

            const types = {
                0: "Function",
                1: "Operator",
                2: "Modificator",
                3: "Build-in constant"
            }

            const words = {
                log: {
                    type: 0,
                    structure: "log(...args: function): void",
                    description: "Prints value to console.",
                },
                use: {
                    type: 1,
                    structure: "use name",
                    description: "Enables the use of the built-in library's functionality",
                },
                "@preload": {
                    type: 2,
                    structure: "@preload './path/to/file.css'",
                    description: "Allows you to load CSS and JS files directly into HTML",
                },
                "@app": {
                    type: 2,
                    structure: [
                        "@app fn App",
                        "\treturn component|HTML",
                        "}"
                    ],
                    description: "Available only when using React. Allows you to run a function as the main function for the built-in React renderer",
                },
                "__filename": {
                    type: 3,
                    structure: "__filename: string",
                    description: "Returns the path to the executable file",
                },
                "__version": {
                    type: 3,
                    structure: "__version: string",
                    description: "Returns the current language version specified in package.json",
                },
                "component": {
                    type: 1,
                    structure: "component Component {\n\t<p.className>Hello world!</div>\n}",
                    description: "Allows you to create a component with embedded HTML",
                },
                "include": {
                    type: 1,
                    structure: "include './path/to/file/'",
                    description: "Imports only PrettyScript code from the .ps file",
                },
                "render": {
                    type: 1,
                    structure: "render {\n\t<p.className>Hello world!</div>\n}",
                    description: "Generates HTML that's ready to use",
                },
                "fn": {
                    type: 1,
                    structure: [
                        "fn foo() {",
                        "\t///...",
                        "}"
                    ],
                    description: "Abbreviation for the keyword 'function'",
                },
                "async": {
                    type: 1,
                    structure: [
                        "async foo() {",
                        "\t///...",
                        "}"
                    ],
                    description: "Shorthand syntax for 'async function'",
                },
                "interface": {
                    type: 1,
                    structure: "interface User {\n\tname: string,\n\tsurname: string,\n\tAPIVersion: version,\n\tid: int\n}",
                    description: "Allows you to create an interface (new type) for validating objects",
                },
                "sizeof": {
                    type: 1,
                    structure: "sizeof <:object>",
                    description: "Allows you to determine the length of any object",
                }
            }

            const line = document.lineAt(position.line).text

            if (word === "async") {
                if (line.includes("use async")) return
            }

            if(word in words) {
                let obj = words[word]

                const md = new vscode.MarkdownString();
                let structure = obj.structure
                let desc = obj.description
                let type = obj.type

                if(type in types) {
                    let typeName = types[type]

                    md.appendMarkdown(`Type: **\`${typeName}\`**`);
                }

                if(typeof structure == "string") {
                    md.appendCodeblock(`${structure}`, "ps");
                }
                else if(typeof structure == "object") {
                    structure.forEach(s => {
                        md.appendCodeblock(`${s}`, "ps");
                    })
                }
                
                md.appendMarkdown(desc);

                return new vscode.Hover(md);
            }
        }
    };

    context.subscriptions.push(
        vscode.languages.registerHoverProvider("ps", provider)
    );

    console.log("EXTOK")
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};