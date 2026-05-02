export type JsonLdValue = string | number | boolean | null | JsonLdObject | JsonLdValue[];
export interface JsonLdObject {
    '@context'?: string;
    '@type'?: string | string[];
    [key: string]: JsonLdValue | undefined;
}
export interface PostalAddress {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
}
export interface OpeningHours {
    dayOfWeek: string[];
    opens: string;
    closes: string;
}
export interface ContactPoint {
    telephone?: string;
    email?: string;
    contactType?: string;
    availableLanguage?: string[];
    hoursAvailable?: OpeningHours;
}
export interface OrganizationConfig {
    type?: 'Organization' | 'EducationalOrganization' | 'LocalBusiness' | 'Corporation';
    name: string;
    alternateName?: string[];
    description?: string;
    foundingDate?: string;
    logo?: string;
    address?: PostalAddress;
    contactPoint?: ContactPoint | ContactPoint[];
    sameAs?: string[];
}
export interface SiteConfig {
    siteUrl: string;
    siteName: string;
    defaultLocale?: string;
    defaultOgImage?: string;
    organization?: OrganizationConfig;
    publisher?: {
        name: string;
    };
}
export interface BreadcrumbItem {
    name: string;
    path?: string;
}
export interface FaqItem {
    question: string;
    answer: string;
}
export interface HowToStepInput {
    name: string;
    text: string;
    image?: string;
}
export interface ServiceOfferInput {
    name: string;
    description: string;
}
export type SchemaOrgType = string;
export declare function absoluteUrl(siteUrl: string, pathOrUrl: string): string;
//# sourceMappingURL=types.d.ts.map