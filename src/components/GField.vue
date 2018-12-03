<template>
  <fragment>
    <fragment v-if="tabs">
      <v-tabs style="width: 100%">
        <v-tab v-for="tab in getTabs()" :key="tab.name">{{tab.name}}</v-tab>
        <v-tab-item v-for="tab in getTabs()" :key="tab.name" style="padding-top: 20px;">
          <v-layout row wrap>
            <g-field v-for="(_field, index) in tab.fields" :key="index" :field="_field" :model="model"></g-field>
          </v-layout>
        </v-tab-item>
      </v-tabs>
    </fragment>

    <fragment v-else-if="fields">
      <v-layout row wrap>
        <g-field v-for="(_field, index) in fields" :key="index" :field="_field" :model="model"></g-field>
      </v-layout>
    </fragment>

    <component v-else-if="!isArray && !isObject && !isChoice && !isChoiceArray" :is="type" :field="field" :model="model"
               v-on="$listeners">
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>
    </component>

    <fragment v-else-if="isChoiceArray">
      <div style="width: 100%">
        <v-layout row wrap>
          <v-flex class="md12" v-for="(val, index) in model[field.key]" :key="index">
            <g-field @remove-field="model[field.key].splice(index, 1)" :in-array="true"
                     :field="createChoiceArrayField(index)" :model="model[field.key]"></g-field>
          </v-flex>
        </v-layout>
      </div>
      <div style="width: 100%">
        <v-menu offset-y v-if="!inArray" z-index="1000">
          <v-btn slot="activator" color="white" small>
            Add {{getLabel(field)}} <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(choice, index) in field.choices" :key="index" @click="selectChoiceInArray(choice)">
              <v-list-tile-title>{{ choice.key }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </fragment>

    <fragment v-else-if="isChoice">
      <div style="width: 100%">
        <div v-if="model[field.key].choice">
          <g-field :field="createChoiceField()" :model="model[field.key]">
            <template slot="action">
              <v-btn small depressed class="remove-btn" @click="removeChoice()">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
          </g-field>
        </div>
      </div>
      <div style="width: 100%">
        <v-menu offset-y v-if="!inArray && !model[field.key].choice" z-index="1000">
          <v-btn slot="activator" color="white" small>
            Add {{getLabel(field)}} <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(choice, index) in field.choices" :key="index" @click="selectChoice(choice)">
              <v-list-tile-title>{{ choice.key }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </fragment>

    <fieldset v-else-if="isObject">
      <slot name="action"/>
      <legend v-if="label">
        <span>{{label}}</span>
      </legend>

      <v-layout row wrap style="padding-top: 5px;">
        <g-field :fields="field.fields" :model="model[field.key]"/>
      </v-layout>
    </fieldset>

    <fragment v-else-if="isSimpleArray">
      <v-layout row wrap>
        <v-flex class="xs12" v-for="(val, index) in model[field.key]" :key="index">
          <g-field @remove-field="model[field.key].splice(index, 1)"
                   :field="createArrayField(field.field, index)" :model="model[field.key]"></g-field>
        </v-flex>
      </v-layout>
      <v-flex class="xs12">
        <v-btn color="primary" small @click="addItem()">
          Add {{getLabel(field)}}
        </v-btn>
      </v-flex>
    </fragment>

    <fragment v-else-if="isObjectArray">
      <v-layout row wrap>
        <div v-for="(val, index) in model[field.key]" :key="index" style="width: 100%; position: relative;">
          <v-btn small depressed class="remove-btn" @click="model[field.key].splice(index, 1)">
            <v-icon>delete</v-icon>
          </v-btn>
          <g-field :field="createObjectArrayField(field.fields, index)" :model="model[field.key]"></g-field>
        </div>
      </v-layout>
      <v-flex class="md12">
        <v-btn color="primary" small @click="addObjectItem()">
          Add {{getLabel(field)}}
        </v-btn>
      </v-flex>
    </fragment>

    <fragment v-else-if="isTableArray">
      <table class="v-datatable v-table theme--light">
        <thead>
        <tr>
          <th v-for="_field in field.fields">{{getLabel(_field)}}</th>
          <th>X</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(val, index) in model[field.key]" :key="index" class="text-md-center">
          <td v-for="_field in field.fields" class="input-group-sm">
            <g-field :field="makeTableCell(_field)" :model="model[field.key][index]"/>
          </td>
          <td><v-icon @click="model[field.key].splice(index, 1)">delete</v-icon></td>
        </tr>
        </tbody>
      </table>
      <v-btn small depressed class="white add-btn" @click="addObjectItem()">Add {{getLabel(field)}}</v-btn>
    </fragment>
  </fragment>


</template>

<script>
  import {Fragment} from "vue-fragment";
  import {upperFirst, filter, values, assign, cloneDeep, map} from "lodash";
  const _ = {upperFirst, filter, values, assign, cloneDeep, map};

  import {VTabs, VTab, VTabItem, VLayout, VFlex, VMenu, VBtn, VList, VListTile, VListTileTitle, VIcon} from 'vuetify/lib';
  import Vue from 'vue';

  export default {
    components: {
      Fragment, VTabs, VTab, VTabItem, VLayout, VFlex,
      VMenu, VBtn, VList, VListTile, VListTileTitle, VIcon
    },
    name: "GField",
    props: ['model', 'fields', 'field', 'tabs', 'inArray'],
    computed: {
      isChoiceArray() {
        return !!(this.field && this.field.type === 'choiceArray');
      },
      isArray() {
        return !!(this.field && (this.field.type === 'array' || this.field.type === 'tableArray'));
      },
      isSimpleArray() {
        return !!(this.field && this.field.type === 'array' && this.field.field);
      },
      isObjectArray() {
        return !!(this.field && this.field.type === 'array' && this.field.fields);
      },
      isChoice() {
        return !!(this.field && this.field.type === 'choice');
      },
      isObject() {
        return !!(this.field && this.field.type === 'object');
      },
      isTableArray() {
        return !!(this.field && this.field.type === 'tableArray');
      },
      isTableCellObject() {
        return false;
      },
      label() {
        if (this.field.label) return this.field.label;
        return _.upperFirst(this.field.key);
      },
      type() {
        return Vue.$gform.mapping[this.field.type];
      }
    },
    methods: {
      getTabs() {
        const basic = _.filter(this.fields, f => ![].concat(..._.values(this.tabs)).includes(f.key)).map(f => f.key);
        return _.map(_.assign({}, {basic}, this.tabs), (tabFields, name) => {
          return {name, fields: _.filter(this.fields, f => tabFields.includes(f.key))};
        });
      },
      createHeaders() {
        return this.field.fields.map(f => _.assign(f, {sortable: false}));
      },
      createArrayField(field, $index) {
        return _.assign(_.cloneDeep(field), {key: $index, arrayItem: true, label: this.label});
      },
      createObjectArrayField(fields, index) {
        return {key: index, type: 'object', label: this.field.label, fields}
      },
      createChoiceArrayField(index) {
        return {key: index, type: 'choice', label: this.field.label, choices: this.field.choices}
      },
      createChoiceField() {
        return this.field.choices.find(choice => choice.key === this.model[this.field.key].choice);
      },
      addItem() {
        this.model[this.field.key].push(null);
      },
      addObjectItem() {
        this.model[this.field.key].push({});
      },
      makeTableCell(field) {
        return _.assign(field, {tableCell: true})
      },
      getLabel(field) {
        if (field.label) return field.label;
        return _.upperFirst(field.key);
      },
      selectChoice(choice) {
        this.model[this.field.key].choice = choice.key;
      },
      selectChoiceInArray(choice) {
        this.model[this.field.key].push({choice: choice.key});
      },
      removeChoice() {
        if (this.inArray) {
          this.$emit('remove-field');
        } else {
          this.model[this.field.key].choice = null
        }
      }
    },
    created() {
      //make sure that the 'value' is always set
      const setProperty = field => {
        if (typeof this.model[field.key] === 'undefined') {
          if (field.type === 'object') this.$set(this.model, field.key, {});
          else if (field.type === 'choice') this.$set(this.model, field.key, {choice: null});
          else if (['array', 'tableArray', 'choiceArray'].includes(field.type)) this.$set(this.model, field.key, []);
          else this.$set(this.model, field.key, null);
        }
      }

      if (this.fields) this.fields.forEach(setProperty);
      else if (!this.fields && this.field) setProperty(this.field)
    }
  }
</script>

<style scoped lang="scss">
  .v-datatable.v-table thead tr {
    height: 40px;
  }

  .v-datatable.v-table tbody td {
    height: 44px;
  }

  .theme--light.v-table {
    //background-color: transparent;
  }

  fieldset {
    padding: 0 10px 10px 10px;
    position: relative;
    top: 0;
    border: 1px solid #eee;
    border-radius: 4px;
    background-color: rgba(128, 128, 128, 0.03);
    width: 100%;
    margin-bottom: 20px;
  }

  legend {
    color: #337ab7;
    border: 0;
    margin-left: 10px;
    width: initial;
    padding: 0 5px;
    font-size: 1.4em;
    font-weight: 300;
  }

  .add-btn {
    margin-left: 0;
    box-shadow: 0 1px 1px 0 #9c9c9c;
  }

  .remove-btn {
    position: absolute;
    right: 0;
    top: 14px;
    margin: 0;
    font-size: 1.3em;
    padding: 0px;
    min-width: 32px;
    width: 32px;
    border: 1px solid #eaeaea;
    background-color: #f9f9f9 !important;
    z-index: 10;
    height: 23px;

    .v-icon {
      font-size: 0.9em;
      color: #6d6d6d;
    }
  }

</style>
