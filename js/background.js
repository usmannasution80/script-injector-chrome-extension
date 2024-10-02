chrome.webRequest.onHeadersReceived.addListener(
  details => {
    const headers = details.responseHeaders.filter(header => !/content-security-policy/gi.test(header.name.toLowerCase()));
    return { responseHeaders: headers };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
);