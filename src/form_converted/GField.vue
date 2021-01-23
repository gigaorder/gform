<script>
export default {
  setup() {
    return () => <>
      {
        (metadata) ?
            <g-field path={path} fields={resolveMetadata()} model={model} noLayout={noLayout}>
            </g-field>
            :
            (
                (tabs) ?
                    <g-tabs slider-color="primary" style="width: 100%" items={Object.keys(getTabs())} class={{ 'tab-wrapper': fillHeight }} v-model={activeTab} v-slots={{
                      'default': () => <>
                        {getTabs().map((tab, index) =>
                            <g-tab-item class="pt-3" item={`${index}`} key={tab.name}>
                              <g-field fields={tab.fields} model={model} path={path} noLayout={noLayout} fillHeight={fillHeight} rootmodel={internalRootModel}>
                              </g-field>
                            </g-tab-item>
                        )}
                        <slot name="tab-append"></slot>
                      </>,
                      'tabs': () => <>
                        {getTabs().map((tab, index) =>
                            < g-tab item={`${index}`} key={tab.name}> {tab.name} </g-tab>
                        )}
                      </>
                    }}>
                    </g-tabs>
                    :
                    (
                        (fields) ?
                            <g-row no-gutters class={fillHeight ? 'fill-height' : ''}>
                              {getFormFields().map((_field, index) =>
                                  < g-field path={path} field={_field} model={model} rootmodel={internalRootModel} noLayout={noLayout} v-show='isVisible(_field)' key={'field_' + _field.key + '_' + index}>
                                  </g-field>
                              )}
                              <g-col xs12>
                                {getAddFields().map((addField, index) =>
                                    <g-chip v-show='isVisible(addField)' backgroundcolor='#e5efff' textcolor='primary' onClick={() => addNullValue(addField)} key={addField.key + index}>
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
                            <component is={type} rootmodel={internalRootModel} path={path} model={model} field={field} inArray={inArray} noLayout={noLayout} fields={fields}>
                              {Object.keys(slots).map(slot =>
                                  <slot name={slot} slot={slot}>
                                  </slot>
                              )} </component>
                    )
            )
      }
    </>
  }
}
</script>
<style scoped lang="scss">
::v-deep .g-tab-items {
  overflow: visible;
}
</style>
