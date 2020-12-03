<template>
	<v-app>
		<div style="width: 70%;padding: 20px">
			<g-field :fields="fields" :model="model" :tabs="tabs"></g-field>
			<br><br>
			<div>
				{{model}}
			</div>
		</div>
	</v-app>
</template>

<script>
  //import _ from 'lodash';
  //import {VApp} from 'vuetify/lib';
  import GForm from '../main';
  //import GForm from '../../dist/GForm.umd';

  export default {
    name: 'form-story',
    components: {},
    data() {
      return {
        dialog: false,
        model: {
          name: 'test',
          addressArray1: [
            {street: 'a', city: 'b'}
          ],
          /*layout: {
						 choice: 'linear',
						 linear: {
								linearName: 'linear1'
						 }
					}*/
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
          {key: 'name', type: 'input', flex: 'md6'},
          {key: 'nr', type: 'input', inputType: 'number', flex: 'md6'},
          {key: 'switch', type: 'input', inputType: 'switch', flex: 'md6'},
          {
            key: 'sex', type: 'input', inputType: 'select', flex: 'md6',
            options: [{text: 'male', value: 0}, {text: 'female', value: 1}]
          },
          {
            key: 'sexFn', type: 'input', inputType: 'select', flex: 'md6',
            options: (formState) => {
              return [{text: 'male', value: 0}, {text: 'female', value: 1}];
            }
          },
          {key: 'date', type: 'input@datetime-local', flex: 'md6'},
          {
            key: 'address', type: 'object',
            fields: [{key: 'street', type: 'input', flex: 'md6'}, {key: 'city', type: 'input', flex: 'md6'},]
          },
          {
            key: 'addressArray1', type: 'array', label: 'Address',
            fields: [{key: 'street', type: 'input', flex: 'md6'}, {key: 'city', type: 'input', flex: 'md6'},]
          },
          {
            key: 'addressArray2', type: 'array', label: 'Address',
            fields: [{type: 'input', flex: 'md12'}]
          },
          {
            key: 'addressArray3', type: 'tableArray', label: 'Address',
            fields: [{key: 'street', type: 'input', flex: 'md6'}, {key: 'city', type: 'input', flex: 'md6'},]
          },
          {
            key: 'layout', type: 'choice', choiceKey: 'layoutType',
            fields: [{
              key: 'linear', type: 'object',
              fields: [{key: 'linearName', type: 'input', flex: 'md12'}]
            }, {
              key: 'grid', type: 'object',
              fields: [{key: 'gridName', type: 'input', flex: 'md12'}]
            }]
          },
          {
            key: 'layout2', type: 'choiceArray', label: 'Layout', choiceKey: 'choiceArray',
            fields: [{
              choiceName: 'linear', type: 'object',
              fields: [{key: 'linearName', type: 'input', flex: 'md12'}]
            }, {
              choiceName: 'grid', type: 'object',
              fields: [{key: 'gridName', type: 'input', flex: 'md12'}]
            }]
          }, {
            key: 'layout3', type: 'choice', choiceKeyOutside: true, choiceKey: 'type',
            fields: [{
              //todo: use choiceName instead of key
              choiceName: 'linear', type: 'object',
              fields: [{key: 'linearName', type: 'input', flex: 'md12'}]
            }, {
              choiceName: 'grid', type: 'object',
              fields: [{key: 'gridName', type: 'input', flex: 'md12'}]
            }]
          }, {
            //todo: remove key
            key: 'options', type: 'choice', choiceKeyOutside: true, choiceKey: 'optionsChoice',
            fields: [{
              choiceName: 'simple', type: 'array',
              fields: [{key: 'simple', type: 'input', flex: 'md12'}]
            }, {
              choiceName: 'textValue', type: 'tableArray',
              fields: [{key: 'text', type: 'input', flex: 'md12'}, {key: 'value', type: 'input', flex: 'md12'}]
            }]
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
	.keyboard-container {
		display: grid;
		/*@formatter:off*/
		grid-template:
				'header header header header' 1fr
				'step step step step' 0.9fr
				'input input input input' 0.7fr
				'btn7 btn8 btn9 bsp' 1fr
				'btn4 btn5 btn6 abc' 1fr
				'btn1 btn2 btn3 ok' 1fr
				'logout btn0 cancel ok' 1fr/
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
