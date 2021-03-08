<script>
import {computed, inject, ref, resolveComponent} from 'vue'
import {genScopeId} from '../utils/vue-utils';
import {_rootModelFactory, flexFactory, labelFactory} from './FormFactory';

export default {
  name: 'GField',
  props: {
    model: null,
    rootModel: null,
    path: String,
    metadata: null,
    fields: Array,
    field: Object,
    tabs: null,
    inArray: Boolean,
    noLayout: Boolean,
    domain: String,
    fillHeight: Boolean,
    collapseStates: Object,
    preprocess: [Boolean, String]
  },
  emits: ['onRemoveField'],
  setup(props, {emit, slots}) {
    const internalRootModel = _rootModelFactory(props);
    const gForm = inject('$gform')

    const activeTab = ref('0')
    const type = computed(() => {
      if (!props.field || !props.field.type) return null;
      const _type = gForm.resolveField(props.field);
      if (!_type) return props.field.type;
      return _type;
    })

    function getFormFields() {
      return props.fields.filter(f => {
        if (!f.addable) return true;
        return typeof props.model[f.key] !== 'undefined';
      })
    }

    function getAddFields() {
      return props.fields.filter(f => {
        if (!f.addable) return false;
        if (typeof props.model[f.key] === 'undefined') return true;
        return !!(f.type.includes('array') || f.type.includes('Array'));
      })
    }

    function addNullValue(field) {
      if (field.type.includes('array') || field.type.includes('Array')) {
        if (!props.model[field.key]) props.model[field.key] = []
        props.model[field.key].push({});
      } else if (field.type && field.type.split('@')[0] === 'object') {
        props.model[field.key] = {};
      } else {
        props.model[field.key] = null;
      }
    }

    function getTabs() {
      const basic = _.filter(props.fields, f => ![].concat(..._.values(props.tabs)).includes(f.key)).map(f => f.key);
      return _.map(_.assign({}, basic.length > 0 ? {basic} : {}, props.tabs), (tabFields, name) => {
        return {name, fields: _.filter(props.fields, f => tabFields.includes(f.key))};
      });
    }

    function isVisible(field) {
      if (!field.isVisible) return true;
      //fixme: *this
      return field.isVisible(this);
    }

    function setProperty(field) {
      if (field.key && !props.model.hasOwnProperty(field.key)) {
        if (field.type && field.type.split('@')[0] === 'object' && !field.addable) {
          props.model[field.key] = {}
        } else if (['array', 'tableArray', 'choiceArray'].includes(field.type)) {
          props.model[field.key] = []
        } else if (!['choice'].includes(field.type)) {
          props.model[field.key] = undefined
        }
      }
    }

    function resolveMetadata() {
      const preprocess = props.preprocess;
      let result = props.fields;
      if (preprocess) {
        result = gForm.preprocess[typeof preprocess === 'string' ? preprocess : 'normalize'](props.metadata, result);
      }
      return result;
    }

    function init() {
      if (props.fields) {
        props.fields.forEach(setProperty);
      } else if (!props.fields && props.field) {
        setProperty(props.field);
      }
    }

    init()

    const renderDynamicField = function () {
      const dynamicField = resolveComponent(type.value);
      return <dynamicField rootmodel={internalRootModel.value} path={props.path}
                           model={props.model} field={props.field} inArray={props.inArray}
                           noLayout={props.noLayout} fields={props.fields} v-slots={slots}
                           onRemoveField={() => emit('remove-field')}>
      </dynamicField>
    }

    const _render = genScopeId(() => {

      return <>
        {
          (props.metadata) ?
              <g-field path={props.path} fields={resolveMetadata()} model={props.model} noLayout={props.noLayout}/>
              :
              (
                  (props.tabs) ?
                      <g-tabs slider-color="primary" style="width: 100%" items={Object.keys(getTabs())}
                              class={{'tab-wrapper': props.fillHeight}} v-model={activeTab.value} v-slots={{
                        'default': () => <>
                          {getTabs().map((tab, index) =>
                              <g-tab-item class="pt-3" item={`${index}`} key={tab.name}>
                                <g-field fields={tab.fields} model={props.model} path={props.path}
                                         noLayout={props.noLayout} fillHeight={props.fillHeight}
                                         rootModel={internalRootModel.value}/>
                              </g-tab-item>
                          )}
                          {slots['tab-append'] && slots['tab-append']()}
                        </>,
                        'tabs': () => getTabs().map((tab, index) =>
                            <g-tab item={`${index}`} key={tab.name}> {tab.name} </g-tab>
                        )
                      }}>
                      </g-tabs>
                      :
                      (
                          props.fields ?
                              <g-row no-gutters class={props.fillHeight ? 'fill-height' : ''}>
                                {getFormFields().map((_field, index) => {
                                      return < g-field path={props.path} field={_field} model={props.model}
                                                       rootmodel={internalRootModel.value} noLayout={props.noLayout}
                                                       v-show={isVisible(_field)} key={'field_' + _field.key + '_' + index}>
                                      </g-field>;
                                    }
                                )}
                                <g-col xs12>
                                  {getAddFields().map((addField, index) =>
                                      <g-chip v-show='isVisible(addField)' backgroundcolor='#e5efff' textcolor='primary'
                                              onClick={() => addNullValue(addField)} key={addField.key + index}>
                                        <g-avatar class='g-avatar__left'>
                                          <g-icon color='primary'>
                                            add_circle
                                          </g-icon>
                                        </g-avatar>
                                        {addField.label || addField.key}
                                      </g-chip>
                                  )}
                                </g-col>
                              </g-row>
                              :
                              renderDynamicField()

                      )
              )
        }
      </>;
    })
    return {
      _render,
      type
    }
  },
  render() {
    return this._render();
  }
}
</script>
<style scoped lang="scss">
::v-deep .g-tab-items {
  overflow: visible;
}
</style>
