<script>
export default {
  setup() {
    return () => <>
      <g-col xs12 >
        {
          (choiceExist) &&
          <div>
            <g-col xs12 >
              <g-field field={ choiceField } model={ choiceModel } onRemoveField={removeChoice} inArray={ true } rootModel={ rootModel } path={ choicePath } noLayout={ noLayout }  v-slots={{ 'action': () => <>
                  <g-card background-color="white" class="action-container" elevation={ 0 } >
                    <g-btn xsmall icon onClick={() => pushItemUp(field.key)} >
                      <g-icon small >
                        keyboard_arrow_up
                      </g-icon>
                    </g-btn>
                    <g-btn xsmall icon onClick={() => pushItemDown(field.key)} >
                      <g-icon small >
                        keyboard_arrow_down
                      </g-icon>
                    </g-btn>
                    <g-btn xsmall icon onClick={() => removeChoice()} >
                      <g-icon small >
                        delete
                      </g-icon>
                    </g-btn>
                  </g-card>
                </>
                ,
                'btn-append': () => <>
                  {
                    (!inArray) &&
                    <g-btn small icon depressed textcolor="gray" onClick={() => removeChoice()} >
                      <g-icon size={ 20 } >
                        delete_outline </g-icon>
                    </g-btn>
                  }
                </>
              }}> </g-field>
            </g-col>
          </div>
        }
        {
          (!choiceExist) &&
          <g-menu offset-y z-index="1000" v-model={showMenu} closeoncontentclick={ true }  v-slots={{ 'default': () => <> <g-list items={ fields }  v-slots={{ 'list-item': ({item}) => <>
                <g-list-item item={ item } onSingleitemclick={() => selectChoice(item)} >
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
              <g-btn onClick={toggleContent} textcolor="blue lighten-2" outlined small >
                {choiceBtnPrepend.toUpperCase()} {getLabel(field).toUpperCase()}
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
