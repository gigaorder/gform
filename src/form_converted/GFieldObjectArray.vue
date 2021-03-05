<script>
import { _fieldsFactory, _modelFactory, flexFactory, labelFactory } from '../form/FormFactory';
import { inject } from 'vue'
import { genPath, getLabel } from './FormFactory';

export default {
  setup(props, { emit }) {
    const gForm = inject('$gform')
    const internalModel = _modelFactory(props);
    const flex = flexFactory(props);
    const label = labelFactory(props);
    const fields = _fieldsFactory(props, gForm);

    function addObjectItem() {
      if (!props.model[props.field.key] || !Array.isArray(props.model[props.field.key])) props.model[props.field.key] = []
      props.model[props.field.key].push({})
    }

    function createObjectArrayField(fields, val) {
      const index = props.model[props.field.key].indexOf(val)
      return { key: index, type: 'object', label: label.value, fields };
    }

    function pushItemDown(val) {
      const model = props.model[props.field.key]
      const index = model.indexOf(val)
      const itemsLength = model && model.length
      if (!itemsLength || isNaN(index) || index === itemsLength - 1) return
      const newModel = _.clone(model)
      const temp = newModel[index]
      newModel[index] = newModel[index + 1]
      newModel[index + 1] = temp
      model.splice(0, model.length, ...newModel)
    }

    function pushItemUp(val) {
      const model = props.model[props.field.key]
      const index = model.indexOf(val)
      const itemsLength = model && model.length
      if (!itemsLength || isNaN(index) || index === 0) return
      const newModel = _.clone(model)
      const temp = newModel[index]
      newModel[index] = newModel[index - 1]
      newModel[index - 1] = temp
      model.splice(0, model.length, ...newModel)
    }

    function deleteItem(val) {
      const model = props.model[props.field.key]
      const index = model.indexOf(val)
      model.splice(index, 1)
    }

    return () => <>
      <g-col xs12>
        {props.model[props.field.key].map(val =>
            <g-col class={[flex, flex !== 'col-xs-12' ? 'fix-inline' : '']} style="position: relative">
              <g-field-object field={createObjectArrayField(props.field.fields, val)}
                              model={props.model[props.field.key]}
                              inArray={true} rootmodel={props.rootModel}
                              path={genPath(props.field.key)}
                              noLayout={props.noLayout} v-slots={{
                'action': ({}) =>
                    <g-card background-color="white" class="action-container" elevation={0}>
                      <g-btn xsmall icon onClick={() => pushItemUp(val)}>
                        <g-icon small>
                          keyboard_arrow_up
                        </g-icon>
                      </g-btn>
                      <g-btn xsmall icon onClick={() => pushItemDown(val)}>
                        <g-icon small>
                          keyboard_arrow_down
                        </g-icon>
                      </g-btn>
                      <g-btn xsmall icon onClick={() => deleteItem(val)}>
                        <g-icon small>
                          delete
                        </g-icon>
                      </g-btn>
                    </g-card>
              }}/>
            </g-col>
        )}
        {(!props.field.addable) &&
        <g-btn class="ma-2" textcolor="blue lighten-2" outlined small onClick={addObjectItem}>
          ADD {getLabel(props.field).toUpperCase()}
        </g-btn>
        }
      </g-col>
    </>
  }
}
</script>

