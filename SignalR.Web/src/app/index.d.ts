

// Ensure this is treated as a module.
export { };

declare global {
    interface String {
        replaceAll(search: string, replacement: string): string;
        trimAllWhitespace(): string;
        /**
         * Compares a string to an array of strings.
         * @param {string[]} strings The array of strings which to compare the string to.
         * @param {boolean} [ignoreCase=true] - Whether or not to compare using case sensitivity. (Default = true)
         */
        isOneOf(strings: string[], ignoreCase?: boolean): boolean;

        contains(value: string, ignoreCase?: boolean): boolean;
        containsOneOf(strings: string[], ignoreCase?: boolean): boolean;
    }


}
