import type { HowToStepInput, JsonLdObject } from '../types.js';
export interface HowToInput {
    name: string;
    description: string;
    totalTime?: string;
    steps: HowToStepInput[];
}
export declare function buildHowToJsonLd(input: HowToInput): JsonLdObject;
//# sourceMappingURL=howto.d.ts.map