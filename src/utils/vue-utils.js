
import { withScopeId, getCurrentInstance } from 'vue'
export function genScopeId(render, currentInstance) {
  if (render) {
    return withScopeId((currentInstance || getCurrentInstance()).type['__scopeId'])(render);
  }
  return {[(currentInstance || getCurrentInstance()).type['__scopeId']]: ''};
}

export function execGenScopeId(render, currentInstance) {
  return genScopeId(render, currentInstance)()
}
