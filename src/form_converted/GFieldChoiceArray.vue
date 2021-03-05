<script>
import { ref, computed, inject } from 'vue'
import { _fieldsFactory, _modelFactory, flexFactory, labelFactory } from '../form/FormFactory';
import { genPath, getLabel, getChoiceName } from './FormFactory';

export default {
  props: ['model', 'field', 'inArray', 'rootModel', 'path', 'noLayout'],
  setup(props, { emit }) {
    const gForm = inject('$gform')
    const flex = flexFactory(props)
    const label = labelFactory(props);
    const fields = _fieldsFactory(props, gForm);
    const showMenu = ref(false)
    const choiceKey = computed(() => {
      return props.field.choiceKey || 'choice';
    })

    function createChoiceArrayField(index) {
      return {
        key: index,
        type: 'choice',
        choiceKey: props.field.choiceKey,
        label: props.field.label,
        fields: props.field.fields,
        dynamicFields: props.field.dynamicFields
      };
    }

    function selectChoiceInArray(choice) {
      if (!props.model[props.field.key]) props.model[props.field.key] = []
      props.model[props.field.key].push({ [choiceKey.value]: this.getChoiceName(choice) });
      console.log('props.model[props.field.key]', props.model[props.field.key])
    }

    return () => <>
      {props.model[props.field.key].map((val, index) =>
          <g-col class={[flex.value]} key={index}>
            <g-field-choice onRemoveField={() => props.model[props.field.key].splice(index, 1)}
                            inArray={true}
                            rootmodel={props.rootModel}
                            path={genPath(props.field.key)}
                            field={createChoiceArrayField(index)}
                            model.sync={props.model[props.field.key]}
                            noLayout={props.noLayout}
            />
          </g-col>
      )}
      <g-col md12>
        {
          (!props.inArray) &&
          <g-menu offset-y z-index="1000" v-model={showMenu.value} closeOnContentClick={true} v-slots={{
            'default': () =>
                <g-list items={fields.value} v-slots={{
                  'list-item': ({ item }) =>
                      <g-list-item item={item} onSingleItemClick={() => selectChoiceInArray(item)}>
                        <g-list-item-content>
                          <g-list-item-text>
                            {getChoiceName(item)}
                          </g-list-item-text>
                        </g-list-item-content>
                      </g-list-item>
                  ,
                }}/>
            ,
            'activator': ({ toggleContent }) =>
                <g-btn onClick={toggleContent} backGroundColor="blue" textColor="white" small>
                  ADD {getLabel(props.field).toUpperCase()}
                  <g-icon>
                    arrow_drop_down
                  </g-icon>
                </g-btn>
          }}/>
        }
      </g-col>
    </>
  }
}
</script>

<style scoped>

</style>
