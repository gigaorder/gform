import { _fields, getChoiceName, getLabel, getFields } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

function genChoice({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, fieldModel }) {
  const choiceKey = node.choiceKey || 'choice'
  const choiceExist = function () {
    if (node.choiceKeyOutside) return !!fieldModel[choiceKey];
    if (!fieldModel[node.key]) return false;
    return !!fieldModel[node.key][choiceKey];
  }();
  const choiceBtnPrepend = function () {
    if (node.choiceKeyOutside) return 'Choose';
    return 'Add'
  }()


  function removeChoice() {
    if (node.choiceKeyOutside) {
      const fields = node.fields;
      fields && fields.map(v => v.key).forEach(k => {
        delete fieldModel[k];
      })
      if (fieldModel[node.key]) fieldModel[node.key] = null;
      fieldModel[choiceKey] = null;
    } else {
      fieldModel[node.key] = null;
    }
  }

  function removeChoiceBtnFn() {
    return !node.inArray && <v-btn depressed small color="gray" vOn:click={removeChoice}>
      <v-icon>delete_outline</v-icon>
    </v-btn>
  }

  function actionBtn() {
    return <v-btn small depressed className="remove-btn" vOn:click={removeChoice}>
      <v-icon>delete</v-icon>
    </v-btn>
  }

  return <render-v-nodes>
    {choiceExist && <v-flex xs12>
      {childrenVNodes.map(render => render({
        'btn-append': removeChoiceBtnFn(),
        onRemove: node.inArray ? slots.onRemove : removeChoice
      }))}
    </v-flex>}
    {!choiceExist && <v-menu offset-y z-index="1000">
      <v-btn slot="activator" color="blue lighten-2" outline small>
        {choiceBtnPrepend} {getLabel(node)}
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
      <v-list>
        {_fields(node).map((choice, index) =>
          <v-list-tile key={index} vOn:click={() => {
            if (node.choiceKeyOutside) {
              fieldModel[choiceKey] = getChoiceName(choice)
            } else {
              fieldModel[node.key][choiceKey] = getChoiceName(choice)
            }
          }}>
            <v-list-tile-title>{getChoiceName(choice)}</v-list-tile-title>
          </v-list-tile>)
        }
      </v-list>
    </v-menu>}
  </render-v-nodes>
}

const ChoiceHandler = class {
  constructor(context, rootPath) {
    this.context = context;
    this.rootPath = rootPath;
  }

  rule(node) {
    return node.type === 'choice'
  }

  itemChildren(node, { isNodeRootArray, path }, { rootModel, getValue }) {
    const value = getValue();
    const choiceKey = node.choiceKey || 'choice';
    const _fields = getFields.bind(this)(node);
    let field = _.cloneDeep(_fields.find(field => (field.key || field.choiceName) === value[choiceKey]));
    if (!field) return null;
    if (field.type === 'object') {
      field.label = field.label || field.key || field.choiceName;
      delete field.key;
    } else if (field.type === 'array') {
      field.label = field.label || field.key || field.choiceName;
      field.key = node.key;
    } else {
      field.key = node.key;
    }
    return [field]
  }

  genNode = genChoice

  genDefaultValue(node) {
    if (!node.choiceKeyOutside) return {};
  }

  itemPath(node, { key, path, isRoot }) {
    if (node.choiceKeyOutside) return null;
  }
}
export default ChoiceHandler;
