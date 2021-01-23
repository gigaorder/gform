<script>
export default {
  setup() {
    return () => <>
      {model[field.key].map((val, index)  =>
          <g-col class={ [flex] } key={ index } >
            <g-field-choice onRemoveField={() => model[field.key].splice(index, 1)} inArray={ true } rootmodel={ rootModel } path={ genPath(field.key) } field={ createChoiceArrayField(index) } model.sync={ model[field.key] } noLayout={ noLayout } >
            </g-field-choice>
          </g-col>
      )}<g-col md12 >
      {
        (!inArray) &&
        <g-menu offset-y z-index="1000" v-model={showMenu} closeoncontentclick={ true }  v-slots={{ 'default': () => <> <g-list items={ fields }  v-slots={{ 'list-item': ({item}) => <>
              <g-list-item item={ item } onSingleitemclick={() => selectChoiceInArray(item)} >
                <g-list-item-content>
                  <g-list-item-text>
                    { getChoiceName(item) } </g-list-item-text>
                </g-list-item-content>
              </g-list-item>
            </>
            ,
          }}> </g-list>
          </>
          ,
          'activator': ({toggleContent}) => <>
            <g-btn onClick={toggleContent} backgroundcolor="blue" textcolor="white" small >
              ADD {getLabel(field).toUpperCase()}
              <g-icon>
                arrow_drop_down </g-icon>
            </g-btn>
          </>
        }}> </g-menu>
      }
    </g-col>
    </>
  }
}
</script>

<style scoped>

</style>
