<script>
  import {
    VTabs,
    VTab,
    VTabItem,
    VLayout,
    VFlex,
    VMenu,
    VBtn,
    VList,
    VListTile,
    VListTileTitle,
    VIcon,
    VExpandTransition
  } from 'vuetify/lib';
  import Vue from 'vue';
  import ExtendPath from './ExtendPath';
  import { Fragment } from 'vue-fragment';
  import treeFactory from './GTreeFactory';
  import RenderVNodes from './RenderVNodes';
  import { reactive, set as vSet, ref } from 'vue';
  import SimpleArrayHandler from './SimpleArrayHandler';
  import ObjectArrayHandler from './ObjectArrayHandler';
  import { _fields, genField, getChoiceName, getLabel, getValueFromPathFactory, makeAddable } from './utils';
  import ChoiceHandler from './ChoiceHandler';
  import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash';
  import ChoiceArrayHandler from './ChoiceArrayHandler';
  import TableArrayHandler from './TableArrayHandler';
  import ObjectHandler from './ObjectHandler';

  const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };


  export default {
    //functional: true,
    components: {
      ExtendPath,
      Fragment, VTabs, VTab, VTabItem, VLayout, VFlex,
      VMenu, VBtn, VList, VListTile, VListTileTitle, VIcon,
      RenderVNodes, VExpandTransition
    },
    name: 'GField',
    props: {
      modelValue: null,
      model: null,
      fields: Array,
      field: Object,
      tabs: null,
      inArray: Boolean,
      noLayout: Boolean,
      domain: String,
      fillHeight: Boolean,
      path: String,
      rootModel: null
    },
    domain: ':domain',
    data: () => ({
      collapse: false,
      rowDetail: null
    }),
    /*setup(props, context) {
    },*/
    methods: {
      getTabs() {
        const basic = _.filter(this.fields, f => ![].concat(..._.values(this.tabs)).includes(f.key)).map(f => f.key);
        return _.map(_.assign({}, basic.length > 0 ? { basic } : {}, this.tabs), (tabFields, name) => {
          return { name, fields: _.filter(this.fields, f => tabFields.includes(f.key)) };
        });
      },
    },
    provide() {
      return {
        noLayout: this.noLayout,
        rootModel: this.rootModel || this.model || this.modelValue
      };
    },
    created() {
      if (this.tabs) {
        this.formRender = formInTabsRender.bind(this)
        return;
      }

      let model = this.model || this.modelValue;
      let rootModel = this.rootModel || model;
      let rootPath = this.path ? this.path.split('.') : [];

      this.formRender = factory(this.$props, model, rootModel, rootPath, this);
    },
    render(h, context) {
      return this.formRender();
    }
  };

  function formInTabsRender() {
    const tabs = this.getTabs();

    let model = this.model || this.modelValue;
    let rootModel = this.rootModel || model;
    let rootPath = this.path ? this.path.split('.') : [];

    return <v-tabs style="width: 100%" className={{ 'tab-wrapper': this.fillHeight }}>
      {tabs.map((tab, index) => <v-tab key={index}>{tab.name}</v-tab>)}
      {tabs.map((tab, index) => <v-tab-item key={index} style="padding-top: 20px;">
        <g-field fields={tab.fields} propsModel={model}
                 propsRootModel={rootModel} path={rootPath.join('.')}
                 fill-height={this.fillHeight} no-layout={this.noLayout}></g-field>
      </v-tab-item>)}
      <slot name="tab-append"></slot>
    </v-tabs>
  }

  function factory(props, model, rootModel, rootPath, context) {
    let treeStates = reactive({});
    let nodeHandlers = [];

    function registerNodeHandler(HandlerClass) {
      const handler = new HandlerClass(context, rootPath)
      nodeHandlers.push(handler);
    }

    [SimpleArrayHandler, ObjectArrayHandler, ChoiceHandler,
      ChoiceArrayHandler, TableArrayHandler, ObjectHandler].map(registerNodeHandler)

    function genRootWrapper(children) {
      //return makeAddable(props.fields, children, model);
      if (props.fields) {
        return <v-layout row wrap fill-height={props.fillHeight}>{makeAddable(props.fields, children, model, context)}</v-layout>
      } else {
        return <fragment>{children()}</fragment>;
      }
      //return <fragment>{makeAddable(props.fields, children, model)}</fragment>
    }

    function genNode({ node, text, childrenVNodes, isLast, state, path }) {
      if (!arguments[0].childrenVNodes) arguments[0].childrenVNodes = [];

      const pathToParent = [...path];
      pathToParent.pop();
      //todo: auto init

      for (const nodeHandler of nodeHandlers) {
        if (nodeHandler.rule(node)) {
          const fieldModel = getValueFromPathFactory(nodeHandler.genDefaultValue)(model, node, pathToParent, path)
          return slots => nodeHandler.genNode(...arguments, { rootModel, pathToParent, treeStates, slots, fieldModel });
        }
      }

      const fieldModel = getValueFromPathFactory()(model, node, pathToParent, path);

      return slots => genField(_.assign(arguments[0], { path: rootPath.concat(path) }), { rootModel, fieldModel, slots }, { noLayout: props.noLayout })
    }

    function itemChildren(node, { isNodeRootArray, path }) {
      if (isNodeRootArray) return node;

      for (const nodeHandler of nodeHandlers) {
        if (nodeHandler.rule(node)) {
          const getValue = () => getValueFromPathFactory(nodeHandler.genDefaultValue)(model, node, path)
          return nodeHandler.itemChildren(...arguments, { rootModel, getValue });
        }
      }
    }

    const itemPath = function (node, { key, path, isRoot }) {
      if (isRoot && Array.isArray(node)) return null;
      for (const nodeHandler of nodeHandlers) {
        if (nodeHandler.rule(node)) {
          let result = nodeHandler.itemPath(...arguments);
          if (result !== undefined) return result;
        }
      }

      return node.key;
    }

    const itemText = function (node) {
      return node.label || node.key;
    }

    const { genTree } = treeFactory({
      treeStates,
      data: props.fields || props.field,
      itemChildren,
      itemText,
      genRootWrapper,
      genNode,
      itemPath
    })

    return genTree;
  }
</script>

<style scoped lang="scss">
  table.v-datatable.v-table tbody td:not(:nth-child(1)) {
    padding: 0 10px;
  }

  .v-datatable.v-table thead tr {
    height: 40px;
  }

  .v-datatable.v-table tbody td {
    height: 44px;
    padding: 0 10px !important;

    .v-text-field .v-input__append-inner {
      padding-left: 0 !important;
    }
  }

  .v-datatable.v-table th {
    padding: 0 18px;
  }

  .theme--light.v-table {
    //background-color: transparent;
  }

  fieldset {
    padding: 0 10px 10px 10px;
    position: relative;
    top: 0;
    border: 1px solid #eee;
    border-radius: 2px;
    //background-color: rgba(128, 128, 128, 0.03);
    width: 100%;
    margin-bottom: 20px;
  }

  legend {
    color: #337ab7;
    border: 0;
    margin-left: 10px;
    width: initial;
    padding: 1px 5px;
    font-size: 1.3em;
    font-weight: 300;
    font-family: Roboto, sans-serif;
  }

  .add-btn {
    margin-left: 0;
    box-shadow: 0 1px 1px 0 #9c9c9c;
  }

  .remove-btn {
    position: absolute;
    right: 0;
    top: 14px;
    margin: 0;
    font-size: 1.3em;
    padding: 0px;
    min-width: 32px;
    width: 32px;
    border: 1px solid #eaeaea;
    background-color: #f9f9f9 !important;
    z-index: 10;
    height: 23px;

    .v-icon {
      font-size: 0.9em;
      color: #6d6d6d;
    }
  }

  .fix-inline {
    padding-right: 7px;
    padding-left: 7px;

    .remove-btn {
      right: 7px;
    }
  }

  /*.v-datatable.v-table.v-gfield-table {
    thead tr {
      height: 20px;
    }

    /deep/ .v-input input {
      max-height: 28px;
    }
  }*/

</style>

<style lang="scss">
  .tab-wrapper {
    .v-tabs__bar {
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .v-window {
      height: calc(100% - 50px)
    }

    &, .v-window__container, .v-window-item {
      height: 100%
    }
  }
</style>

