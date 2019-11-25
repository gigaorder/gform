<template>
  <g-col xs12 v-if="!noPanel">
    <fieldset :class="collapse ? 'fieldset__collapsed' : ''" v-show="_fields && _fields.length > 0"
              style="position: relative">
      <div v-if="collapse" @click="collapse = !collapse" class="fieldset-activator"></div>
      <slot name="action" :collapse="collapse">
        <g-btn icon depressed class="remove-btn" @click="model[field.key] = undefined">
          <g-icon>delete</g-icon>
        </g-btn>
      </slot>
      <legend :class="collapse ? 'legend__collapsed' : ''" v-if="label">
        <span @click="collapse = !collapse">{{label}} {{collapse ? '+' : ''}}</span>
      </legend>

      <GExpandTransition>
        <g-row v-show="!collapse">
          <g-field :fields="_fields" :model="_model" :rootModel="rootModel" :path="objectPath" :no-layout="noLayout"/>
        </g-row>
      </GExpandTransition>
    </fieldset>
  </g-col>

  <g-col xs12 v-else-if="noPanel" style="position: relative">
    <slot name="action"/>
    <g-field :fields="_fields" :model="_model" :rootModel="rootModel" :path="objectPath" :no-layout="noLayout"/>
  </g-col>
</template>

<script>
  import {
    _fieldsFactory,
    _modelFactory,
    addObjectItem,
    flexFactory,
    genPath,
    getLabel,
    labelFactory
  } from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldObject',
    props: ['model', 'field', 'rootModel', 'path', 'noLayout'],
    data: () => ({
      collapse: false
    }),
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props);
      const label = labelFactory(props);
      const _fields = _fieldsFactory(props);

      return {_model, flex, label, _fields}
    },
    computed: {
      noPanel() {
        return this.field.noPanel;
      },
      objectPath() {
        return genPath.bind(this)(this.field.key);
      }
    },
    methods: {
      getLabel,
    }
  }
</script>

<style lang="scss" scoped>
  fieldset {
    padding: 0 10px 10px 10px;
    position: relative;
    top: 0;
    border: 1px solid #eee;
    border-radius: 2px;
    //background-color: rgba(128, 128, 128, 0.03);
    width: 100%;
    margin-bottom: 20px;
    min-height: 60px;
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
    transition: 200ms;
  }

  .fieldset__collapsed {
    transform: translateY(16px);
  }

  .legend__collapsed {
    transform: translateY(12px);
    position: absolute;
  }

  .add-btn {
    margin-left: 0;
    box-shadow: 0 1px 1px 0 #9c9c9c;
  }

  ::v-deep .remove-btn {
    position: absolute;
    right: 0;
    top: 16px;
    margin: 0;
    font-size: 1.3em;
    padding: 0;
    min-width: 33px !important;
    width: 33px !important;
    z-index: 10;
    height: 33px !important;

    ::v-deep .v-icon {
      font-size: 0.9em;
      color: #6d6d6d;
    }

    &.g-btn {
      position: absolute;
    }

    &__collapsed {
      top: 10px !important;
    }
  }

  .fix-inline {
    padding-right: 7px;
    padding-left: 7px;

    .remove-btn {
      right: 0;
    }
  }

  .fieldset-activator {
    height: 100%;
    width: 100%;
    position: absolute;
  }
</style>
