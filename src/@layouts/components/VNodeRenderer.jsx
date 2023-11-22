export const VNodeRenderer = defineComponent({
    name: 'VNodeRenderer',
    props: {
        nodes: {
            type: [Array, Object],
            required: true,
        },
    },
    setup(props) {
        return () => props.nodes;
    },
});
//# sourceMappingURL=VNodeRenderer.jsx.map