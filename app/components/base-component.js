import store from "../store"

const ARRAY_REF_PATTERN = /([a-zA-Z\d]*)(\[?\]?)/ // Ends with brackets e.g. [data-ref="foo[]"]

export default class BaseComponent {
  element = null;
  refs = {};
  serializer = document.createElement("div");
  store = store;

  constructor(spec = {}) {
    Object.assign(this, spec)
  }

  // NOTE: Calling `updateRefs` multiple times from different tree depths may
  // allow parents to inherit a grandchild.
  updateRefs() {
    const {refs} = this

    Array
      .from(this.element.querySelectorAll("[data-ref]"))
      .forEach(element => {
        const attribute = element.getAttribute("data-ref")
        const [, key, arrayKey] = attribute.match(ARRAY_REF_PATTERN)

        if (arrayKey) {
          // Multiple elements
          if (!Array.isArray(refs[key])) refs[key] = []

          refs[key].push(element)
        }
        else {
          // Single element
          refs[key] = element
        }

        element.removeAttribute("data-ref")
      })
  }

  compileTemplate(options = {}) {
    if (typeof this.template === "function") {
      this.serializer.innerHTML = this.template({store, ...options})
    }
    else {
      this.serializer.innerHTML = this.template
    }

    this.element = this.serializer.firstChild
    this.updateRefs()

    return this.element
  }

  render() {
    return this.compileTemplate()
  }

  // TODO: Check if this used after the app is fleshed out.
  replaceElement(current, next) {
    current.parentNode.insertBefore(next, current)
    current.parentNode.removeChild(current)

    this.updateRefs()
  }
}