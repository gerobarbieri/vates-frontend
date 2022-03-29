export const loginHandler = async (
  url,
  socialNetwork,
  setError,
  socialNetworkAuth
) => {
  const newWindow = window.open(url, 400, 500);

  if (window.focus) {
    newWindow.focus();
  }
  const intr = setInterval(() => {
    if (newWindow.closed) {
      clearInterval(intr);
    }

    let search;
    try {
      search = newWindow.location.search;
      if (search) {
        const params = new URLSearchParams(search);
        if (params.get("error") || !params.get("code")) {
          setError(
            "Error al iniciar sesion o al conceder los permisos. Intentelo nuevamente."
          );
        } else {
          socialNetworkAuth(params.get("code"), socialNetwork);
        }
        newWindow.close();
      }
    } catch (err) {}
  }, 400);
};
