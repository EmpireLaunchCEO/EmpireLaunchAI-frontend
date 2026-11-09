// Stripe Payment Links — update these in Stripe dashboard if needed
export const SUBSCRIPTION_LINK = 'https://buy.stripe.com/cNifZhaIo3vIfzxatFefC04';
export const EXPANSION_SLOT_LINK = 'https://buy.stripe.com/4gM28r4k08Q2drp1X9efC06';
export const BRAND_3_EXPANSION_LINK = 'https://buy.stripe.com/eVq6oH7wcd6i5YX0T5efC07';

/**
 * Attach WHO is paying to one of the links above.
 *
 * The money is taken by the owner's own Stripe account, so the app only learns a
 * client paid from Stripe's webhook — and the only way that webhook can know which
 * client it was is `client_reference_id`, which the frontend appends here. Without
 * it a real payment arrives anonymous and has to be matched by hand.
 *
 * Any existing query string on the link is preserved; values are URL-encoded.
 */
export function withPaymentIdentity(
  link: string,
  identity: { userId?: string | null; email?: string | null } = {},
): string {
  try {
    const url = new URL(link);
    const userId = (identity.userId || '').trim();
    if (userId) url.searchParams.set('client_reference_id', userId);
    const email = (identity.email || '').trim();
    if (email) url.searchParams.set('prefilled_email', email);
    return url.toString();
  } catch {
    return link;
  }
}
