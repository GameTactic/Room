import Vue from 'vue'
import { Field, Item } from '@/types/Games/Index'

export default class Games extends Vue {
  // eslint-disable-next-line
  resolve = (path: string, gameData: any) => path.split('.').reduce((prev: any, curr: any) => prev ? prev[curr] : '', gameData || self)

  findField = (fields: Field[], clickedFieldId: string): Field | undefined => fields.find((field: Field): boolean => field.id === clickedFieldId)

  findEntity = (entities: Item[], selectedEntityId: number): Item | undefined => entities.find((entity: Item): boolean => entity.value === selectedEntityId)

  onTextFieldChangeHandler = (entities: Item[], selectedEntityId: number, field: Field, value: string): void => {
    const foundEntity = this.findEntity(entities, selectedEntityId)
    if (foundEntity) {
      foundEntity.data = { ...foundEntity.data, [field.id]: value }
      field.value = value
    }
  }

  updateField = (fields: Field[], clickedEntity: Item, fieldId: string, property: string, isRate = false) => {
    const propertyValue = this.resolve(property, clickedEntity.data)
    const updatedFieldValue = clickedEntity.data?.[fieldId] || ''
    const foundField = this.findField(fields, fieldId)
    if (foundField) {
      if (updatedFieldValue) {
        foundField.value = updatedFieldValue
      } else {
        if (propertyValue) {
          foundField.value = isRate ? String(Math.floor((60 / propertyValue) * 10) / 10) : propertyValue
        } else {
          foundField.value = ''
        }
        clickedEntity.data = { ...clickedEntity.data, [fieldId]: foundField.value }
      }
    }
  }
}
