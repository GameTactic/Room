import Vue from 'vue'
import { ShipField } from '@/types/Games/Wows'
import { SavedField } from '@/types/Games/Index'

export default class Games extends Vue {
  resolve = (path: string, gameData: any) => path.split('.').reduce((prev: any, curr: any) => prev ? prev[curr] : '', gameData || self)

  findField = (fields: ShipField[], clickedFieldId: string): ShipField | undefined => fields.find((field: ShipField): boolean => field.id === clickedFieldId)

  determinePrependIcon = (fields: ShipField[], clickedField: ShipField): string => {
    const foundField = this.findField(fields, clickedField.id)
    if (foundField && foundField.canvas.showIcon) {
      return foundField.canvas.isVisible ? 'fa-eye-slash' : 'fa-eye'
    }
    return ''
  }

  onViewFieldHandler = (fields: ShipField[], clickedField: ShipField): void => {
    const foundField = this.findField(fields, clickedField.id)
    if (foundField) {
      foundField.canvas.isVisible = !foundField.canvas.isVisible
      foundField.saved = false
    }
  }

  onSaveFieldHandler = (fields: ShipField[], savedFields: SavedField[], field: ShipField, selectedEntityId: string): void => {
    const foundField = this.findField(fields, field.id)
    if (foundField) {
      foundField.saved = true
    }
    const foundSavedField = savedFields.find((savedField: SavedField) => savedField.entityId === selectedEntityId && savedField.fieldId === field.id)
    if (foundSavedField) {
      foundSavedField.value = field.value
      foundSavedField.canvasIsVisible = field.canvas.isVisible
      foundSavedField.canvasShowIcon = field.canvas.showIcon
    } else {
      savedFields.push({
        entityId: selectedEntityId,
        fieldId: field.id,
        value: field.value,
        canvasIsVisible: field.canvas.isVisible,
        canvasShowIcon: field.canvas.showIcon
      })
    }
  }

  onTextFieldChangeHandler = (fields: ShipField[], field: ShipField, value: string): void => {
    const foundField = this.findField(fields, field.id)
    if (foundField) {
      foundField.value = value
      foundField.saved = false
    }
  }

  updateField = (fields: ShipField[], gameData: any, fieldName: string, property: string, isRate = false) => {
    const propertyValue = this.resolve(property, gameData)
    const foundField = this.findField(fields, fieldName)
    if (foundField) {
      if (propertyValue) {
        foundField.value = isRate ? String(Math.floor((60 / propertyValue) * 10) / 10) : propertyValue
        foundField.hide = false
      } else {
        foundField.hide = true
      }
      foundField.saved = undefined
    }
  }

  fieldSavedColour = (field: ShipField): string => {
    return field.saved === undefined ? 'grey' : field.saved ? 'green' : 'red'
  }
}
