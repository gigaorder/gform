<!--<template>
	<v-app>
		<v-layout row wrap style="width: 70%;padding: 20px">
			<g-field :fields="fields" :model="model" :tabs="tabs"></g-field>
			<br><br>
			<div>
				{{model}}
			</div>
		</v-layout>
	</v-app>
</template>-->

<script>
  //import _ from 'lodash';
  //import {VApp} from 'vuetify/lib';
  import GForm from '../main';
  //import GForm from '../../dist/GForm.umd';
  import Vue from 'vue';
  import { Fragment } from 'vue-fragment';
  import {
    VTabs,
    VTab,
    VTabItem,
    VLayout,
    VFlex,
    VMenu,
    VBtn,
    VList,
    VListTile,
    VListTileTitle,
    VIcon,
    VExpandTransition
  } from 'vuetify/lib';
  import RenderVNodes from '../components/RenderVNodes';
  import TestLayout from './TestLayout';


  Vue.use(GForm);

  export default {
    name: 'form-story2',
    components: {
      Fragment, VTabs, VTab, VTabItem, VLayout, VFlex,
      VMenu, VBtn, VList, VListTile, VListTileTitle, VIcon,
      RenderVNodes, VExpandTransition, TestLayout
    },
    data() {
      return {
        dialog: false,
        model: {
          deep: {
            name: 'test',
            //nr: 3,
            //addressArray0: {},
            /*addressArray1: [
							{ street: 'a1', city: 'b1' },
							{ street: 'a2', city: 'b2' }
						],*/
            //addressArray2: ['a', 'b'],
            addressArray3: [
              { street: 'a1', city: 'b1' },
              { street: 'a2', city: 'b2' }
            ],
            /*layout: {
							layoutType: 'linear',
							linearName: 'linear1'
						},*/
            //choice at root
            type: 'linear',
            linearName: 'test',
            /*optionsChoice: "simple",
						options: [ "a", "v" ]*/
            /*layout2: [
							{ type: 'linear', linearName: 'asdf' },
							{ type: 'grid', gridName: 'asdf' }
						]*/
          }
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
          { key: 'name', type: 'input', flex: 'md6', default: 'name' },
          { key: 'nr', type: 'input@number', flex: 'md6', addable: true},
          { key: 'switch', type: 'input', inputType: 'switch', flex: 'md6' },
          {
            key: 'sex', type: 'input', inputType: 'select', flex: 'md6',
            options: [{ text: 'male', value: 0 }, { text: 'female', value: 1 }]
          },
          {
            key: 'sexFn', type: 'input', inputType: 'select', flex: 'md6',
            options: (formState) => {
              return [{ text: 'male', value: 0 }, { text: 'female', value: 1 }];
            }
          },
          { key: 'date', type: 'input@datetime-local', flex: 'md6' },
          {
            key: 'address', type: 'object',
            fields: [{ key: 'street', type: 'input', flex: 'md6' }, { key: 'city', type: 'input', flex: 'md6' },]
          },
          /*{
            key: 'addressArray0', type: 'object', label: 'Address0',
            noPanel: true,
            fields: [{ key: 'street', type: 'input', flex: 'md6' }, { key: 'city', type: 'input', flex: 'md6' },]
          },*/
          {
            key: 'addressArray1', type: 'array', label: 'Address1',
            fields: [{ key: 'street', type: 'input', flex: 'md6' }, { key: 'city', type: 'input', flex: 'md6' },]
          },
          {
            key: 'addressArray2', type: 'array', label: 'Address2',
            fields: [{ type: 'input', flex: 'md12' }]
          },
          {
            key: 'addressArray3', type: 'tableArray', label: 'Address3',
            fields: [{ key: 'street', type: 'input', flex: 'md6' }, { key: 'city', type: 'input', flex: 'md6' },]
          },
          {
            key: 'layout', type: 'choice', choiceKey: 'layoutType',
            fields: [{
              key: 'linear', type: 'object',
              fields: [{ key: 'linearName', type: 'input', flex: 'md12' }]
            }, {
              key: 'grid', type: 'object',
              fields: [{ key: 'gridName', type: 'input', flex: 'md12' }]
            }]
          },
          {
            key: 'layout2', type: 'choiceArray', label: 'Layout', choiceKey: 'type',
            fields: [{
              choiceName: 'linear', type: 'object',
              fields: [{ key: 'linearName', type: 'input', flex: 'md12' }]
            }, {
              choiceName: 'grid', type: 'object',
              fields: [{ key: 'gridName', type: 'input', flex: 'md12' }]
            }]
          },
          {
            key: 'layout3', type: 'choice', choiceKeyOutside: true, choiceKey: 'type',
            fields: [{
              //todo: use choiceName instead of key
              choiceName: 'linear', type: 'object',
              fields: [{ key: 'linearName', type: 'input', flex: 'md12' }]
            }, {
              choiceName: 'grid', type: 'object',
              fields: [{ key: 'gridName', type: 'input', flex: 'md12' }]
            }]
          },
          {
            //todo: remove key
            key: 'options', type: 'choice', choiceKeyOutside: true, choiceKey: 'optionsChoice',
            fields: [{
              choiceName: 'simple', type: 'array',
              fields: [{ key: 'simple', type: 'input', flex: 'md12' }]
            }, {
              choiceName: 'textValue', type: 'tableArray',
              fields: [{ key: 'text', type: 'input', flex: 'md12' }, { key: 'value', type: 'input', flex: 'md12' }]
            }]
          }
        ]
      }
    },
    setup(props, context) {
      const genComp = function () {
        const fields = this.fields;
        const model = this.model;
        const _fields = <g-field path="deep" tabs={this.tabs} fields={fields} propsModel={model}></g-field>
        /*{_fields.map((field, index) => {
					const path = field.data.attrs.path;
					return <template slot={path}>{field}</template>
				})}*/
        /*const content = <test-layout>
          {_fields}
        </test-layout>*/

        return <v-app>
          <v-layout row wrap style="width: 90%;padding: 20px">
            {_fields}
            <br/><br/>
            <v-flex xs12>
              <div>
                {JSON.stringify(model)}
              </div>
            </v-flex>
          </v-layout>
        </v-app>
      }
      return {
        genComp
      }
    },
    render(h) {
      //const { fields, model, tabs } = this;
      return this.genComp.bind(this)();
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
