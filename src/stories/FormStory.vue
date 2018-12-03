<template>
	<v-app>
		<div style="width: 50%;padding: 20px">
			<v-dialog v-model="dialog" persistent width="900px">
				<v-btn slot="activator" icon><v-icon>add_circle</v-icon></v-btn>
				<v-card>
					<v-card-title>
						<span class="headline">Form</span>
					</v-card-title>
					<v-card-text v-if="dialog">
						<v-select
								:items="['0-17', '18-29', '30-54', '54+']"
								label="Age*"
								required
						></v-select>

						<g-field :fields="fields" :model="model" :tabs="tabs"></g-field>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="green darken-1" flat="flat" @click="dialog = false">Disagree</v-btn>
						<v-btn color="green darken-1" flat="flat" @click="dialog = false">Agree</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<br><br>
			<div>
				{{model}}
			</div>
		</div>
	</v-app>
</template>

<script>
   import _ from 'lodash';
   import {VApp} from 'vuetify/lib';
   import GForm from '../main';
   //import GForm from '../../dist/GForm.umd';
   import Vue from "vue";

   Vue.use(GForm);

   export default {
      name: 'form-story',
      components: {VApp},
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
                  key: 'address', type: 'object',
                  fields: [{key: 'street', type: 'input', flex: 'md6'}, {key: 'city', type: 'input', flex: 'md6'},]
               },
               {
                  key: 'addressArray1', type: 'array', label: 'Address',
                  fields: [{key: 'street', type: 'input', flex: 'md6'}, {key: 'city', type: 'input', flex: 'md6'},]
               },
               {
                  key: 'addressArray2', type: 'array', label: 'Address',
                  field: {type: 'input', flex: 'md12'}
               },
               {
                  key: 'addressArray3', type: 'tableArray', label: 'Address',
                  fields: [{key: 'street', type: 'input', flex: 'md6'}, {key: 'city', type: 'input', flex: 'md6'},]
               },
               {
                  key: 'layout', type: 'choice', choices: [{
                     key: 'linear', type: 'object',
                     fields: [{key: 'linearName', type: 'input', flex: 'md12'}]
                  }, {
                     key: 'grid', type: 'object',
                     fields: [{key: 'gridName', type: 'input', flex: 'md12'}]
                  }]
               },
               {
                  key: 'layout2', type: 'choiceArray', label: 'Layout', choices: [{
                     key: 'linear', type: 'object',
                     fields: [{key: 'linearName', type: 'input', flex: 'md12'}]
                  }, {
                     key: 'grid', type: 'object',
                     fields: [{key: 'gridName', type: 'input', flex: 'md12'}]
                  }]
               },
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
