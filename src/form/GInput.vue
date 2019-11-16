<template>
	<v-flex :class="[flex,paddingClass]" v-if="inputType === 'switch'">
		<v-switch color="success" :label="field.tableCell ? '': label" v-model="internalValue"/>
	</v-flex>
	<v-flex :class="[flex,paddingClass]" v-else-if="inputType === 'checkbox'">
		<v-checkbox color="success" :label="field.tableCell ? '': label" v-model="internalValue"/>
	</v-flex>
	<v-flex :class="[flex,paddingClass]" v-else-if="inputType === 'select' || inputType === 'select:number'">
		<component :is="field.notOnlyValueInOptions ? 'v-combobox': 'v-autocomplete'" v-model="internalValue" :items="options"
							 :item-text="field.itemText" :item-value="field.itemValue"
							 :chips="field.chips" :small-chips="field.chips"
							 :label="field.tableCell ? '': label" clearable
							 @change="onChange"
							 :return-object="!!field.returnObject"
							 :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
			<v-icon slot="append" v-if="inArray" @click.stop="removeField">delete_outline</v-icon>
		</component>
	</v-flex>
	<v-flex :class="[flex,paddingClass]"
					v-else-if="inputType === 'multiSelect' || inputType === 'multiSelect:number'">
		<v-combobox
				v-model="internalValue"
				:item-text="field.itemText" :item-value="field.itemValue"
				:items="options"
				hide-selected
				:label="field.tableCell ? '': label"
				multiple
				small-chips
				deletable-chips
				:return-object="!!field.returnObject"
				:menu-props="{'z-index': 1000, 'closeOnContentClick': true}"
		>
			<v-icon slot="append" v-if="inArray" @click.stop="removeField">delete_outline</v-icon>
		</v-combobox>
	</v-flex>
	<input v-else-if="field.tableCell" :type="inputType" v-model="internalValue"
				 class="form-control">
	<v-flex :class="[flex,paddingClass]" v-else>
		<v-text-field v-model="internalValue" :label="label" :type="inputType">
			<v-icon slot="append" v-if="field.addable" style="opacity: 0.4" @click.stop="clearValue()">clear</v-icon>
			<v-icon slot="append" v-if="inArray" @click.stop="removeField">delete_outline</v-icon>
		</v-text-field>
	</v-flex>
</template>
<script>
  //not required but this baseField has a lot of useful stuff already in it, check it out
  import { Fragment } from 'vue-fragment';
  import { upperFirst, get } from 'lodash-es';
  import { VFlex, VSwitch, VSelect, VTextField, VIcon } from 'vuetify/lib';
  import dayjs from 'dayjs'

  const _ = { upperFirst, get };

  export default {
    components: { Fragment, VFlex, VSwitch, VSelect, VTextField, VIcon },
    name: 'GInput',
    props: ['model', 'field', 'inArray', 'noFlex', 'rootModel', 'path', 'noLayout'],
    computed: {
      paddingClass() {
        return this.field.tableCell ? 'px-0' : 'px-2';
      },
      internalValue: {
        get() {
          try {
            if (this.inputType === 'date') {
              return this.model[this.field.key] && dayjs(this.model[this.field.key]).format('YYYY-MM-DD');
            } else if (this.inputType === 'datetime-local') {
              return this.model[this.field.key] && dayjs(this.model[this.field.key]).format('YYYY-MM-DD[T]HH:mm');
            }
          } catch (e) {
          }
          return this.model[this.field.key];
        },
        set(v) {
          if (this.inputType.includes('number')) {
            this.$set(this.model, this.field.key, parseFloat(v))
          } else if (this.inputType === 'date') {
            this.$set(this.model, this.field.key, new Date(v + 'T00:00:00'))
          } else if (this.inputType === 'datetime-local') {
            this.$set(this.model, this.field.key, new Date(v))
          } else {
            this.$set(this.model, this.field.key, v)
          }
        }
      },
      inputType() {
        if (this.field.type.includes('@')) {
          return this.field.type.split('@')[1];
        }
        return _.get(this.field, 'inputType', 'text');
      },
      label() {
        if (this.field.label) {
          return this.field.label;
        }
        return _.upperFirst(this.field.key);
      },
      options() {
        if (typeof this.field.options === 'function') {
          return this.field.options(this);
        }
        if (this.inputType.includes('number')) {
          return this.field.options.map(opt => {
            if (typeof opt === 'object') return Object.assign(opt, { value: parseFloat(opt.value) });
            return parseFloat(opt);
          });
        }
        return this.field.options;
      },
      flex() {
        return this.noLayout ? 'xs12' : this.field.flex;
      }
    },
    created() {
      if (this.field.default && typeof this.field.default !== 'function' && !this.model[this.field.key]) {
        if (this.inputType.includes('number')) {
          this.$set(this.model, this.field.key, parseFloat(this.field.default));
        } else {
          this.$set(this.model, this.field.key, this.field.default);
        }
      } else if (this.field.default && typeof this.field.default === 'function' && !this.model[this.field.key]) {
        this.$set(this.model, this.field.key, this.field.default());
      } else if (!this.model.hasOwnProperty(this.field.key)) {
        this.$set(this.model, this.field.key, undefined);
      }
    },
    methods: {
      clearValue() {
        this.model[this.field.key] = undefined;
      },
      onChange(e) {
        if (this.field.onChange) {
          this.field.onChange(e, this.rootModel, this.model);
        }
      },
      removeField() {
        //this.model.splice(this.field.key, 1);
        this.$emit('remove-field');
      }
    },
    inject: {
      //noLayout: { default: null }
    }
  };
</script>

<style lang="scss">
	@import "~bootstrap/scss/functions";
	@import "~bootstrap/scss/variables";
	@import "~bootstrap/scss/mixins";
	@import "~bootstrap/scss/forms";

	.v-input--switch .v-input__slot {
		margin-bottom: 0 !important;
	}

	.v-input--selection-controls {
		margin-top: 20px !important;
	}

	.v-text-field.v-text-field--solo .v-input__control {

	}

	.v-select__slot {
		.v-input__icon--clear .v-icon {
			color: #d3d3d3 !important;
		}
	}

	table tr:not(.g-expansion) {
		.v-select__slot {
			//height: calc(2.25rem + 2px);
			padding-left: 10px;
			border-radius: 4px;
			border: 1px solid #0000002e;
			background-color: white;

			.v-input__icon--clear {
				display: none !important;
				color: #d3d3d3 !important;
			}

			input {
				font-size: 1rem;
			}

			.v-input__icon.v-input__icon--append {
				width: 12px !important;
				min-width: 12px;
				padding-right: 9px;
			}
		}

		.v-input__slot {
			&:before {
				border: none !important;
			}
		}

		.v-select {
			padding-top: 4px;
		}

		.v-text-field__details {
			display: none;
		}
	}
</style>
