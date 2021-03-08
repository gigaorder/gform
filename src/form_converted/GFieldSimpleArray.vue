<script>
import { genPath } from './FormFactory';
import { _fieldsFactory, _modelFactory, flexFactory, labelFactory } from './FormFactory';

export default {
  name: 'GFieldSimpleArray',
  props: ['model', 'field', 'path', 'rootModel', 'noLayout'],
  setup(props, { emit, slots }) {
    const internalModel = _modelFactory(props);
    const flex = flexFactory(props)
    const label = labelFactory(props);
    const fields = _fieldsFactory(props);

    function createArrayField(fields, $index) {
      return _.assign(_.cloneDeep(fields[0]), { key: $index, flex: props.field.flex, label: label.value });
    }

    function addItem() {
      if (!props.model[props.field.key]) props.model[props.field.key] = []
      props.model[props.field.key].push(null);
    }

    return () => <>
      {props.model[props.field.key].map((val, index) =>
          <g-col xs12 key={index}>
            <g-field onRemoveField={() => internalModel.value.splice(index, 1)}
                     inArray={true}
                     noLayout={false}
                     path={genPath(props, props.field.key)}
                     rootModel={props.rootModel}
                     field={createArrayField(props.field.fields, index)}
                     model={props.model[props.field.key]}/>
          </g-col>
      )}
      <g-col xs12>
        <g-btn textcolor="blue lighten-2" outlined small onClick={() => addItem()}>
          Add {label.value}
        </g-btn>
        {slots['btn-append'] && slots['btn-append']()}
      </g-col>
    </>
  }
}
</script>

<style scoped>

</style>
