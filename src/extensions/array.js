Object.defineProperty(Array.prototype, 'isEmpty', {
    get() {
        return this.length === 0;
    },
});
Object.defineProperty(Array.prototype, 'isNotEmpty', {
    get() {
        return this.length > 0;
    },
});
export {};
//# sourceMappingURL=array.js.map