<template>
  <g-col xs12 v-if="!noPanel">
    <fieldset :class="collapse ? 'fieldset__collapsed' : ''" v-show="fields && fields.length > 0"
              style="position: relative" @mouseenter="showAction = true" @mouseleave="showAction = false">
      <div v-if="collapse" @click="toggleCollapse" class="fieldset-activator"/>
      <div v-show="showAction">
        <slot name="action" :collapse="collapse">
          <g-card background-color="white" class="action-container" :elevation="0">
            <g-btn xSmall icon @click="model[field.key] = undefined">
              <g-icon small>
                delete
              </g-icon>
            </g-btn>
          </g-card>
        </slot>
      </div>
      <legend :class="collapse ? 'legend__collapsed' : ''" v-if="label">
        <span @click="toggleCollapse">{{ label }} {{ collapse ? '+' : '' }}</span>
      </legend>

      <g-expand-transition>
        <g-row v-show="!collapse">
          <g-field :fields="fields" :model="internalModel" :rootModel="rootModel" :path="objectPath" :no-layout="noLayout"/>
        </g-row>
      </g-expand-transition>
    </fieldset>
  </g-col>

  <g-col xs12 v-else-if="noPanel" style="position: relative">
    <slot name="action"/>
    <g-field :fields="fields" :model="internalModel" :rootModel="rootModel" :path="objectPath" :no-layout="noLayout"/>
  </g-col>
</template>

<script>
  import {
    _fieldsFactory,
    _modelFactory,
    flexFactory,
    genPath,
    getLabel,
    labelFactory
  } from './FormFactory';
  import { inject } from 'vue';

  export default {
    name: 'GFieldObject',
    props: ['model', 'field', 'rootModel', 'path', 'noLayout'],
    initLocalStoragePath() {
      return `${this.rootModel._id}/${this.field.key ? this.field.key : 'no-key'}/${this.path}/GFieldObject/collapseState`;
    },
    injectLocalStorage: {
      collapseHistory: {default: false},
    },
    data: () => ({
      collapse: false,
      showAction: false,
    }),
    setup(props, context) {
      const gForm = inject('$gform')
      const internalModel = _modelFactory(props);
      const flex = flexFactory(props);
      const label = labelFactory(props);
      const fields = _fieldsFactory(props, gForm);

      return {internalModel, flex, label, fields}
    },
    created() {
      this.collapse = this.collapseHistory
    },
    computed: {
      noPanel() {
        return this.field.noPanel;
      },
      objectPath() {
        return genPath.bind(this)(this.field.key);
      },
      formattedField() {

      }
    },
    methods: {
      getLabel,
      toggleCollapse() {
        this.collapse = !this.collapse
        this.collapseHistory = this.collapse
        this.$emit('saveLocalStorage')
      }
    },
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
    margin-bottom: 30px;

    ::v-deep .action-container {
      top: -22px !important;
    }
  }

  .legend__collapsed {
    transform: translateY(12px);
    position: absolute;
  }

  .add-btn {
    margin-left: 0;
    box-shadow: 0 1px 1px 0 #9c9c9c;
  }

  ::v-deep .action-container {
    position: absolute !important;
    right: 0;
    top: -6px;
    margin: 0;
    padding: 0;
    z-index: 10;
    line-height: 1;
    border: 1px solid rgb(238, 238, 238);

    &.g-btn {
      position: absolute;
    }
  }

  .fix-inline {
    padding-right: 7px;
    padding-left: 7px;
  }

  .fieldset-activator {
    height: 100%;
    width: 100%;
    position: absolute;
  }
</style>
