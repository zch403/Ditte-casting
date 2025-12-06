export interface FormDTO {
  id: number;
  title: string;
  fields: FormFieldDTO[];
  isActive: boolean;
}
export interface FormFieldDTO {
  label: string;
  type: string;
  isRequired: boolean;
  conditionsWhereTrigger: ConditionDTO[];
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

export interface ConditionDTO {
    operator: string;
    value: string;
    targets: ConditionTargetDTO[];
}

export interface ConditionTargetDTO {
    fieldOrderIndex: number;
}