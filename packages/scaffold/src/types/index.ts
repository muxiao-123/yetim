export type ColorFunc = (str: string | number) => string
export interface Template {
  name: string
  display: string
  color: ColorFunc
  templateUI?: TemplateUI[]
}
export interface TemplateUI {
  name: string
  display: string
  color: ColorFunc
  // link?: `https://${string}`
  // customCommand?: string
}
export type Callbacks = ((dataStore: Record<string, object>) => Promise<void>)[]
