export function buildHowToJsonLd(input) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: input.name,
        description: input.description,
        step: input.steps.map((step, index) => {
            const obj = {
                '@type': 'HowToStep',
                position: index + 1,
                name: step.name,
                text: step.text,
            };
            if (step.image)
                obj.image = step.image;
            return obj;
        }),
    };
    if (input.totalTime)
        jsonLd.totalTime = input.totalTime;
    return jsonLd;
}
//# sourceMappingURL=howto.js.map