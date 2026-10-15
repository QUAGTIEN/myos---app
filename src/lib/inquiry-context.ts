import { productCategories } from '@/content/products';
import { solutions } from '@/content/solutions';
import { projectSamples } from '@/content/projects';
import type { InquiryContext } from '@/types/inquiry';

// Validate public IDs against canonical data. Ignore unknown keys and never echo
// raw URL values. Repeated supported parameters are ambiguous and are rejected.
export function parseInquiryContext(params: Pick<URLSearchParams, 'getAll'>): InquiryContext {
  let hasInvalidSelection = false;
  function single(key: string) {
    const values = params.getAll(key);
    if (!values.length) return '';
    if (values.length !== 1 || !/^[a-z0-9-]{1,80}$/.test(values[0])) {
      hasInvalidSelection = true;
      return '';
    }
    return values[0];
  }

  const productValue = single('san-pham');
  const solutionValue = single('nhu-cau');
  const sampleValue = single('du-an');
  const product = productCategories.find(item => item.slug === productValue);
  const solution = solutions.find(item => item.slug === solutionValue);
  const sample = projectSamples.find(item => item.slug === sampleValue);
  if ((productValue && !product) || (solutionValue && !solution) || (sampleValue && !sample)) hasInvalidSelection = true;

  return {
    productSlug: product?.slug ?? sample?.productSlug ?? '',
    solutionSlug: solution?.slug ?? sample?.solutionSlug ?? '',
    projectSlug: sample?.slug ?? '',
    hasInvalidSelection,
  };
}
