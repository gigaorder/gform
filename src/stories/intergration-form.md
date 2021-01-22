### use case:

test + integration
vd general setting + users
mục tiêu là can thiệp và lúc render tiếp ra dynamic component thì có thể thay đổi behaviour
như vậy có thể render ra 1 thứ bất kỳ
hoặc là điểm mà sắp xếp layout của các fields : -> cũng có thể thay đổi behaviour đc tốt
cho đến wrapper v.v

1. adapter dành cho form và layout

manifest
form: high order:
form: users :array -> how to get from collection -> write query
add, remove ?? -> write or gen query auto (code editor)
tạo fields mới 
rồi v.v

```jsx
const Hooks = require('schemahandler/hooks/hooks')
const hooks = new Hooks();

const form = <g-field hooks={hooks} />

hooks.on('model:root:begin', async function (model) {
  const users = await orm('User').find({});
  model.push(...users);
})

hooks.on('model:root:add', async function (model, item) {
  const users = await orm('User').create(item);
  this.setValue(users);
})

hooks.on('model:root:remove', async function (model, item) {
  const users = await orm('User').remove({_id: item._id});
})

hooks.on('render:root', function () {
})



//dạng test factory : như làm sao để build 1 file json
```
