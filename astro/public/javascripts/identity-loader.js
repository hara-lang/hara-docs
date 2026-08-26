(() => {
  "use strict";

  if (document.querySelector("script[data-hara-identity-client]")) return;

  let mode = document.querySelector('meta[name="hara-identity-mode"]');
  if (!mode) {
    mode = document.createElement("meta");
    mode.name = "hara-identity-mode";
    mode.content = "popup";
    document.head.append(mode);
  }

  const testing = location.hostname === "docs.testing.hara-lang.org"
    || location.hostname.endsWith(".testing.hara-lang.org");
  const identityOrigin = testing
    ? "https://id.testing.hara-lang.org"
    : "https://id.hara-lang.org";

  const client = document.createElement("script");
  client.src = `${identityOrigin}/v1/identity-client.js`;
  client.defer = true;
  client.dataset.haraIdentityClient = "";
  document.head.append(client);
})();
