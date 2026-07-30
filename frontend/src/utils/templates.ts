export function extractVariables(text: string): string[] {

    const matches = text.match(
        /{{(.*?)}}/g
    );

    if (!matches)
        return [];

    return [
        ...new Set(
            matches.map(variable =>
                variable
                    .replace("{{", "")
                    .replace("}}", "")
                    .trim()
            )
        )
    ];
}

