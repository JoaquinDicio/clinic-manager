import { Message } from "../types/whatsapp.types.js"

const phoneRegex = /^\+?[0-9]{7,15}$/

export function isValidMessage(msg: unknown): msg is Message {
    return (
        typeof msg === "object" &&
        msg !== null &&
        typeof (msg as Message).phone === "string" &&
        typeof (msg as Message).message === "string" &&
        (msg as Message).message.trim() !== "" &&
        phoneRegex.test((msg as Message).phone.trim())
    )
}

export function validateBulkPayload(messages: unknown): string | null {

    if (!Array.isArray(messages)) return "messages must be an array"

    if (messages.length === 0) return "messages array is empty"

    const invalidIndexes = messages
        .map((msg, i) => (!isValidMessage(msg) ? i : null))
        .filter((i) => i !== null)

    if (invalidIndexes.length > 0) {
        return `Invalid messages at indexes: ${invalidIndexes.join(", ")}`
    }

    return null
}