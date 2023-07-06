Object.defineProperty(String.prototype, 'isEmpty', {
    get() {
        return this.length === 0;
    },
});
Object.defineProperty(String.prototype, 'isNotEmpty', {
    get() {
        return this.length > 0;
    },
});
export {};
//# sourceMappingURL=string.js.map