import type { HowToStepInput, JsonLdObject } from '../types.js';

export interface HowToInput {
  name: string;
  description: string;
  totalTime?: string;
  steps: HowToStepInput[];
}

export function buildHowToJsonLd(input: HowToInput): JsonLdObject {
  const jsonLd: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    step: input.steps.map((step, index) => {
      const obj: JsonLdObject = {
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
      };
      if (step.image) obj.image = step.image;
      return obj;
    }),
  };

  if (input.totalTime) jsonLd.totalTime = input.totalTime;

  return jsonLd;
}
