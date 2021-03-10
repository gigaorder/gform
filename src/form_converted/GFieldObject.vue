<script>
import {_fieldsFactory, _modelFactory, flexFactory, genPath, labelFactory} from './FormFactory';
import {computed, getCurrentInstance, inject, ref} from 'vue'
import {genScopeId} from "../utils/vue-utils";

export default {
  name: 'GFieldObject',
  props: ['model', 'field', 'rootModel', 'path', 'noLayout'],
  emits: ['saveLocalStorage'],
  /*initLocalStoragePath() {
    if (this.rootModel) {
      return `${this.rootModel._id}/${this.field.key ? this.field.key : 'no-key'}/${this.path}/GFieldObject/collapseState`;
    }
  },
  injectLocalStorage: {
    collapseHistory: {default: false},
  },*/
  setup(props, {slots, emit}) {
    //if (props.path === 'deep.layout2.0') debugger
    const gForm = inject('$gform')
    const internalModel = _modelFactory(props);
    const flex = flexFactory(props);
    const label = labelFactory(props);
    const fields = _fieldsFactory(props, gForm);
    const collapse = ref(false)
    const showAction = ref(false)
    const noPanel = computed(() => {
      return props.field.noPanel;
    })
    const objectPath = computed(() => {
      return genPath(props, props.field.key);
    })

    function toggleCollapse() {
      collapse.value = !collapse.value
      //fixme:
      // collapseHistory = collapse.value
      emit('saveLocalStorage')
    }

    const _render = genScopeId(() =>
        (!noPanel.value) ?
            <g-col xs12>
              <fieldset class={collapse.value ? 'fieldset__collapsed' : ''}
                        v-show={fields.value && fields.value.length > 0}
                        style="position: relative"
                        onMouseenter={() => showAction.value = true}
                        onMouseleave={() => showAction.value = false}>
                {
                  (collapse.value) &&
                  <div onClick={toggleCollapse} class="fieldset-activator">
                  </div>
                }
                <div v-show={showAction.value}>
                  {slots.action ? slots.action() :
                      <g-card background-color="white" class="action-container" elevation={0}>
                        <g-btn xSmall icon onClick={() => props.model[props.field.key] = undefined}>
                          <g-icon small>
                            delete
                          </g-icon>
                        </g-btn>
                      </g-card>}
                </div>
                {
                  label.value && <>
                    {!collapse.value ? <legend class={collapse.value ? 'legend__collapsed' : ''}>
                          <span onClick={toggleCollapse}>
                            {label.value} {collapse.value ? '+' : ''}
                          </span>
                        </legend> :
                        <div class="legend__collapsed .legend">
                          <span onClick={toggleCollapse}>
                            {label.value} {collapse.value ? '+' : ''}
                          </span>
                        </div>
                    }
                  </>
                }
                <g-expand-transition>
                  <g-row v-show={!collapse.value}>
                    <g-field fields={fields.value}
                             model={internalModel.value}
                             rootmodel={props.rootModel}
                             path={objectPath.value}
                             noLayout={props.noLayout}/>
                  </g-row>
                </g-expand-transition>
              </fieldset>
            </g-col>
            :
            (
                (noPanel.value) &&
                <g-col xs12 style="position: relative">
                  {slots.action && slots.action()}
                  <g-field fields={fields.value}
                           model={internalModel.value}
                           rootModel={props.rootModel}
                           path={objectPath.value}
                           noLayout={props.noLayout}/>
                </g-col>
            )
    )
    const scopeId = getCurrentInstance().type['__scopeId'];
    return {
      scopeId,
      _render
    }
  },
  render() {
    return this._render();
  }
}
</script>

<style lang="scss" scoped>
:deep fieldset {
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

:deep legend {
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


:deep .fieldset__collapsed {
  transform: translateY(16px);
  margin-bottom: 30px;

  .action-container {
    top: 0px !important;
    zoom: 0.8;
  }
}

:deep .legend__collapsed {
  @extend legend;
  transform: translateY(16px);
  //position: absolute;
}

:deep .add-btn {
  margin-left: 0;
  box-shadow: 0 1px 1px 0 #9c9c9c;
}

:deep .action-container {
  position: absolute !important;
  right: -1px;
  zoom: 0.8;
  top: -54px;
  margin: 0;
  padding: 0;
  z-index: 10;
  line-height: 1;
  border: 1px solid rgb(238, 238, 238);

  &.g-btn {
    position: absolute;
  }
}

:deep .fix-inline {
  padding-right: 7px;
  padding-left: 7px;
}

:deep .fieldset-activator {
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
