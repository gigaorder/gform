<script>
export default {
  setup() {
    return () => <>
      <g-col xs12 >
        {model[field.key].map(val  =>
            <>
              <g-col class={ [flex, flex !== 'col-xs-12' ? 'fix-inline': ''] } style="position: relative" >
                <g-field-object field={ createObjectArrayField(field.fields, val) } model={ model[field.key] } inArray={ true } rootmodel={ rootModel } path={ genPath(field.key) } noLayout={ noLayout }  v-slots={{ 'action': ({collapse}) => <>
                    <g-card background-color="white" class="action-container" elevation={ 0 } >
                      <g-btn xsmall icon onClick={() => pushItemUp(val)} >
                        <g-icon small >
                          keyboard_arrow_up
                        </g-icon>
                      </g-btn>
                      <g-btn xsmall icon onClick={() => pushItemDown(val)} >
                        <g-icon small >
                          keyboard_arrow_down
                        </g-icon>
                      </g-btn>
                      <g-btn xsmall icon onClick={() => deleteItem(val)} >
                        <g-icon small >
                          delete </g-icon>
                      </g-btn>
                    </g-card>
                  </>
                }}> </g-field-object>
              </g-col>
            </>
        )}{
        (!field.addable) &&
        <g-btn class="ma-2" textcolor="blue lighten-2" outlined small onClick={addObjectItem} >
          ADD {getLabel(field).toUpperCase()}
        </g-btn>
      }
      </g-col>
    </>
  }
}
</script>

