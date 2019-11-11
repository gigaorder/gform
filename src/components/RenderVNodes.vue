<script type="text/jsx">
  // <!--Dynamic children is a component just use render function to render Node from props-->
  export default {
    name: 'RenderVNodes',
    functional: true,
    render(createElement, context) {
      //const {vNodes} = context.props;
      //return Array.isArray(vNodes) ? vNodes.map(item => item) : vNodes;
			const vNodes = context.slots().default;
      return Array.isArray(vNodes) ? vNodes.map(item => item) : vNodes;
    }
  };
</script>
