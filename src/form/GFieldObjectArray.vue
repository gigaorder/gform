<template>
	<v-flex xs12>
		<v-layout row wrap>
			<v-flex :class="[flex, flex !== 'xs12' ? 'fix-inline': '']" v-for="(val, index) in model[field.key]" :key="index"
							style="position: relative;">
				<g-field-object :field="createObjectArrayField(field.fields, index)" :model="model[field.key]"
												:in-array="true" :rootModel="rootModel" :path="genPath(field.key)">
					<v-btn slot="action" small depressed class="remove-btn" @click="model[field.key].splice(index, 1)">
						<v-icon>delete</v-icon>
					</v-btn>
				</g-field-object>
			</v-flex>
		</v-layout>
		<v-btn color="blue lighten-2" outline small @click="addObjectItem()" v-if="!field.addable">
			Add {{getLabel(field)}}
		</v-btn>
	</v-flex>
</template>

<script>
  import { _fieldsFactory, _modelFactory, addObjectItem, flexFactory, genPath, getLabel, labelFactory } from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldObjectArray',
    props: ['model', 'field', 'rootModel', 'path'],
    data: function () {
      return {}
    },
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);
      const _fields = _fieldsFactory(props);

      return { _model, flex, label, _fields }
    },
    computed: {},
    methods: {
      genPath,
      getLabel,
      addObjectItem,
      createObjectArrayField(fields, index) {
        return { key: index, type: 'object', label: this.label, fields };
      },
    }
  }
</script>

