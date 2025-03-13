import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const ROOT_DIR = path.resolve(__dirname, "..", "websites")
export const SKELETON_DIR = path.resolve(__dirname, "..", "skeleton")