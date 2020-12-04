<template>
  <div data-app>
    <g-row style="width: 90%; padding: 20px">
      <g-field path="deep" :tabs="tabs" :fields="fields" :model="model"/>
        <br/><br/>
        <g-row class="col-xs-12">
          <div>
            {{ modelTxt }}
          </div>
        </g-row>
    </g-row>
  </div>
</template>

<script>
  import RenderVNodes from '../components/RenderVNodes';

  export default {
    name: 'form-story2',
    components: {RenderVNodes},
    data() {
      return {
        dialog: false,
        model: {
          name: 'test',
          addressArray3: [
            {street: 'a1', city: 'b1'},
            {street: 'a2', city: 'b2'}
          ],
          //choice at root
          type: 'linear',
          linearName: 'test',
        },
        tabs: {
          Simple: ['addressArray2'],
          Object: ['addressArray1'],
          Table: ['addressArray3'],
          Choice: ['layout'],
          ChoiceArray: ['layout2'],
          ChoiceAtRoot: ['layout3'],
          Options: ['options'],
        },
        fields: [
          {key: 'name', type: 'input', flex: 'md-6', default: 'name'},
          {key: 'nr', type: 'input@number', flex: 'md-6', addable: true},
          {key: 'switch', type: 'input', inputType: 'switch', flex: 'md-6'},
          {
            key: 'sex', type: 'input', inputType: 'select', flex: 'md-6', itemText: 'text', itemValue: 'value', sex: '',
            options: [{text: 'male', value: 0}, {text: 'female', value: 1}]
          },
          {
            key: 'sexFn', type: 'input', inputType: 'select', flex: 'md-6',
            options: (formState) => {
              return [{text: 'male', value: 0}, {text: 'female', value: 1}];
            }
          },
          {key: 'date', type: 'input@datetime-local', flex: 'md-6'},
          {
            key: 'address', type: 'object',
            fields: [{key: 'street', type: 'input', flex: 'md-6'}, {key: 'city', type: 'input', flex: 'md-6'},]
          },
          {
            key: 'addressArray1', type: 'array', label: 'Address1', flex: 'md-3',
            fields: [{key: 'street', type: 'input', flex: 'md-6'}, {key: 'city', type: 'input', flex: 'md-6'},]
          },
          {
            key: 'addressArray2', type: 'array', label: 'Address2',
            fields: [{type: 'input', flex: 'md-12'}]
          },
          {
            key: 'addressArray3', type: 'tableArray', label: 'Address3',
            fields: [{key: 'street', type: 'input', flex: 'md-6'}, {key: 'city', type: 'input', flex: 'md-6'},]
          },
          {
            key: 'layout', type: 'choice', choiceKey: 'layoutType',
            fields: [{
              key: 'linear', type: 'object',
              fields: [{key: 'linearName', type: 'input', flex: 'md-12'}]
            }, {
              key: 'grid', type: 'object',
              fields: [{key: 'gridName', type: 'input', flex: 'md-12'}]
            }]
          },
          {
            key: 'layout2', type: 'choiceArray', label: 'Layout', choiceKey: 'type',
            fields: [{
              choiceName: 'linear', type: 'object',
              fields: [{key: 'linearName', type: 'input', flex: 'md-12'}]
            }, {
              choiceName: 'grid', type: 'object',
              fields: [{key: 'gridName', type: 'input', flex: 'md-12'}]
            }]
          },
          {
            key: 'layout3', type: 'choice', choiceKeyOutside: true, choiceKey: 'type',
            fields: [{
              //todo: use choiceName instead of key
              choiceName: 'linear', type: 'object',
              fields: [{key: 'linearName', type: 'input', flex: 'md-12'}]
            }, {
              choiceName: 'grid', type: 'object',
              fields: [{key: 'gridName', type: 'input', flex: 'md-12'}]
            }]
          },
          {
            //todo: remove key
            key: 'options', type: 'choice', choiceKeyOutside: true, choiceKey: 'optionsChoice',
            fields: [{
              choiceName: 'simple', type: 'array',
              fields: [{key: 'simple', type: 'input', flex: 'md-12'}]
            }, {
              choiceName: 'textValue', type: 'tableArray',
              fields: [{key: 'text', type: 'input', flex: 'md-12'}, {key: 'value', type: 'input', flex: 'md-12'}]
            }]
          }
        ]
      }
    },
    computed: {
      modelTxt() {
        return JSON.stringify(this.model)
      }
    }
  }
</script>

<style scoped lang="scss">
  .keyboard-container {
    display: grid;
    /*@formatter:off*/
    grid-template: 'header header header header' 1fr 'step step step step' 0.9fr 'input input input input' 0.7fr 'btn7 btn8 btn9 bsp' 1fr 'btn4 btn5 btn6 abc' 1fr 'btn1 btn2 btn3 ok' 1fr 'logout btn0 cancel ok' 1fr/
      	1fr 1fr 1fr 1fr;
    /*@formatter:on*/
    grid-gap: 2px 2px;

    .key {
      background-color: #313131 !important;
      color: white;
      font-size: 1.3em;
      font-weight: 400;
      height: 100%;
      width: 100%;
      margin: 0;
    }
  }
</style>
