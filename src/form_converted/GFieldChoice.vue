<script>
import { computed, inject, ref } from 'vue'
import { genScopeId } from '../utils/vue-utils';
import { genPath, getLabel } from './FormFactory';
import { _fieldsFactory, _modelFactory, flexFactory, getChoiceName, labelFactory } from './FormFactory';

export default {
  name: 'GFieldChoice',
  props: ['model', 'field', 'inArray', 'rootModel', 'path', 'noLayout'],
  emits: ['remove-field', 'update:model'],
  setup(props, { emit }) {
    const gForm = inject('$gform')
    const fields = _fieldsFactory(props, gForm);
    const showMenu = ref(false)
    const choiceKey = computed(() => {
      return props.field.choiceKey || 'choice';
    })
    const choiceExist = computed(() => {
      if (props.field.choiceKeyOutside) return !!props.model[choiceKey.value];
      if (!props.model[props.field.key]) return false;
      return !!props.model[props.field.key][choiceKey.value];
    })
    const choiceModel = computed(() => {
      if (props.field.choiceKeyOutside) return props.model;
      if (!props.model[props.field.key]) props.model[props.field.key] = {}
      return props.model[props.field.key];
    })
    const choicePath = computed(() => {
      if (props.field.choiceKeyOutside) return props.path;
      return genPath(props, props.field.key)
    })
    const choiceBtnPrepend = computed(() => {
      if (props.field.choiceKeyOutside) return 'Choose';
      return 'Add'
    })
    const choiceField = computed(() => {
      let field = _.cloneDeep(fields.value.find(choice => getChoiceName(choice) === choiceModel.value[choiceKey.value]));
      /*if (!['array', 'object', 'tableArray', 'input', 'input@number', 'input@multiSelect'].includes(field.type)) {
        field = {
          label: this.choiceModel[choiceKey.value],
          type: 'object', fields: [_.assign(field, {key: props.field.key})]
        }
      } else */
      if (field.type === 'object') {
        field.label = field.label || field.key;
        delete field.key;
      } else {
        field.key = props.field.key;
      }

      return field;
    })

    function removeChoice() {
      if (props.inArray) {
        emit('remove-field');
      } else {
        if (props.field.choiceKeyOutside) {
          const fields = choiceField.value.fields;
          fields && fields.map(v => v.key).forEach(k => {
            delete props.model[k];
          })
          if (props.model[props.field.key]) props.model[props.field.key] = null
          props.model[choiceKey.value] = null
        } else {
          props.model[props.field.key] = null
        }
      }
    }

    function selectChoice(choice) {
      choiceModel.value[choiceKey.value] = getChoiceName(choice)
    }

    function pushItemDown(index) {
      index = parseInt(index)
      const itemsLength = props.model && props.model.length
      if (!itemsLength || isNaN(index) || index === itemsLength - 1) return

      const newModel = _.clone(props.model)
      const temp = newModel[index]
      newModel[index] = newModel[index + 1]
      newModel[index + 1] = temp
      emit('update:model', newModel)
    }

    function pushItemUp(index) {
      index = parseInt(index)
      const itemsLength = props.model && props.model.length
      if (!itemsLength || isNaN(index) || index === 0) return

      const newModel = _.clone(props.model)
      const temp = newModel[index]
      newModel[index] = newModel[index - 1]
      newModel[index - 1] = temp
      emit('update:model', newModel)
    }


    return genScopeId(() => <>
      <g-col xs12>
        {(choiceExist.value) &&
        <div>
          <g-col xs12>
            <g-field field={choiceField.value} model={choiceModel.value} onRemoveField={removeChoice} inArray={true} rootModel={props.rootModel} path={choicePath.value} noLayout={props.noLayout} v-slots={{
              'action': genScopeId(() =>
                  <g-card background-color="white" class="action-container" elevation={0}>
                    <g-btn xsmall icon onClick={() => pushItemUp(props.field.key)}>
                      <g-icon small>
                        keyboard_arrow_up
                      </g-icon>
                    </g-btn>
                    <g-btn xsmall icon onClick={() => pushItemDown(props.field.key)}>
                      <g-icon small>
                        keyboard_arrow_down
                      </g-icon>
                    </g-btn>
                    <g-btn xsmall icon onClick={() => removeChoice()}>
                      <g-icon small>
                        delete
                      </g-icon>
                    </g-btn>
                  </g-card>)
              ,
              'btn-append': () =>
                  (!props.inArray) &&
                  <g-btn small icon depressed textcolor="gray" onClick={removeChoice}>
                    <g-icon size={20}>
                      delete_outline
                    </g-icon>
                  </g-btn>
            }}/>
          </g-col>
        </div>
        }
        {(!choiceExist.value) &&
        <g-menu offset-y z-index="1000" v-model={showMenu.value} closeOnContentClick={true} v-slots={{
          default: () => <g-list items={fields.value} v-slots={{
            'list-item': ({ item }) =>
                <g-list-item item={item} onSingleItemClick={() => selectChoice(item)}>
                  <g-list-item-content>
                    <g-list-item-text>
                      {getChoiceName(item)}
                    </g-list-item-text>
                  </g-list-item-content>
                </g-list-item>
          }}/>,
          activator: ({ toggleContent }) =>
            <g-btn onClick={toggleContent} textcolor="blue lighten-2" outlined small>
              {choiceBtnPrepend.value.toUpperCase()} {getLabel(props.field).toUpperCase()}
              <g-icon>
                arrow_drop_down
              </g-icon>
            </g-btn>
        }}/>
        }
      </g-col>
    </>)
  }
}
</script>
