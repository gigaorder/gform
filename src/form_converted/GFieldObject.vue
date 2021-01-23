<script>
export default {
  setup() {
    return () => <>
      {
        (!noPanel) ?
            <g-col xs12 >
              <fieldset class={ collapse ? 'fieldset__collapsed' : '' } v-show="fields && fields.length > 0" style="position: relative" onMouseenter={() => showAction = true} onMouseleave={() => showAction = false} >
                {
                  (collapse) &&
                  <div onClick={toggleCollapse} class="fieldset-activator" >
                  </div>
                }
                <div v-show="showAction" >
                  <slot name="action" collapse={ collapse } >
                    <g-card background-color="white" class="action-container" elevation={ 0 } >
                      <g-btn xsmall icon onClick={() => model[field.key] = undefined} >
                        <g-icon small >
                          delete
                        </g-icon>
                      </g-btn>
                    </g-card>
                  </slot>
                </div>
                {
                  (label) &&
                  <legend class={ collapse ? 'legend__collapsed' : '' } >
                    <span onClick={toggleCollapse} >
                      { label } { collapse ? '+' : '' } </span>
                  </legend>
                }
                <g-expand-transition>
                  <g-row v-show="!collapse" >
                    <g-field fields={ fields } model={ internalModel } rootmodel={ rootModel } path={ objectPath } noLayout={ noLayout } >
                    </g-field>
                  </g-row>
                </g-expand-transition>
              </fieldset>
            </g-col>
            :
            (
                (noPanel) &&
                <g-col xs12 style="position: relative" >
                  <slot name="action" >
                  </slot>
                  <g-field fields={ fields } model={ internalModel } rootmodel={ rootModel } path={ objectPath } noLayout={ noLayout } >
                  </g-field>
                </g-col>
            )
      }
    </>
  }
}
</script>

<style lang="scss" scoped>
fieldset {
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

legend {
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

.fieldset__collapsed {
  transform: translateY(16px);
  margin-bottom: 30px;

  ::v-deep .action-container {
    top: -22px !important;
  }
}

.legend__collapsed {
  transform: translateY(12px);
  position: absolute;
}

.add-btn {
  margin-left: 0;
  box-shadow: 0 1px 1px 0 #9c9c9c;
}

::v-deep .action-container {
  position: absolute !important;
  right: 0;
  top: -6px;
  margin: 0;
  padding: 0;
  z-index: 10;
  line-height: 1;
  border: 1px solid rgb(238, 238, 238);

  &.g-btn {
    position: absolute;
  }
}

.fix-inline {
  padding-right: 7px;
  padding-left: 7px;
}

.fieldset-activator {
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
