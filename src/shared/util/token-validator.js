export const validateSocialNetworkExpirationToken = (
  socialNetworkExpirationDate
) => {
  if (
    !socialNetworkExpirationDate ||
    Date(socialNetworkExpirationDate) < new Date()
  ) {
    return false;
  }
  return true;
};
