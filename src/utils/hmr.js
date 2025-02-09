// export class HMR {
//     constructor() {
//         this.modules = new Map()
//     }

//     addModule(name, module) {
//         this.modules.set(name, module)
//     }

//     updateModule(name, newModule) {
//         if (this.modules.has(name)) {
//             const oldModule = this.modules.get(name)
//             if (oldModule.hot && typeof oldModule.hot.accept === "function") {
//                 oldModule.hot.accept(newModule)
//             } else {
//                 this.modules.set(name, newModule)
//             }
//             return true
//         }
//         return false
//     }

//     applyUpdate(name, content) {
//         const newModule = { exports: {} }
//         const updateFunction = new Function("module", "exports", content)
//         updateFunction(newModule, newModule.exports)
//         return this.updateModule(name, newModule.exports)
//     }
// }

// export const hmr = new HMR()

