// We haven't added icon's computed property because it makes this mixin coupled with UI
export const togglePasswordVisibility = {
    data() {
        return {
            passwordFieldType: 'password',
        };
    },
    methods: {
        togglePasswordVisibility() {
            const _this = this;
            _this.passwordFieldType = _this.passwordFieldType === 'password' ? 'text' : 'password';
        },
    },
};
export const _ = null;
//# sourceMappingURL=forms.js.map