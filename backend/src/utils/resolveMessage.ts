function resolveMessage(body: string, data: Record<string, unknown>) {
  return body.replace(/{{(\w+)}}/g, (_, key) => {
    const value = data[key];

    return value !== undefined && value !== null ? String(value) : `{{${key}}}`;
  });
}

export default resolveMessage;
