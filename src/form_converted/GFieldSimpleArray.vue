<script>
export default {
  setup() {
    return () => <>
      {model[field.key].map((val, index) =>
          <g-col xs12 key={index}>
            <g-field onRemoveField={() => internalModel.splice(index, 1)} inArray={true} noLayout={false} path={genPath(field.key)} rootModel={rootModel} field={createArrayField(field.fields, index)} model={model[field.key]}></g-field>
          </g-col>
      )}
      <g-col xs12>
        <g-btn textcolor="blue lighten-2" outlined small onClick={() => addItem()}>
          Add {label}
        </g-btn>
        <slot name="btn-append"></slot>
      </g-col>
    </>
  }
}
</script>

<style scoped>

</style>
