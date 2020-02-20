// tslint:disable: no-this-assignment


console.info('String prototypes')

import { isNullOrUndefined } from 'util';

const whitespaceCharacters = [
    String.fromCharCode(9), // Tab
    String.fromCharCode(10), // Line Feed
    String.fromCharCode(13), // Carriage return
    String.fromCharCode(32), // Normal Space,
    String.fromCharCode(8203), // Zero-width space
    String.fromCharCode(8202), // hair Space
    String.fromCharCode(8198), // Six-per-em space
    String.fromCharCode(8201), // Thin Space
    String.fromCharCode(8200), // Punctuation Space
    String.fromCharCode(8197), // Four-per-em space
    String.fromCharCode(8196), // Three-per-em space
    String.fromCharCode(8199), // Figure space
    String.fromCharCode(8194), // En space
    String.fromCharCode(8195), // Em space
    String.fromCharCode(10240) // Braille blank
];

String.prototype.replaceAll = function (search: string, replacement: string): string {
    const target: string = this;
    search = escapeRegexSpecialCharacters(search);
    return target.replace(new RegExp(search, 'g'), replacement);
};

function escapeRegexSpecialCharacters(search: string): string {
    const specialCharacters = ['^', '$', '\\', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|'];
    let newString = '';
    for (let i = 0; i < search.length; i++) {
        if (specialCharacters.includes(search.charAt(i))) {
            newString += `\\${search.charAt(i)}`;
        } else {
            newString += search.charAt(i);
        }
    }

    return newString;
}

String.prototype.isOneOf = function (strings: string[], ignoreCase: boolean = true): boolean {
    let target = this;

    target = ignoreCase ? target.toLocaleUpperCase() : target;
    if (isNullOrUndefined(strings) || strings.length === 0) {
        return false;
    }

    strings = strings.map((str) => {
        return ignoreCase ? str.toLocaleUpperCase() : str;
    });
    for (const str of strings) {
        if (target === str) {
            return true;
        }
    }

    return false;
};

String.prototype.trimAllWhitespace = function () {
    let target: string = this;
    if (typeof target === 'string') {
        const findFirstIndexOfNonWhitespaceChar: (target: string) => number = (_target) => {
            for (let index = 0; index < _target.length; index++) {
                const char = _target[index];
                if (!char.isOneOf(whitespaceCharacters)) {
                    return index;
                }
            }
            return _target.length - 1;
        };

        const findLastIndexOfNonWhitespaceChar: (target: string) => number = (_target) => {
            for (let index = _target.length - 1; index >= 0; index--) {
                const char = _target[index];
                if (!char.isOneOf(whitespaceCharacters)) {
                    return index + 1;
                }
            }
            return 0;
        };

        const firstIndex = findFirstIndexOfNonWhitespaceChar(target);
        const lastIndex = findLastIndexOfNonWhitespaceChar(target);
        target = target.slice(firstIndex, lastIndex);
    }

    return target;
};

String.prototype.containsOneOf = function (strings: string[], ignoreCase: boolean = true): boolean {
    let target: string = this;

    target = ignoreCase ? target.toLocaleUpperCase() : target;
    if (isNullOrUndefined(strings) || strings.length === 0) {
        return false;
    }

    strings = strings.map((str) => {
        return ignoreCase ? str.toLocaleUpperCase() : str;
    });
    for (const str of strings) {
        if (target.includes(str)) {
            return true;
        }
    }

    return false;
};

String.prototype.contains = function (value: string, ignoreCase: boolean = true): boolean {
    let target: string = this;

    target = ignoreCase ? target.toLocaleUpperCase() : target;
    value = ignoreCase ? value.toLocaleUpperCase() : value;
    return target.includes(value);
};